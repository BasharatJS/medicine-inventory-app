import { NextRequest, NextResponse } from 'next/server';

/**
 * GPT-4 Vision API Route
 *
 * This route processes invoice images using OpenAI's GPT-4 Vision
 * and extracts structured invoice data
 *
 * Setup:
 * 1. Get API key from: https://platform.openai.com/api-keys
 * 2. Add to .env.local: OPENAI_API_KEY=your_key_here
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

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to .env.local file.'
      }, { status: 500 });
    }

    // Call OpenAI GPT-4 Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or gpt-4-turbo or gpt-4-vision-preview
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
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
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
        temperature: 0.1 // Low temperature for consistent extraction
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return NextResponse.json({
        success: false,
        error: data.error?.message || 'Failed to process image with GPT-4 Vision'
      }, { status: response.status });
    }

    // Extract the JSON response
    const extractedContent = data.choices?.[0]?.message?.content;

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
