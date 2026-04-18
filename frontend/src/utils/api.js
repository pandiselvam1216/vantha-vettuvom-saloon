const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  saveInvoice: async (invoiceData) => {
    try {
      const response = await fetch(`${API_URL}/api/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save invoice');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  sendWhatsApp: async (whatsappData) => {
    try {
      const response = await fetch(`${API_URL}/api/whatsapp/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(whatsappData),
      });

      return await response.json();
    } catch (error) {
      console.error('WhatsApp Error:', error);
      return { success: false, error: error.message };
    }
  }
};
