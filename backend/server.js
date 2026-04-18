import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// API Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'Online', shop: 'Vantha Vettuvom VIP Salon' });
});

// Mock Meta WhatsApp Cloud API Route
// In production, you would attach your User Access Token and Phone Number ID from process.env
app.post('/api/whatsapp/invoice', async (req, res) => {
  const { phone, customerName, services, total } = req.body;

  try {
    const serviceList = services.map(s => s.name).join(', ');
    
    const messageBody = `💈 *Vantha Vettuvom – Palani*\n\nCustomer: ${customerName}\nServices: ${serviceList}\nTotal: ₹${total}\n\nThank you for visiting 🙏`;

    console.log(`[WhatsApp Mock API] Sending to +91${phone}:`, messageBody);
    
    // Example Actual API Call (Commented out until config is provided):
    /*
    await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: `91${phone}`,
        type: "text",
        text: { body: messageBody }
      },
      {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` }
      }
    );
    */

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send WhatsApp message.' });
  }
});

// Mock Route for Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    todaySales: 12450,
    totalCustomers: 1245,
    appointments: 24,
    servicesDone: 42
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
