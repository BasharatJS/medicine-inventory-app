# 🤖 OCR (AI Invoice Scanner) Setup Guide

## Overview

The OCR feature allows you to scan physical invoices using your camera/phone and automatically extract all invoice data using AI. This feature supports **4 different OCR providers**.

---

## 📋 Quick Summary

| Provider | Cost | Accuracy | Speed | Best For |
|----------|------|----------|-------|----------|
| **Tesseract.js** | FREE | Good | Medium | Offline, printed text |
| **Google Vision** | Paid | Excellent | Fast | Printed text, documents |
| **GPT-4 Vision** | Paid | Best | Medium | Complex invoices, handwriting |
| **Gemini Vision** | Paid/Free | Excellent | Fast | Alternative to GPT-4V |

---

## 🚀 Quick Start (Using FREE Tesseract.js)

### Step 1: Install Tesseract.js

```bash
npm install tesseract.js
```

### Step 2: Set Provider in .env.local

```bash
NEXT_PUBLIC_OCR_PROVIDER=tesseract
```

### Step 3: Restart Development Server

```bash
npm run dev
```

**That's it! OCR is now working with free, offline Tesseract.js!**

---

## 🔧 Setup Option 1: Google Cloud Vision API

### Benefits:
- ✅ Best accuracy for printed text
- ✅ Fast processing
- ✅ Supports multiple languages
- ✅ 1000 free requests/month

### Setup Steps:

#### 1. Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Cloud Vision API**:
   - Go to **APIs & Services** → **Library**
   - Search for "Cloud Vision API"
   - Click **Enable**
4. Create credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy the API key

#### 2. Add to .env.local

Create or edit `.env.local` file in project root:

```bash
# Google Cloud Vision API
NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_actual_api_key_here

# Set provider
NEXT_PUBLIC_OCR_PROVIDER=google-vision
```

#### 3. Restart Server

```bash
npm run dev
```

### Pricing:
- First 1000 requests/month: **FREE**
- After that: $1.50 per 1000 images

---

## 🔧 Setup Option 2: OpenAI GPT-4 Vision (RECOMMENDED)

### Benefits:
- ✅ BEST accuracy for complex invoices
- ✅ Understands invoice structure intelligently
- ✅ Works with handwritten text
- ✅ Can handle messy/unclear images

### Setup Steps:

#### 1. Get API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or login
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)

#### 2. Add to .env.local

```bash
# OpenAI API
OPENAI_API_KEY=sk-your_actual_api_key_here

# Set provider
NEXT_PUBLIC_OCR_PROVIDER=gpt4-vision
```

#### 3. Restart Server

```bash
npm run dev
```

### Pricing:
- ~$0.01 per invoice image
- GPT-4o model: $0.005 per image input
- Very affordable for occasional use

---

## 🔧 Setup Option 3: Google Gemini Vision

### Benefits:
- ✅ Excellent accuracy
- ✅ Free tier available
- ✅ Fast processing
- ✅ Good alternative to GPT-4

### Setup Steps:

#### 1. Get API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click **Create API Key**
4. Copy the key

#### 2. Add to .env.local

```bash
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here

# Set provider
NEXT_PUBLIC_OCR_PROVIDER=gemini-vision
```

#### 3. Restart Server

```bash
npm run dev
```

### Pricing:
- Gemini 1.5 Flash: **FREE** up to 1500 requests/day
- Very generous free tier

---

## 📝 Complete .env.local Example

Create `.env.local` file in project root:

```bash
# Firebase (Already configured)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OCR Configuration (Choose ONE)

# Option 1: Google Vision
# NEXT_PUBLIC_GOOGLE_VISION_API_KEY=your_key_here
# NEXT_PUBLIC_OCR_PROVIDER=google-vision

# Option 2: GPT-4 Vision (RECOMMENDED)
OPENAI_API_KEY=sk-your_key_here
NEXT_PUBLIC_OCR_PROVIDER=gpt4-vision

# Option 3: Gemini Vision
# GOOGLE_GEMINI_API_KEY=your_key_here
# NEXT_PUBLIC_OCR_PROVIDER=gemini-vision

# Option 4: Tesseract (FREE - Default)
# NEXT_PUBLIC_OCR_PROVIDER=tesseract
```

---

## 🎯 How to Use OCR Feature

### Step 1: Navigate to Purchase Invoice Page
- Dashboard → Click **"Bulk Purchase"**
- OR Sidebar → **"Purchase Invoice"**

### Step 2: Upload Invoice Image
1. Scroll to **"🤖 AI-Powered Invoice Scanner"** section
2. Click **"Choose File"** or use camera (mobile)
3. Select invoice image

### Step 3: Process Image
1. Image preview will appear
2. Click **"🔍 Extract Data from Image"** button
3. Wait 10-30 seconds (depending on provider)

### Step 4: Review & Edit
1. Extracted data appears in the table below
2. Review all fields
3. Edit if needed
4. Click **"✓ Confirm & Update Stock"**

---

## 📸 Tips for Best Results

### Camera/Photo Quality:
- ✅ Use good lighting (natural light is best)
- ✅ Avoid shadows and glare
- ✅ Hold camera steady
- ✅ Capture entire invoice in frame
- ✅ Make sure text is clear and readable

### Image Format:
- ✅ JPG, PNG, WebP supported
- ✅ Max file size: 10MB
- ✅ Higher resolution = better accuracy
- ❌ Avoid blurry images
- ❌ Avoid too dark/light images

### Invoice Layout:
- ✅ Flat, unwrinkled paper works best
- ✅ Straight angle (not tilted)
- ✅ All text visible and in focus
- ⭐ AI providers (GPT-4V, Gemini) can handle messy invoices better

