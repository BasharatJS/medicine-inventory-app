'use client';

import { useState, useRef } from 'react';
import Button from '@/components/shared/Button';
import Alert from '@/components/shared/Alert';
import { ocrService, OCRResult } from '@/lib/services/ocrService';
import { PurchaseInvoiceItem } from '@/lib/types';

interface OCRImageUploaderProps {
  onDataExtracted: (data: OCRResult['parsedData']) => void;
}

export default function OCRImageUploader({ onDataExtracted }: OCRImageUploaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setImageFile(file);
    setError(null);
    setSuccess(null);
    setExtractedText(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setExtractedText(null);

    try {
      // Process image with OCR
      const result: OCRResult = await ocrService.extractTextFromImage(imageFile);

      if (result.success) {
        setSuccess('Image processed successfully!');
        setExtractedText(result.extractedText || '');

        // Pass parsed data to parent
        if (result.parsedData) {
          onDataExtracted(result.parsedData);
        }
      } else {
        setError(result.error || 'Failed to process image');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the image');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setSuccess(null);
    setExtractedText(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Invoice Image for OCR
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageSelect}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            disabled={isProcessing}
          />
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: JPG, PNG, PDF. Max size: 10MB
          </p>
        </div>

        {imageFile && !isProcessing && (
          <div className="mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={clearImage}
            >
              🗑️ Clear
            </Button>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4">
          <h4 className="font-semibold text-slate-700 mb-3">Image Preview</h4>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <img
                src={imagePreview}
                alt="Invoice preview"
                className="max-w-full md:max-w-md h-auto max-h-96 object-contain border border-slate-300 rounded-lg shadow-sm"
              />
            </div>

            <div className="flex-1 space-y-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleProcessImage}
                isLoading={isProcessing}
                disabled={isProcessing}
              >
                {isProcessing ? '🔄 Processing...' : '🔍 Extract Data from Image'}
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <h5 className="font-semibold text-blue-900 mb-2">OCR Instructions:</h5>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>Make sure the invoice is clearly visible</li>
                  <li>Good lighting improves accuracy</li>
                  <li>Avoid shadows and glare</li>
                  <li>Hold camera steady</li>
                  <li>Processing may take 10-30 seconds</li>
                </ul>
              </div>

              {isProcessing && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                    <div>
                      <p className="font-semibold text-yellow-900">Processing Image...</p>
                      <p className="text-sm text-yellow-700">
                        Extracting text and invoice data. Please wait...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Extracted Text Preview */}
      {extractedText && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">✅ Extracted Text</h4>
          <div className="bg-white border border-green-300 rounded p-3 max-h-60 overflow-y-auto">
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
              {extractedText}
            </pre>
          </div>
          <p className="text-sm text-green-700 mt-3">
            📝 Data has been extracted and added to the invoice form below. Please review and edit if needed.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-purple-900 mb-2">🤖 AI-Powered OCR (Optical Character Recognition)</h4>
        <p className="text-purple-800 mb-2">
          This feature uses AI to automatically extract invoice data from images. Currently configured provider:
          <strong className="ml-1">{process.env.NEXT_PUBLIC_OCR_PROVIDER || 'tesseract'}</strong>
        </p>
        <div className="bg-purple-100 border border-purple-300 rounded p-3 mt-3">
          <p className="font-semibold text-purple-900 mb-1">Available OCR Providers:</p>
          <ul className="list-disc list-inside text-purple-800 space-y-1">
            <li><strong>Tesseract.js</strong> - Free, offline (default)</li>
            <li><strong>Google Vision</strong> - High accuracy for printed text</li>
            <li><strong>GPT-4 Vision</strong> - Best for intelligent extraction</li>
            <li><strong>Gemini Vision</strong> - Google's AI alternative</li>
          </ul>
          <p className="text-xs text-purple-700 mt-2">
            To enable AI providers, add API keys to .env.local file. See OCR_SETUP_GUIDE.md for details.
          </p>
        </div>
      </div>
    </div>
  );
}
