-- Supabase Database Schema for Vantha Vettuvom Billing Software

-- 1. Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Staff Table (for internal use, linked to profiles if needed)
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff', -- 'admin', 'staff', 'manager'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    phone TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Invoices Table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number TEXT UNIQUE NOT NULL, -- Format: INV-1234
    customer_id UUID REFERENCES customers(id),
    staff_id UUID REFERENCES staff(id),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_mode TEXT NOT NULL, -- 'Cash', 'UPI', 'Card'
    status TEXT DEFAULT 'completed', -- 'completed', 'pending', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Invoice Items Table (mapping services to invoices)
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    service_name TEXT NOT NULL, -- snapshot of name at time of sale
    price DECIMAL(10, 2) NOT NULL -- snapshot of price at time of sale
);

-- 6. Insert Initial Mock Data (Optional, for easy testing)
INSERT INTO services (name, category, price) VALUES
('Haircut', 'Hair', 150),
('Beard Trim', 'Grooming', 100),
('Facial', 'Skin', 350),
('Detan', 'Skin', 200),
('Hair Spa', 'Hair', 450);

INSERT INTO staff (name, role) VALUES
('Siva', 'staff'),
('Kumar', 'staff'),
('Raja', 'staff'),
('Karthik', 'staff'),
('Admin', 'admin');

-- 7. Enable Row Level Security (RLS) basics (Optional setup)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Basic Public Access (For MVP status, can be tightened later)
CREATE POLICY "Public Read Access" ON services FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON staff FOR SELECT USING (true);
CREATE POLICY "Public Insert/Read Access" ON customers FOR ALL USING (true);
CREATE POLICY "Public Insert/Read Access" ON invoices FOR ALL USING (true);
CREATE POLICY "Public Insert/Read Access" ON invoice_items FOR ALL USING (true);