---

## 🔍 What Data is Extracted?

The AI automatically extracts:

### Header Information:
- ✅ Invoice number
- ✅ Supplier/vendor name
- ✅ Invoice date

### Item Details (for each medicine):
- ✅ Medicine name with strength
- ✅ Generic/salt name
- ✅ Manufacturer
- ✅ Batch number
- ✅ Quantity
- ✅ MRP (selling price)
- ✅ Purchase price
- ✅ Expiry date
- ✅ Manufacturing date (if visible)
- ✅ GST rate

---

## ⚙️ Provider Comparison

### Tesseract.js (FREE)
**Pros:**
- ✅ Completely free
- ✅ Works offline
- ✅ No API key needed
- ✅ Privacy (no data sent to cloud)

**Cons:**
- ❌ Lower accuracy than AI
- ❌ Slower processing
- ❌ Struggles with handwriting
- ❌ Requires clear, printed text

**Best For:** Printed invoices, offline use, budget projects

---

### Google Vision API
**Pros:**
- ✅ Excellent accuracy
- ✅ Very fast
- ✅ Free tier (1000/month)
- ✅ Mature, reliable

**Cons:**
- ❌ Paid after free tier
- ❌ Requires Google Cloud account
- ❌ Only extracts text (not structured)

**Best For:** High-volume, printed documents

---

### GPT-4 Vision (OpenAI)
**Pros:**
- ✅ BEST accuracy
- ✅ Understands context
- ✅ Handles messy invoices
- ✅ Works with handwriting
- ✅ Intelligent data extraction

**Cons:**
- ❌ Costs money (~$0.01/image)
- ❌ Slower than Google Vision
- ❌ Requires OpenAI account

**Best For:** Complex invoices, handwritten text, accuracy critical

---

### Gemini Vision (Google)
**Pros:**
- ✅ Excellent accuracy
- ✅ FREE tier (1500/day)
- ✅ Fast processing
- ✅ Good AI understanding

**Cons:**
- ❌ Newer, less tested
- ❌ Requires Google account

**Best For:** Best free AI option, alternative to GPT-4

---

## 🐛 Troubleshooting

### Problem: "API key not configured"
**Solution:**
- Check `.env.local` file exists in project root
- Verify API key is correct
- Restart development server: `npm run dev`

### Problem: "Failed to process image"
**Solution:**
- Check image is clear and readable
- Try different lighting
- Reduce image size if > 10MB
- Try different OCR provider

### Problem: Incorrect data extracted
**Solution:**
- Use GPT-4 Vision or Gemini (better AI)
- Improve image quality
- Manually edit extracted data
- Use CSV upload instead for complex invoices

### Problem: Tesseract not found
**Solution:**
```bash
npm install tesseract.js
```

### Problem: Slow processing
**Solution:**
- Google Vision is fastest
- Reduce image size
- Use better internet connection

---

## 💰 Cost Estimation

### Monthly Usage Examples:

**Small Pharmacy (10 invoices/month):**
- Tesseract: **FREE**
- Google Vision: **FREE** (under 1000)
- GPT-4 Vision: **$0.10**
- Gemini: **FREE**

**Medium Pharmacy (100 invoices/month):**
- Tesseract: **FREE**
- Google Vision: **FREE** (under 1000)
- GPT-4 Vision: **$1.00**
- Gemini: **FREE**

**Large Pharmacy (500 invoices/month):**
- Tesseract: **FREE**
- Google Vision: **$0.75** (500 paid)
- GPT-4 Vision: **$5.00**
- Gemini: **FREE** (under daily limit)

---

## 🔒 Security & Privacy

### Data Handling:
- ✅ Images sent securely via HTTPS
- ✅ No images stored on AI servers (temporary processing)
- ✅ API keys stored in environment variables (never exposed)
- ✅ Firebase images stored in your bucket

### Recommendations:
- 🔐 Never commit .env.local to git
- 🔐 Use environment variables for production
- 🔐 Restrict API keys to your domain
- 🔐 Monitor API usage regularly

---

## 📚 Additional Resources

### Google Vision:
- [Documentation](https://cloud.google.com/vision/docs/ocr)
- [Pricing](https://cloud.google.com/vision/pricing)
- [Quickstart](https://cloud.google.com/vision/docs/quickstart)

### OpenAI GPT-4 Vision:
- [Documentation](https://platform.openai.com/docs/guides/vision)
- [Pricing](https://openai.com/pricing)
- [Examples](https://platform.openai.com/docs/guides/vision/quick-start)

### Google Gemini:
- [Documentation](https://ai.google.dev/docs)
- [Quickstart](https://ai.google.dev/tutorials/get_started_web)
- [Pricing](https://ai.google.dev/pricing)

### Tesseract.js:
- [GitHub](https://github.com/naptha/tesseract.js)
- [Documentation](https://tesseract.projectnaptha.com/)

---

## ✅ Quick Checklist

Before using OCR:

- [ ] Decided which provider to use
- [ ] Obtained API key (if not using Tesseract)
- [ ] Created `.env.local` file
- [ ] Added API key to `.env.local`
- [ ] Set `NEXT_PUBLIC_OCR_PROVIDER`
- [ ] Restarted development server
- [ ] Tested with sample invoice image

---

## 🎉 You're All Set!

OCR feature is now ready to use! Just:
1. Upload invoice image
2. Click "Extract Data"
3. Review & confirm

**Save hours of manual data entry!** 🚀

---

## 📞 Need Help?

- Check this guide first
- Verify API keys are correct
- Check browser console for errors
- Try different OCR provider
- Contact support

---

**Happy Scanning! 📸🎊**
