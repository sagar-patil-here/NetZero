# ERPNext Connection Guide

## Step-by-Step Instructions

### 1. Start the Backend Server

**IMPORTANT:** The backend server must be running before connecting!

```bash
cd BackEnd
npm install  # Only needed first time
npm start
```

You should see:
```
✅ Cement CO₂ Calculator running on http://localhost:5000
```

### 2. Get Your ERPNext API Credentials

1. Log in to your ERPNext instance
2. Go to **User List** → Open your user
3. Click on the **"Settings"** tab
4. Expand the **"API Access"** section
5. Click **"Generate Keys"**
6. You will see:
   - **API Key** (e.g., `abc123xyz`)
   - **API Secret** (copy this immediately - it's only shown once!)

### 3. Connect from NetZero Dashboard

1. Click **"Connect Data Source"** button
2. Select **"API"**
3. Select **"ERPNext"**
4. Select **"Key-Secret"**

### 4. Enter Your Details

Fill in the form with:

#### Base URL
- **Format:** `https://your-instance.erpnext.com`
- **Example:** `https://demo.erpnext.com`
- **Note:** Don't include `/api` or trailing slashes

#### API Key
- **Where to find:** User Settings → API Access section
- **Format:** Plain text (e.g., `abc123xyz`)
- **Example:** `a1b2c3d4e5f6`

#### API Secret
- **Where to find:** Generated when you click "Generate Keys"
- **Format:** Long string (e.g., `xyz789abc123...`)
- **Example:** `secret_key_123456789abcdef`
- **Note:** This is a password field (hidden)

### 5. Click "Connect"

The system will:
1. Test authentication with ERPNext
2. Fetch data from common DocTypes
3. Display a summary of your data

## Troubleshooting "Failed to Fetch" Error

### Error: "Cannot connect to backend server"

**Solution:**
1. ✅ Check if backend is running:
   ```bash
   cd BackEnd
   npm start
   ```

2. ✅ Verify backend is on port 5000:
   - Open: http://localhost:5000/health
   - Should return: `{"status":"ok","mongo":"connected"}`

3. ✅ Check browser console (F12) for CORS errors
   - If you see CORS errors, ensure backend has `cors` package installed

4. ✅ Verify frontend is using correct API URL:
   - Check browser console for the actual request URL
   - Should be: `http://localhost:5000/api/erp/connect`

### Error: "Authentication failed"

**Solution:**
1. ✅ Verify your Base URL is correct:
   - Should be: `https://your-instance.erpnext.com`
   - NOT: `https://your-instance.erpnext.com/api`

2. ✅ Check API Key format:
   - Should be plain text (no spaces, no colons)
   - Example: `a1b2c3d4e5f6`

3. ✅ Check API Secret format:
   - Should be the full secret string
   - Make sure you copied it completely

4. ✅ Verify credentials in ERPNext:
   - Go back to User Settings → API Access
   - Regenerate keys if needed

### Error: "Network request failed"

**Solution:**
1. ✅ Check your internet connection
2. ✅ Verify ERPNext instance is accessible:
   - Open Base URL in browser
   - Should load ERPNext login page
3. ✅ Check if ERPNext instance allows API access
4. ✅ Verify firewall/network settings

## Example Form Values

```
Base URL:  https://demo.erpnext.com
API Key:   a1b2c3d4e5f6g7h8i9j0
API Secret: secret_key_123456789abcdefghijklmnopqrstuvwxyz
```

## What Happens After Connection?

Once connected successfully, you'll see:
- ✅ Authenticated user name
- ✅ Summary statistics:
  - Sales Orders count
  - Purchase Orders count
  - Items count
  - Customers count
  - Suppliers count
- ✅ All fetched data from ERPNext

## Need Help?

1. Check browser console (F12) for detailed error messages
2. Check backend terminal for server logs
3. Verify all steps above
4. Ensure ERPNext instance is accessible and API is enabled

