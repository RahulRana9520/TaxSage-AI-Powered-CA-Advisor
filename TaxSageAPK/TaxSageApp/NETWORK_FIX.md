# Network Configuration Fix for TaxSage Mobile App

## Problem
"Authentication Error: Network request failed" occurs because:
- Mobile app was trying to connect to `localhost:3000`
- On mobile device, `localhost` refers to the phone itself, not your computer
- Your computer has IP address: `10.163.85.32`

## Solution Applied
✅ Updated API configuration to use your computer's IP address:
- Changed from: `http://localhost:3000`
- Changed to: `http://10.163.85.32:3000`
- Rebuilt APK with new configuration

## Required Steps

### 1. Update Your Backend Server
Your Next.js server needs to accept connections from other devices on the network.

**Start your backend server with network binding:**
```bash
cd "C:\CA project"
npm run dev -- -H 0.0.0.0 -p 3000
# OR
npx next dev -H 0.0.0.0 -p 3000
```

### 2. Check Windows Firewall
Ensure Windows allows connections on port 3000:

**Option A: Allow through Windows Firewall**
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change Settings" → "Allow another app..."
4. Browse to Node.js executable or add port 3000

**Option B: Temporary disable firewall for testing**
```powershell
# Disable (for testing only!)
netsh advfirewall set allprofiles state off

# Re-enable after testing
netsh advfirewall set allprofiles state on
```

### 3. Install Updated APK
**New APK Location:**
`C:\CA project\TaxSageAPK\TaxSageApp\android\app\build\outputs\apk\debug\app-debug.apk`

**Installation Steps:**
1. Transfer new APK to your phone
2. Uninstall old version if installed
3. Install new APK
4. Enable "Install from unknown sources" if prompted

### 4. Network Requirements
**Both devices must be on same network:**
- Computer IP: `10.163.85.32`
- Phone: Connected to same WiFi/network
- Port 3000 accessible between devices

## Testing Steps

### 1. Test Server Accessibility
**From your computer:**
```bash
curl http://10.163.85.32:3000/api/me
# Should return API response
```

**From another device on network:**
- Open browser on phone/another computer
- Navigate to: `http://10.163.85.32:3000`
- Should see your Next.js application

### 2. Test Mobile App
1. Install updated APK
2. Try creating account
3. Should connect successfully

## Common Issues & Solutions

### Issue: Still getting "Network request failed"
**Check:**
- [ ] Server running on `0.0.0.0:3000` (not just localhost)
- [ ] Firewall allows port 3000
- [ ] Both devices on same network
- [ ] Correct IP address in app config

### Issue: Server not accessible
**Solutions:**
```bash
# Check what's listening on port 3000
netstat -an | findstr ":3000"

# Start server with network binding
npm run dev -- -H 0.0.0.0

# Or use specific IP
npm run dev -- -H 10.163.85.32
```

### Issue: IP Address Changed
If your IP changes, update the config and rebuild:
```typescript
// In src/constants/index.ts
BASE_URL: 'http://NEW-IP-ADDRESS:3000'
```

## Alternative: Use ngrok (if local network doesn't work)

**Install ngrok:**
```bash
npm install -g ngrok
```

**Expose your server:**
```bash
# Start your server first
npm run dev

# In another terminal
ngrok http 3000
```

**Update app config with ngrok URL:**
```typescript
BASE_URL: 'https://abc123.ngrok.io' // Use the URL ngrok provides
```

---

**Next Steps:**
1. Start server with network binding: `npm run dev -- -H 0.0.0.0`
2. Install updated APK on phone
3. Test account creation
4. Should work now! 🎉