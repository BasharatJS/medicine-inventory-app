import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Gemini Vision API Route
 *
 * This route processes invoice images using Google's Gemini Vision
 * and extracts structured invoice data
 *
 * Setup:
 * 1. Get API key from: https://makersuite.google.com/app/apikey
 * 2. Add to .env.local: GOOGLE_GEMINI_API_KEY=your_key_here
 */

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key not configured. Please add GOOGLE_GEMINI_API_KEY to .env.local file.'
      }, { status: 500 });
    }

    // Extract base64 data (remove data:image/xxx;base64, prefix)
    const base64Data = image.split(',')[1] || image;

    // Call Google Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are an expert at extracting data from medical/pharmaceutical purchase invoices.

Analyze this invoice image and extract the following information in JSON format:

{
  "invoiceNumber": "invoice number",
  "supplierName": "supplier/vendor name",
  "invoiceDate": "date in DD/MM/YYYY format",
  "items": [
    {
      "medicineName": "full medicine name with strength",
      "genericName": "generic/salt name if visible",
      "manufacturer": "manufacturer company if visible",
      "category": "medicine type (Tablet/Capsule/Syrup/etc)",
      "batchNumber": "batch number",
      "quantity": numeric quantity,
      "mrp": numeric MRP price,
      "purchasePrice": numeric purchase price,
      "expiryDate": "expiry date in DD/MM/YYYY format",
      "manufacturingDate": "mfg date in DD/MM/YYYY format if visible",
      "gstRate": GST percentage (usually 12)
    }
  ]
}

Extract ALL items from the invoice. If a field is not visible, use null.
Be precise with numbers and dates.
Return only valid JSON, no additional text.`
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Failed to process image with Gemini Vision'
      }, { status: response.status });
    }

    // Extract the text response
    const extractedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!extractedContent) {
      return NextResponse.json({
        success: false,
        error: 'No content extracted from image'
      }, { status: 500 });
    }

    // Parse the JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonText = extractedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse extracted data',
        extractedText: extractedContent
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      extractedText: extractedContent,
      parsedData: parsedData
    });

  } catch (error: any) {
    console.error('OCR API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
