import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ==========================
// ODOO CONFIGURATION
// ==========================
const ODOO_URL = "https://netzero1.odoo.com/jsonrpc";
const ODOO_DB = "netzero1";
const ODOO_API_KEY = process.env.API_KEY;
const ODOO_USER = process.env.USERNAME;

// Helper: JSON-RPC (json_2 compatible)
async function odooRPC(model, method, args = [], kwargs = {}) {
  const body = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [ODOO_DB, 2, ODOO_API_KEY, model, method, args, kwargs],
    },
    id: new Date().getTime(),
  };

  const res = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.result;
}

// ==========================
// CPCB EMISSION FACTORS (example values)
// ==========================
// ⚠️ Use latest CPCB/CEA data for production!
const EF = {
  coal: 2460, // kg CO2 / tonne
  diesel: 2.68, // kg CO2 / liter
  electricity: 0.82, // kg CO2 / kWh
  transport_truck: 0.10, // kg CO2 / tonne·km
  limestone_calcination: 440, // kg CO2 / tonne clinker (process)
};

// ==========================
// HELPER: Calculate Emissions
// ==========================
function calculateCementEmissions(activityData) {
  let totalCO2 = 0;
  const details = [];

  // --- Coal ---
  if (activityData.coal) {
    const co2 = activityData.coal * EF.coal;
    totalCO2 += co2;
    details.push({ source: "Coal", value: activityData.coal, unit: "t", co2 });
  }

  // --- Diesel ---
  if (activityData.diesel) {
    const co2 = activityData.diesel * EF.diesel;
    totalCO2 += co2;
    details.push({ source: "Diesel", value: activityData.diesel, unit: "L", co2 });
  }

  // --- Electricity ---
  if (activityData.electricity) {
    const co2 = activityData.electricity * EF.electricity;
    totalCO2 += co2;
    details.push({ source: "Electricity", value: activityData.electricity, unit: "kWh", co2 });
  }

  // --- Limestone Calcination (process emission per tonne clinker) ---
  if (activityData.clinker) {
    const co2 = activityData.clinker * EF.limestone_calcination;
    totalCO2 += co2;
    details.push({ source: "Calcination", value: activityData.clinker, unit: "t clinker", co2 });
  }

  // --- Transport (tonne * km * EF_transport) ---
  if (activityData.transport_tonne && activityData.transport_distance) {
    const tonneKm = activityData.transport_tonne * activityData.transport_distance;
    const co2 = tonneKm * EF.transport_truck;
    totalCO2 += co2;
    details.push({
      source: "Transport",
      value: tonneKm,
      unit: "tonne·km",
      co2,
    });
  }

  return { totalCO2_kg: totalCO2, totalCO2_ton: totalCO2 / 1000, breakdown: details };
}

// ==========================
// API ROUTE: Fetch + Calculate
// ==========================
app.get("/api/cement/emission", async (req, res) => {
  try {
    // --- Step 1: Fetch purchase data (coal, diesel, electricity) ---
    const purchases = await odooRPC("purchase.order.line", "search_read", [[]], {
      fields: ["product_id", "product_uom_qty", "date_order"],
      limit: 50,
    });

    // res.json(JSON.stringify(purchases))
    // --- Step 2: Aggregate relevant quantities ---
    const activity = { coal: 0, diesel: 0, electricity: 0, clinker: 0, transport_tonne: 0, transport_distance: 0 };

    for (const item of purchases) {
      const name = (item.product_id?.[1] || "").toLowerCase();
      const qty = item.product_uom_qty || 0;

      if (name.includes("coal")) activity.coal += qty;
      else if (name.includes("diesel")) activity.diesel += qty;
      else if (name.includes("electric")) activity.electricity += qty;
      else if (name.includes("clinker")) activity.clinker += qty;
    }

    // --- Step 3: Fetch sales data for transport estimation ---
    const sales = await odooRPC("sale.order", "search_read", [[]], {
      fields: ["name", "partner_id", "amount_total"],
      limit: 10,
    });

    // Dummy logic: assume total 1,950 tonnes cement moved 250 km
    activity.transport_tonne = 1950;
    activity.transport_distance = 250;
    
    // --- Step 4: Calculate emissions ---
    const result = calculateCementEmissions(activity);

    // --- Step 5: Return JSON ---
    res.json({
      success: true,
      company: "UltraTech Cement Ltd",
      plant: "CMT-01",
      location: "Satara, Maharashtra",
      activity_data: activity,
      emissions: result,
    } );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================
// START SERVER
// ==========================
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Cement CO₂ Calculator running on http://localhost:${PORT}`)
);
