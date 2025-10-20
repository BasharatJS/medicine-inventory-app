/**
 * OCR Service - Invoice Text Extraction
 *
 * Supports multiple OCR providers:
 * 1. Google Cloud Vision API (Best for printed text)
 * 2. OpenAI GPT-4 Vision (Best for intelligent extraction)
 * 3. Google Gemini Vision (Alternative to GPT-4V)
 * 4. Tesseract.js (Free, offline)
 *
 * Setup Instructions:
 * 1. Add API keys to .env.local
 * 2. Set NEXT_PUBLIC_OCR_PROVIDER in .env.local
 * 3. Install dependencies if needed
 */

import { PurchaseInvoiceItem } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

export type OCRProvider = 'google-vision' | 'gpt4-vision' | 'gemini-vision' | 'tesseract';

export interface OCRResult {
  success: boolean;
  extractedText?: string;
  parsedData?: Partial<{
    invoiceNumber: string;
    supplierName: string;
    invoiceDate: string;
    items: Partial<PurchaseInvoiceItem>[];
  }>;
  error?: string;
}

class OCRService {
  private provider: OCRProvider;

  constructor() {
    this.provider = (process.env.NEXT_PUBLIC_OCR_PROVIDER as OCRProvider) || 'tesseract';
  }

  /**
   * Extract text from invoice image
   */
  async extractTextFromImage(imageFile: File): Promise<OCRResult> {
    try {
      console.log(`Using OCR provider: ${this.provider}`);

      switch (this.provider) {
        case 'google-vision':
          return await this.useGoogleVision(imageFile);

        case 'gpt4-vision':
          return await this.useGPT4Vision(imageFile);

        case 'gemini-vision':
          return await this.useGeminiVision(imageFile);

        case 'tesseract':
          return await this.useTesseract(imageFile);

        default:
          return {
            success: false,
            error: 'Invalid OCR provider configured'
          };
      }
    } catch (error: any) {
      console.error('OCR Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process image'
      };
    }
  }

  /**
   * Google Cloud Vision API
   * API Docs: https://cloud.google.com/vision/docs/ocr
   */
  private async useGoogleVision(imageFile: File): Promise<OCRResult> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;

    if (!apiKey || apiKey === 'your_google_vision_api_key_here') {
      return {
        success: false,
        error: 'Google Vision API key not configured. Please add NEXT_PUBLIC_GOOGLE_VISION_API_KEY to .env.local'
      };
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);

      // Call Google Vision API
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Image.split(',')[1] },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.responses?.[0]?.fullTextAnnotation?.text) {
        const extractedText = data.responses[0].fullTextAnnotation.text;

        // Parse the extracted text
        const parsedData = this.parseInvoiceText(extractedText);

        return {
          success: true,
          extractedText,
          parsedData
        };
      } else {
        return {
          success: false,
          error: 'No text detected in image'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Google Vision Error: ${error.message}`
      };
    }
  }

  /**
   * OpenAI GPT-4 Vision API
   * API Docs: https://platform.openai.com/docs/guides/vision
   */
  private async useGPT4Vision(imageFile: File): Promise<OCRResult> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local'
      };
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);

      // Call OpenAI API via our API route (to hide API key)
      const response = await fetch('/api/ocr/gpt4-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          extractedText: data.extractedText,
          parsedData: data.parsedData
        };
      } else {
        return {
          success: false,
          error: data.error || 'GPT-4 Vision failed to process image'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `GPT-4 Vision Error: ${error.message}`
      };
    }
  }

  /**
   * Google Gemini Vision API
   * API Docs: https://ai.google.dev/tutorials/get_started_web
   */
  private async useGeminiVision(imageFile: File): Promise<OCRResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return {
        success: false,
        error: 'Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to .env.local'
      };
    }

    try {
      // Call Gemini API via our API route
      const base64Image = await this.fileToBase64(imageFile);

      const response = await fetch('/api/ocr/gemini-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          extractedText: data.extractedText,
          parsedData: data.parsedData
        };
      } else {
        return {
          success: false,
          error: data.error || 'Gemini Vision failed to process image'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: `Gemini Vision Error: ${error.message}`
      };
    }
  }

  /**
   * Tesseract.js - Free, Offline OCR
   * GitHub: https://github.com/naptha/tesseract.js
   */
  private async useTesseract(imageFile: File): Promise<OCRResult> {
    try {
      // Note: Tesseract.js will be dynamically imported when needed
      // This keeps the bundle size small
      const Tesseract = await import('tesseract.js');

      const worker = await Tesseract.createWorker('eng');

      const { data: { text } } = await worker.recognize(imageFile);

      await worker.terminate();

      const parsedData = this.parseInvoiceText(text);

      return {
        success: true,
        extractedText: text,
        parsedData
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Tesseract Error: ${error.message}. Make sure to install: npm install tesseract.js`
      };
    }
  }

  /**
   * Parse extracted text into structured invoice data
   * This is a basic parser - AI-based parsing is better
   */
  private parseInvoiceText(text: string): OCRResult['parsedData'] {
    const parsedData: OCRResult['parsedData'] = {
      items: []
    };

    // Extract invoice number (common patterns)
    const invoicePatterns = [
      /invoice\s*(?:no|number|#)[:\s]*([A-Z0-9\-\/]+)/i,
      /bill\s*(?:no|number|#)[:\s]*([A-Z0-9\-\/]+)/i,
      /inv[:\s]*([A-Z0-9\-\/]+)/i
    ];

    for (const pattern of invoicePatterns) {
      const match = text.match(pattern);
      if (match) {
        parsedData.invoiceNumber = match[1].trim();
        break;
      }
    }

    // Extract date (various formats)
    const datePatterns = [
      /(?:date|dated)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        parsedData.invoiceDate = match[1].trim();
        break;
      }
    }

    // This is basic parsing - for better results, use AI (GPT-4V or Gemini)
    // The AI will understand the invoice structure and extract items automatically

    return parsedData;
  }

  /**
   * Convert File to Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const ocrService = new OCRService();
