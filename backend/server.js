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

// WhatsApp API Route (Modified to be internal helper or kept as is)
app.post('/api/whatsapp/invoice', async (req, res) => {
  const { phone, customerName, services, total } = req.body;
  try {
    const serviceList = services.map(s => s.name).join(', ');
    const messageBody = `💈 *Vantha Vettuvom – Palani*\n\nCustomer: ${customerName}\nServices: ${serviceList}\nTotal: ₹${total}\n\nThank you for visiting 🙏`;
    console.log(`[WhatsApp Mock API] Sending to +91${phone}:`, messageBody);
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send WhatsApp message.' });
  }
});

// Save Invoice to Supabase
app.post('/api/invoices', async (req, res) => {
  const { 
    invoiceNumber, customerName, customerPhone, 
    staff, services, subtotal, discount, total, paymentMode 
  } = req.body;

  try {
    // 1. Handle Customer (Find or Create)
    let customerId = null;
    if (customerPhone && customerPhone !== 'N/A') {
      const { data: customerData, error: custError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerPhone)
        .single();
      
      if (custError && custError.code !== 'PGRST116') throw custError; // PGRST116 is "not found"

      if (customerData) {
        customerId = customerData.id;
      } else {
        const { data: newCust, error: createCustError } = await supabase
          .from('customers')
          .insert([{ name: customerName || 'Walk-in Customer', phone: customerPhone }])
          .select()
          .single();
        if (createCustError) throw createCustError;
        customerId = newCust.id;
      }
    }

    // 2. Handle Staff (Find ID by Name)
    let staffId = null;
    if (staff) {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('name', staff)
        .maybeSingle();
      
      if (staffData) staffId = staffData.id;
    }

    // 3. Insert Invoice
    const { data: invoiceRecord, error: invError } = await supabase
      .from('invoices')
      .insert([{
        invoice_number: invoiceNumber,
        customer_id: customerId,
        staff_id: staffId,
        subtotal: subtotal,
        discount: discount,
        total_amount: total,
        payment_mode: paymentMode,
        status: 'completed'
      }])
      .select()
      .single();

    if (invError) throw invError;

    // 4. Insert Invoice Items
    const invoiceItems = services.map(service => ({
      invoice_id: invoiceRecord.id,
      service_name: service.name,
      price: service.price
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) throw itemsError;

    // 5. Optional: Trigger WhatsApp notification automatically
    // The staff requested "detail will send to the admin", but sending to customer is also good.
    // We could also log or notify an admin channel here if one existed.

    return res.status(200).json({ 
      success: true, 
      message: 'Invoice saved successfully to admin dashboard.',
      invoiceId: invoiceRecord.id 
    });

  } catch (error) {
    console.error('Save Invoice Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to save invoice.' 
    });
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
