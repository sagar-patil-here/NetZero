# Odoo Integration Setup Guide

## ✅ What Has Been Completed

### Backend (Fresh Implementation)
1. **Express Server** (`server.js`)
   - CORS configured to allow all origins (no CORS errors)
   - Error handling middleware
   - Health check endpoint

2. **Odoo Routes** (`routes/odoo.js`)
   - `/api/odoo/connect` - Authenticate with Odoo
   - `/api/odoo/sales` - Fetch sales orders

3. **Odoo Service** (`services/odooService.js`)
   - Password-based authentication (URL, DB Name, Username, Password)
   - JSON-RPC and XML-RPC support with automatic fallback
   - Fetches sales orders with all relevant fields
   - Proper HTTPS/HTTP handling

4. **Dependencies Installed**
   - express
   - cors
   - dotenv
   - xmlrpc
   - axios

### Frontend Updates
1. **Dashboard Component** (`FrontEnd/src/components/Dashboard.jsx`)
   - Odoo-specific connection form (URL, DB Name, Username, Password)
   - Direct connection flow (no API method selection needed for Odoo)
   - Automatic sales data fetching after successful connection
   - Sales orders display with formatted data

## 🚀 How to Run

### Step 1: Start Backend Server

```bash
cd BackEnd
npm start
```

The server will start on `http://localhost:5001`

**Verify it's running:**
- Open browser: `http://localhost:5001/health`
- Should see: `{"status":"ok","message":"NetZero Backend API is running"}`

### Step 2: Start Frontend (if not already running)

```bash
cd FrontEnd
npm run dev
```

### Step 3: Connect to Odoo

1. Open your frontend application
2. Click "Connect Data Source"
3. Select "API Integration"
4. Select "Odoo"
5. Enter your Odoo credentials:
   - **Odoo URL**: `https://your-odoo-instance.com`
   - **Database Name**: `mycompany_db` (found in Settings → General Settings → Database)
   - **Username (Email)**: `apiuser@domain.com`
   - **Password**: Your Odoo user password
6. Click "Connect"

The system will:
- Authenticate with Odoo
- Fetch sales orders automatically
- Display them in the modal

## 📋 Odoo Setup Requirements

Before connecting, ensure your Odoo instance is ready:

1. **Enable Developer Mode**
   - Go to: Settings → Developer Tools → Activate Developer Mode
   - Or add `?debug=1` to your Odoo URL

2. **Create API User**
   - Go to: Settings → Users & Companies → Users → Create
   - Set Name, Email, Password
   - Grant access to **Sales** module

3. **Get Database Name**
   - Go to: Settings → General Settings → Database
   - Copy the exact database name (case-sensitive)

## 🔧 Configuration

### Backend Port
Default port is `5001` (changed from 5000 to avoid macOS AirPlay Receiver conflict). To change it:
- Create `.env` file in `BackEnd/` directory
- Add: `PORT=3000` (or your preferred port)

### CORS Settings
Currently set to allow all origins (`*`). For production:
- Edit `BackEnd/server.js`
- Update CORS configuration with your frontend URL

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in console

### CORS Errors
- Ensure backend is running on `http://localhost:5001`
- Check browser console for specific error
- Verify frontend is making requests to correct backend URL

### Authentication Fails
- Verify Odoo URL includes `https://` or `http://`
- Check database name matches exactly (case-sensitive)
- Ensure username is the email address
- Verify password is correct
- Check user has access to Sales module

### No Sales Data
- Verify user has read permissions for `sale.order` model
- Check if there are any sales orders in Odoo
- Review backend console for error messages

## 📁 File Structure

```
BackEnd/
├── server.js                 # Main Express server
├── routes/
│   └── odoo.js              # Odoo API routes
├── services/
│   └── odooService.js       # Odoo connection logic
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Detailed documentation
└── SETUP_GUIDE.md          # This file
```

## 🎯 Next Steps

1. **Test the connection** with your Odoo instance
2. **Verify sales data** is being fetched correctly
3. **Customize the display** if needed (in Dashboard.jsx)
4. **Add error handling** for edge cases if required
5. **Set up production environment** variables

## 📝 Notes

- All credentials are sent securely via HTTPS
- No credentials are stored on the backend
- Each request requires full credentials (stateless)
- Sales data is fetched with pagination support (limit/offset)

## ✅ Testing Checklist

- [ ] Backend server starts without errors
- [ ] Health check endpoint works
- [ ] Frontend can connect to backend
- [ ] Odoo authentication succeeds
- [ ] Sales orders are fetched and displayed
- [ ] Error messages are shown for invalid credentials
- [ ] CORS errors are resolved

---

**Need Help?** Check the main `README.md` in the BackEnd directory for more details.

