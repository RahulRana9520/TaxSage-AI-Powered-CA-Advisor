# 📱 UPDATE MOBILE APP WITH VERCEL URL

## 🎯 WHAT TO UPDATE

You need to replace the local IP address with your actual Vercel deployment URL.

## 🔍 FIND YOUR VERCEL URL

1. **Go to [vercel.com](https://vercel.com/dashboard)**
2. **Click on your TaxSage project**
3. **Copy the URL** - it looks like:
   ```
   https://taxsage-ca-advisor.vercel.app
   OR
   https://your-project-name.vercel.app
   ```

## ✏️ UPDATE THE APP

### Step 1: Update API Configuration

Open: `C:\CA project\TaxSageAPK\TaxSageApp\src\constants\index.ts`

**Change this line:**
```typescript
BASE_URL: 'http://10.163.85.32:3000', // Your computer's IP address
```

**To this (use YOUR Vercel URL):**
```typescript
BASE_URL: 'https://your-project-name.vercel.app', // Your Vercel deployment
```

### Step 2: Example Update

If your Vercel URL is `https://taxsage-ca-advisor.vercel.app`, then update to:

```typescript
// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://taxsage-ca-advisor.vercel.app', // ✅ Cloud backend
  ENDPOINTS: {
    AUTH: '/api/auth',
    CHAT: '/api/chat',
    ANALYTICS: '/api/analytics',
    ME: '/api/me',
  },
  TIMEOUT: 30000,
};
```

## 🚀 AFTER UPDATING

Once you update the URL, we'll rebuild the APK and it will work from anywhere with internet connection!

**Reply with your Vercel URL and I'll update the file for you!**

Example Vercel URLs:
- `https://taxsage-ca-advisor.vercel.app`
- `https://taxsage.vercel.app`
- `https://ca-advisor-taxsage.vercel.app`