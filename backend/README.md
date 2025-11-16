# NetZero Backend - Odoo Integration

Backend API server for connecting to Odoo ERP system and fetching sales data.

## Features

- ✅ Password-based authentication with Odoo
- ✅ Fetch sales orders from Odoo
- ✅ CORS enabled for frontend integration
- ✅ JSON-RPC and XML-RPC support (automatic fallback)
- ✅ Error handling and validation

## Setup

### 1. Install Dependencies

```bash
cd BackEnd
npm install
```

### 2. Configure Environment (Optional)

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

### 3. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5001` by default (changed from 5000 to avoid macOS AirPlay Receiver conflict).

## API Endpoints

### Health Check

```
GET /health
```

Returns server status.

### Connect to Odoo

```
POST /api/odoo/connect
Content-Type: application/json

{
  "url": "https://your-odoo-instance.com",
  "dbName": "mycompany_db",
  "username": "apiuser@domain.com",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to Odoo",
  "uid": 2,
  "authenticatedUser": "apiuser@domain.com"
}
```

### Fetch Sales Orders

```
POST /api/odoo/sales
Content-Type: application/json

{
  "url": "https://your-odoo-instance.com",
  "dbName": "mycompany_db",
  "username": "apiuser@domain.com",
  "password": "your_password",
  "limit": 100,
  "offset": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "SO001",
      "customer": "Customer Name",
      "customerId": 5,
      "date": "2024-01-15 10:30:00",
      "total": 1500.00,
      "currency": "USD",
      "state": "sale",
      "salesperson": "John Doe",
      "team": "Sales Team",
      "reference": "",
      "note": "",
      "lineCount": 3
    }
  ],
  "count": 50,
  "limit": 100,
  "offset": 0
}
```

## Odoo Setup Requirements

Before connecting, ensure:

1. **Developer Mode is enabled** in Odoo
   - Go to Settings → Developer Tools → Activate Developer Mode
   - Or add `?debug=1` to your Odoo URL

2. **API User is created**
   - Go to Settings → Users & Companies → Users → Create
   - Set Name, Email, Password
   - Grant access to Sales module

3. **Database Name is known**
   - Go to Settings → General Settings → Database
   - Copy the Database Name

## CORS Configuration

The server is configured to allow all origins by default for development. In production, update the CORS configuration in `server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Ensure the backend server is running
2. Check that CORS is properly configured in `server.js`
3. Verify the frontend is making requests to the correct backend URL

### Authentication Failures

- Verify Odoo URL is correct (include `https://` or `http://`)
- Check database name matches exactly (case-sensitive)
- Ensure username is the email address
- Verify password is correct
- Check user has access to Sales module

### Connection Timeouts

- Verify Odoo instance is accessible
- Check firewall settings
- Ensure Odoo XML-RPC/JSON-RPC endpoints are enabled

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variable management
- `xmlrpc` - XML-RPC client for Odoo
- `axios` - HTTP client for JSON-RPC

## License

ISC

