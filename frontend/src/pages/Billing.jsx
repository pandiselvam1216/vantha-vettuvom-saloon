import { Plus, Minus, FileText, Smartphone, User, Phone, Briefcase, CreditCard, Banknote, QrCode, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

const Billing = () => {
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [selectedServices, setSelectedServices] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const availableStaff = ['Siva', 'Kumar', 'Raja', 'Karthik', 'Guest'];

  const availableServices = storage.getServices();

  const addService = (service) => {
    setSelectedServices([...selectedServices, { ...service, uniqueId: Date.now() }]);
  };

  const removeService = (uniqueId) => {
    setSelectedServices(selectedServices.filter(s => s.uniqueId !== uniqueId));
  };

  const subtotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - discount;

  const generatePDF = () => {
    const doc = jsPDF();
    const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString();

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
    doc.text(`Name: ${customerInfo.name || 'Walk-in Customer'}`, 20, 68);
    doc.text(`Phone: ${customerInfo.phone || 'N/A'}`, 20, 74);
    if (selectedStaff) {
      doc.text(`Staff: ${selectedStaff}`, 20, 80);
    }

    doc.setFont("helvetica", "bold");
    doc.text("Service", 20, 90);
    doc.text("Price", 160, 90);
    doc.line(20, 93, 190, 93);

    doc.setFont("helvetica", "normal");
    let y = 100;
    selectedServices.forEach((service) => {
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

  const handleCheckout = () => {
    if (selectedServices.length === 0) return;
    
    const invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString();
    
    // Save Invoice
    const invoice = {
      id: invoiceNumber,
      date,
      customerName: customerInfo.name || 'Walk-in Customer',
      customerPhone: customerInfo.phone || 'N/A',
      staff: selectedStaff,
      services: selectedServices,
      subtotal,
      discount,
      total,
      paymentMode
    };
    
    storage.addInvoice(invoice);
    
    // Update/Save Customer
    storage.saveCustomer({
      name: customerInfo.name,
      phone: customerInfo.phone,
      amount: total
    });

    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedServices([]);
      setCustomerInfo({ name: '', phone: '' });
      setDiscount(0);
      setSelectedStaff('');
      navigate('/customers');
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 h-full overflow-hidden page-transition">
      {/* Left Column - Service Selection & Customer Info */}
      <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
        
        {/* Service Selection - Independent Scroll */}
        <div className="glass-card p-4 md:p-6 flex flex-col min-h-0 flex-1">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Plus className="text-primary" size={24} />
              Add Services
            </h2>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              {availableServices.length} Options
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 scroll-area">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              {availableServices.map((service) => (
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={service.id}
                  onClick={() => addService(service)}
                  className="group relative glass-card p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1 bg-primary/20 rounded-md text-primary">
                      <Plus size={14} />
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-primary/70 mb-1 block">{service.category}</span>
                  <div className="font-bold text-sm text-white mb-0.5">{service.name}</div>
                  <div className="text-primary font-black text-lg">₹{service.price}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Information - Compacted */}
        <div className="glass-card p-4 md:p-6 shrink-0">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Smartphone className="text-primary" size={24} />
            Customer Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary" size={16} />
              <input
                type="text"
                placeholder="Full Name"
                className="glass-input w-full pl-10 py-2.5 text-sm"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary" size={16} />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="glass-input w-full pl-10 py-2.5 text-sm"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary" size={16} />
              <select
                className="glass-input w-full pl-10 py-2.5 text-sm bg-transparent appearance-none"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
              >
                <option value="" className="bg-dark">Tag Staff</option>
                {availableStaff.map(staff => (
                  <option key={staff} value={staff} className="bg-dark">{staff}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Digital Receipt - Fixed Height with Scroll */}
      <div className="w-full lg:w-[360px] xl:w-[400px] flex flex-col h-full min-h-0">
        <div className="glass-card flex-1 p-5 lg:p-6 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-dark min-h-0">
          {/* Decorative punched holes look */}
          <div className="absolute top-0 left-0 w-full h-1.5 flex justify-around gap-1 px-4 opacity-30">
            {[...Array(12)].map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-dark -mt-1.5 shadow-inner"></div>)}
          </div>

          <div className="text-center mb-4 mt-2 pt-2 border-t border-dashed border-white/10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter text-white">INVOICE</h2>
            <p className="text-[8px] uppercase font-black tracking-[0.2em] text-primary mt-1">Vantha Vettuvom VIP</p>
          </div>
          
          <div className="flex-1 space-y-3 mb-4 overflow-y-auto scroll-area pr-1">
            <AnimatePresence>
              {selectedServices.map((service) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={service.uniqueId} 
                  className="flex justify-between items-center group bg-white/[0.03] p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-all shrink-0"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white mb-0.5">{service.name}</span>
                    <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">{service.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-primary text-sm">₹{service.price}</span>
                    <button onClick={() => removeService(service.uniqueId)} className="opacity-0 group-hover:opacity-100 text-red-100 bg-red-500/10 p-1.5 rounded-lg transition-all">
                      <Minus size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {selectedServices.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 grayscale opacity-20">
                <FileText size={48} strokeWidth={1} className="mb-2" />
                <p className="font-black uppercase tracking-widest text-[10px] text-gray-500">Cart Empty</p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-dashed border-white/10 shrink-0">
            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <span>Subtotal</span>
              <span className="text-white">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Discount</span>
              <div className="relative w-24">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-[10px]">₹</span>
                <input 
                  type="number" 
                  className="glass-input w-full pl-6 pr-2 py-1 text-right font-black text-primary text-xs" 
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-white/10">
              <span className="text-lg font-black text-white tracking-widest uppercase">Total</span>
              <div className="text-right">
                <p className="text-2xl font-black text-primary tracking-tighter">₹{total}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 shrink-0">
            {[
              { id: 'Cash', icon: <Banknote size={14} /> },
              { id: 'UPI', icon: <QrCode size={14} /> },
              { id: 'Card', icon: <CreditCard size={14} /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPaymentMode(mode.id)}
                className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all ${
                  paymentMode === mode.id 
                  ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/5 text-gray-500'
                }`}
              >
                {mode.icon}
                <span className="text-[8px] font-black uppercase tracking-widest">{mode.id}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleCheckout}
            disabled={selectedServices.length === 0 || isSuccess}
            className={`btn-primary w-full mt-4 py-4 rounded-2xl relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-green-500 hover:bg-green-500 shadow-green-500/50' : ''}`}
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  <span className="text-sm">Success!</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  <span className="text-sm font-bold">Collect Payment</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
