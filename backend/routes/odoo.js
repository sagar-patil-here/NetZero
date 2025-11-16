import express from 'express';
import { authenticateOdoo, fetchSalesOrders } from '../services/odooService.js';

const router = express.Router();

/**
 * POST /api/odoo/connect
 * Authenticate with Odoo and test connection
 */
router.post('/connect', async (req, res) => {
  try {
    const { url, dbName, username, password } = req.body;

    // Validate required fields
    if (!url || !dbName || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: url, dbName, username, password'
      });
    }

    // Authenticate with Odoo
    const authResult = await authenticateOdoo(url, dbName, username, password);

    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        error: authResult.error || 'Authentication failed'
      });
    }

    res.json({
      success: true,
      message: 'Successfully connected to Odoo',
      uid: authResult.uid,
      authenticatedUser: username
    });
  } catch (error) {
    console.error('Odoo connection error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to Odoo'
    });
  }
});

/**
 * POST /api/odoo/sales
 * Fetch sales orders from Odoo
 */
router.post('/sales', async (req, res) => {
  try {
    const { url, dbName, username, password, limit = 100, offset = 0 } = req.body;

    // Validate required fields
    if (!url || !dbName || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: url, dbName, username, password'
      });
    }

    // Fetch sales orders
    const result = await fetchSalesOrders(url, dbName, username, password, limit, offset);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to fetch sales orders'
      });
    }

    res.json({
      success: true,
      data: result.data,
      count: result.count,
      limit,
      offset
    });
  } catch (error) {
    console.error('Fetch sales error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch sales orders'
    });
  }
});

export const odooRoutes = router;

