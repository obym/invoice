import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  userId: string;
  createdAt?: any;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  userId: string;
  createdAt?: any;
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
  userId: string;
  createdAt?: any;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  bankDetails: string;
  ownerName: string;
  userId: string;
  updatedAt?: any;
}

interface AppState {
  user: User | null;
  isAuthReady: boolean;
  clients: Client[];
  suppliers: Supplier[];
  invoices: Invoice[];
  companyProfile: CompanyProfile;
}

interface AppContextType extends AppState {
  addClient: (client: Omit<Client, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  updateCompanyProfile: (profile: Omit<CompanyProfile, 'userId' | 'updatedAt'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultCompanyProfile: CompanyProfile = {
  name: 'KOPERASI GARUDA MERAH PUTIH',
  address: 'Dsn. Padangan RT 02 RW 03 Ds. Pagu\nKec. Pagu Kab. Kediri',
  phone: '0812-5278-8733',
  bankDetails: 'Rekening Koperasi Garuda Merah Putih\nBank Mandiri : 171-00-1986218-7',
  ownerName: 'Hariaji',
  userId: '',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(defaultCompanyProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady || !user) {
      setClients([]);
      setSuppliers([]);
      setInvoices([]);
      setCompanyProfile({ ...defaultCompanyProfile, userId: user?.uid || '' });
      return;
    }

    const qClients = query(collection(db, 'clients'), where('userId', '==', user.uid));
    const unsubClients = onSnapshot(qClients, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'clients'));

    const qSuppliers = query(collection(db, 'suppliers'), where('userId', '==', user.uid));
    const unsubSuppliers = onSnapshot(qSuppliers, (snapshot) => {
      setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'suppliers'));

    const qInvoices = query(collection(db, 'invoices'), where('userId', '==', user.uid));
    const unsubInvoices = onSnapshot(qInvoices, (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'invoices'));

    const unsubProfile = onSnapshot(doc(db, 'companyProfiles', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCompanyProfile({ ...docSnap.data() as CompanyProfile, userId: user.uid });
      } else {
        setCompanyProfile({ ...defaultCompanyProfile, userId: user.uid });
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'companyProfiles'));

    return () => {
      unsubClients();
      unsubSuppliers();
      unsubInvoices();
      unsubProfile();
    };
  }, [user, isAuthReady]);

  const addClient = async (client: Omit<Client, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'clients'), {
        ...client,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'clients');
    }
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'clients', id), client);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `clients/${id}`);
    }
  };

  const deleteClient = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `clients/${id}`);
    }
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...supplier,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'suppliers');
    }
  };

  const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'suppliers', id), supplier);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `suppliers/${id}`);
    }
  };

  const deleteSupplier = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `suppliers/${id}`);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'invoices'), {
        ...invoice,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'invoices');
    }
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'invoices', id), invoice);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `invoices/${id}`);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `invoices/${id}`);
    }
  };

  const updateCompanyProfile = async (profile: Omit<CompanyProfile, 'userId' | 'updatedAt'>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'companyProfiles', user.uid), {
        ...profile,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `companyProfiles/${user.uid}`);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthReady,
        clients,
        suppliers,
        invoices,
        companyProfile,
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
