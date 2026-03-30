import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  type: 'Receivable' | 'Payable';
  clientId?: string;
  supplierId?: string;
  items: InvoiceItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Paid';
  notes?: string;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  bankDetails: string;
  ownerName: string;
}

interface AppState {
  clients: Client[];
  suppliers: Supplier[];
  invoices: Invoice[];
  companyProfile: CompanyProfile;
}

interface AppContextType extends AppState {
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Omit<Client, 'id'>) => void;
  deleteClient: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  updateCompanyProfile: (profile: CompanyProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  clients: [],
  suppliers: [],
  invoices: [],
  companyProfile: {
    name: 'KOPERASI GARUDA MERAH PUTIH',
    address: 'Dsn. Padangan RT 02 RW 03 Ds. Pagu\nKec. Pagu Kab. Kediri',
    phone: '0812-5278-8733',
    bankDetails: 'Rekening Koperasi Garuda Merah Putih\nBank Mandiri : 171-00-1986218-7',
    ownerName: 'Hariaji',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('invoice-app-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse state from localStorage', e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('invoice-app-state', JSON.stringify(state));
  }, [state]);

  const addClient = (client: Omit<Client, 'id'>) => {
    setState((prev) => ({
      ...prev,
      clients: [...prev.clients, { ...client, id: uuidv4() }],
    }));
  };

  const updateClient = (id: string, client: Omit<Client, 'id'>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === id ? { ...client, id } : c)),
    }));
  };

  const deleteClient = (id: string) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.filter((c) => c.id !== id),
    }));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    setState((prev) => ({
      ...prev,
      suppliers: [...prev.suppliers, { ...supplier, id: uuidv4() }],
    }));
  };

  const updateSupplier = (id: string, supplier: Omit<Supplier, 'id'>) => {
    setState((prev) => ({
      ...prev,
      suppliers: prev.suppliers.map((s) => (s.id === id ? { ...supplier, id } : s)),
    }));
  };

  const deleteSupplier = (id: string) => {
    setState((prev) => ({
      ...prev,
      suppliers: prev.suppliers.filter((s) => s.id !== id),
    }));
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setState((prev) => ({
      ...prev,
      invoices: [...prev.invoices, { ...invoice, id: uuidv4() }],
    }));
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((i) => (i.id === id ? { ...i, ...invoice } : i)),
    }));
  };

  const deleteInvoice = (id: string) => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.filter((i) => i.id !== id),
    }));
  };

  const updateCompanyProfile = (profile: CompanyProfile) => {
    setState((prev) => ({
      ...prev,
      companyProfile: profile,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        addClient,
        updateClient,
        deleteClient,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        updateCompanyProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
