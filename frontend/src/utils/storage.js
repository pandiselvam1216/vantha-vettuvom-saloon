const DEFAULT_SERVICES = [
  { id: 1, name: 'Premium Haircut', category: 'Hair', duration: '30 mins', price: 150, description: 'Complete restyling with wash and blowdry.', popular: true },
  { id: 2, name: 'Royal Beard Trim', category: 'Beard', duration: '20 mins', price: 100, description: 'Precision trimming with line-up and hot towel.', popular: false },
  { id: 3, name: 'Gold Radiance Facial', category: 'Skin', duration: '45 mins', price: 350, description: 'Deep cleansing and 24k gold mask application.', popular: true },
  { id: 4, name: 'Keratin Hair Spa', category: 'Hair', duration: '60 mins', price: 450, description: 'Deep conditioning treatment for smooth, friz-free hair.', popular: false },
  { id: 5, name: 'Charcoal Detan', category: 'Skin', duration: '30 mins', price: 200, description: 'Removes sun tan and impurities instantly.', popular: false },
  { id: 6, name: 'Kids Haircut (Under 10)', category: 'Hair', duration: '25 mins', price: 100, description: 'Gentle haircut for children with a complimentary candy.', popular: false },
];

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Sathish Kumar', phone: '9876543210', visits: 12, lastVisit: '2 days ago', spent: 3400, tag: 'Regular', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  { id: 2, name: 'Vignesh', phone: '9988776655', visits: 5, lastVisit: '1 week ago', spent: 1200, tag: 'VIP', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  { id: 3, name: 'Ramesh', phone: '9123456780', visits: 2, lastVisit: '1 month ago', spent: 450, tag: 'At Risk', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  { id: 4, name: 'Siva', phone: '9000011111', visits: 8, lastVisit: '2 months ago', spent: 2100, tag: 'Lost', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
  { id: 5, name: 'Karthik', phone: '9234567890', visits: 1, lastVisit: 'Today', spent: 450, tag: 'Regular', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
];

const STORAGE_KEYS = {
  SERVICES: 'vv_services',
  CUSTOMERS: 'vv_customers',
  INVOICES: 'vv_invoices',
};

const getFromStorage = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const normalizePhone = (phone) => {
  if (!phone) return 'N/A';
  return phone.toString().replace(/\D/g, ''); // Remove non-numeric characters
};

export const storage = {
  // Services
  getServices: () => getFromStorage(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES),
  saveService: (service) => {
    const services = storage.getServices();
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) services[index] = service;
      else services.push(service);
    } else {
      service.id = Date.now();
      services.push(service);
    }
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return service;
  },
  deleteService: (id) => {
    const services = storage.getServices().filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, services);
  },

  // Customers
  getCustomers: () => {
    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    return customers.map(c => ({ ...c, normalizedPhone: normalizePhone(c.phone) }));
  },
  saveCustomer: (customerData) => {
    const customers = storage.getCustomers();
    const normalizedInput = normalizePhone(customerData.phone);
    let customer = customers.find(c => normalizePhone(c.phone) === normalizedInput);
    
    if (customer) {
      customer.name = customerData.name || customer.name;
      customer.visits = (customer.visits || 0) + 1;
      customer.spent = (customer.spent || 0) + (customerData.amount || 0);
      customer.lastVisit = 'Today';
    } else {
      customer = {
        id: Date.now(),
        name: customerData.name || 'Walk-in Customer',
        phone: customerData.phone || 'N/A',
        visits: 1,
        spent: customerData.amount || 0,
        lastVisit: 'Today',
        tag: 'Regular',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      };
      customers.push(customer);
    }
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return customer;
  },

  // Invoices
  getInvoices: () => getFromStorage(STORAGE_KEYS.INVOICES, []),
  addInvoice: (invoice) => {
    const invoices = storage.getInvoices();
    invoices.push({ 
      ...invoice, 
      id: invoice.id || `INV-${Date.now()}`,
      normalizedPhone: normalizePhone(invoice.customerPhone)
    });
    saveToStorage(STORAGE_KEYS.INVOICES, invoices);
  },
  getInvoicesByCustomer: (phone) => {
    const normalizedInput = normalizePhone(phone);
    return storage.getInvoices().filter(inv => normalizePhone(inv.customerPhone) === normalizedInput);
  }
};
