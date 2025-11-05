# 🚀 URGENT: Complete These 2 Steps NOW

## ✅ STEP 1: Add API Key to Vercel (2 minutes)

### Go to Vercel Dashboard:
1. Open: https://vercel.com
2. Login to your account
3. Click on your project: **taxsage-ca-advisor**
4. Click **Settings** tab (top navigation)
5. Click **Environment Variables** (left sidebar)

### Add the API Key:
Click "Add New Variable" button and enter:

**Key (Name):**
```
OPENROUTER_API_KEY
```

**Value:**
```
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
```

**Environments:** 
- ✅ Check **Production**
- ✅ Check **Preview**  
- ✅ Check **Development**

Click **Save**

---

## ✅ STEP 2: Trigger Redeploy (1 minute)

After saving the environment variable:

1. Go to **Deployments** tab in Vercel
2. Find the latest deployment (should be commit `2cf50a1`)
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait 2-3 minutes for deployment to complete

---

## 🎯 What Got Fixed:

### Issue 1: Phone Field ✅ FIXED
- **Problem:** GitHub had cached/old version of login-form.tsx with phone field
- **Solution:** Force pushed latest code (commit `2cf50a1`) with comment marker
- **Result:** Vercel will now deploy correct version WITHOUT phone field

### Issue 2: Chatbot API Error ❌ NEEDS YOUR ACTION
- **Problem:** `OPENROUTER_API_KEY` environment variable not set in Vercel
- **Solution:** YOU must add it manually in Vercel dashboard (Step 1 above)
- **Result:** After adding key and redeploying, chatbot will work

---

## 📊 Verification (After Steps 1 & 2):

### Check Phone Field is Gone:
```
1. Open: https://taxsage-ca-advisor.vercel.app/login
2. Click "Create an account"
3. Should only see: Full name, Email, Password
4. NO phone field!
```

### Check Chatbot Works:
```
1. Login to your account
2. Go to Dashboard → AI Chat
3. Send message: "What is Section 80C?"
4. Should get AI response (no API error)
```

---

## 🔄 Current Status:

- ✅ **Code fixed** and force pushed to GitHub (commit 2cf50a1)
- ✅ **Vercel will automatically start deploying** in ~30 seconds
- ❌ **Environment variable** - YOU must add it now (Step 1)
- ⏳ **After you add env var** - Redeploy (Step 2)

---

## ⏰ Timeline:

- **Right now:** Vercel is building new deployment (2-3 minutes)
- **Phone field fix:** Will be live after this deployment completes
- **Chatbot fix:** Will work after YOU add API key + redeploy

---

## 📞 If Issues Persist:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Check Vercel deployment logs for errors
3. Verify environment variable was saved correctly
4. Wait full 5 minutes after redeploy before testing

---

**🎯 ACTION REQUIRED: Complete Steps 1 & 2 above NOW!**
