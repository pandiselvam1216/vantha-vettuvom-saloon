import React, { useState } from 'react';
import { Search, Phone, History, MoreVertical, MessageCircle, CheckSquare, X, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { storage } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewingInvoices, setViewingInvoices] = useState(null);

  const customers = storage.getCustomers();

  const handleSelect = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleBulkWhatsApp = () => {
    const numbers = customers
      .filter(c => selectedCustomers.includes(c.id))
      .map(c => c.phone)
      .join(', ');
    alert(`Bulk WhatsApp feature triggered!\nMessages will be sent to: ${numbers}\n(Note: This requires WhatsApp Business API integration)`);
  };

  const generatePDF = (invoice) => {
    const doc = jsPDF();
    const { id: invoiceNumber, date, customerName, customerPhone, staff, services, subtotal, discount, total } = invoice;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 20, 147);
    doc.text("Vantha Vettuvom", 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Just Hair - Premium Barbershop", 20, 30);
    doc.setFont("helvetica", "normal");
    doc.text("4, Opposite SRK Honda, Thiru Nagar,", 20, 36);
    doc.text("Palani, Tamil Nadu 624601", 20, 42);
    doc.text(`Invoice: ${invoiceNumber}`, 140, 30);
    doc.text(`Date: ${date}`, 140, 36);

    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${customerName}`, 20, 68);
    doc.text(`Phone: ${customerPhone}`, 20, 74);
    if (staff) {
      doc.text(`Staff: ${staff}`, 20, 80);
    }

    doc.setFont("helvetica", "bold");
    doc.text("Service", 20, 90);
    doc.text("Price", 160, 90);
    doc.line(20, 93, 190, 93);

    doc.setFont("helvetica", "normal");
    let y = 100;
    services.forEach((service) => {
      doc.text(service.name, 20, y);
      doc.text(`Rs. ${service.price}`, 160, y);
      y += 10;
    });

    doc.line(20, y + 5, 190, y + 5);
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", 120, y + 15);
    doc.text(`Rs. ${subtotal}`, 160, y + 15);
    
    if (discount > 0) {
      doc.text("Discount:", 120, y + 25);
      doc.setTextColor(0, 150, 0);
      doc.text(`- Rs. ${discount}`, 160, y + 25);
      doc.setTextColor(0, 0, 0);
      y += 10;
    }

    doc.setFontSize(14);
    doc.text("Total:", 120, y + 25);
    doc.setTextColor(255, 20, 147);
    doc.text(`Rs. ${total}`, 160, y + 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for visiting 🙏", 80, y + 50);

    doc.save(`${invoiceNumber}.pdf`);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Customer Directory</h1>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {selectedCustomers.length > 0 && (
            <button 
              onClick={handleBulkWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={18} />
              WhatsApp Selected ({selectedCustomers.length})
            </button>
          )}

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="glass-input w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className={`glass-card p-5 group cursor-pointer transition-all ${selectedCustomers.includes(customer.id) ? 'border-green-500/50 bg-green-500/5' : 'hover:border-primary/30'}`}
            onClick={() => handleSelect(customer.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div onClick={(e) => { e.stopPropagation(); handleSelect(customer.id); }} className={`min-w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCustomers.includes(customer.id) ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                  {selectedCustomers.includes(customer.id) && <CheckSquare size={14} className="text-white" />}
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-lg border border-white/10 shrink-0">
                  {customer.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-md md:text-lg leading-tight truncate">{customer.name}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                    <Phone size={12} /> {customer.phone}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setViewingInvoices(customer);
                }}
                className="text-primary hover:text-white transition-colors bg-primary/10 p-2 rounded-lg"
              >
                <History size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mt-2">
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="text-xs text-gray-400">Visits</div>
                <div className="font-bold">{customer.visits}</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="text-xs text-gray-400">Spent</div>
                <div className="font-bold text-primary">₹{customer.spent}</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="text-xs text-gray-400">Last</div>
                <div className="font-bold text-sm truncate px-1">{customer.lastVisit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice History Modal */}
      <AnimatePresence>
        {viewingInvoices && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-2xl flex flex-col max-h-[80vh] border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h2 className="text-xl font-bold">{viewingInvoices.name}</h2>
                  <p className="text-sm text-gray-400">{viewingInvoices.phone}</p>
                </div>
                <button onClick={() => setViewingInvoices(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {storage.getInvoicesByCustomer(viewingInvoices.phone).length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <FileText size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No invoices found for this customer.</p>
                  </div>
                ) : (
                  storage.getInvoicesByCustomer(viewingInvoices.phone).reverse().map((invoice) => (
                    <div key={invoice.id} className="glass-card p-4 border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <div>
                        <div className="font-bold text-white">{invoice.id}</div>
                        <div className="text-xs text-gray-500">{invoice.date} • {invoice.staff || 'No Staff'}</div>
                        <div className="text-sm text-primary font-black mt-1">₹{invoice.total}</div>
                      </div>
                      <button 
                        onClick={() => generatePDF(invoice)}
                        className="p-3 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl border border-white/10 transition-all flex items-center gap-2"
                      >
                        <Download size={18} />
                        <span className="text-xs font-bold uppercase">Invoice</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Customers;
