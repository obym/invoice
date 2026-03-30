import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { clients, suppliers, addInvoice, invoices } = useAppContext();

  // Generate invoice number
  const nextInvoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;

  const [formData, setFormData] = useState({
    invoiceNumber: nextInvoiceNumber,
    date: new Date().toISOString().split('T')[0],
    type: 'Receivable' as 'Receivable' | 'Payable',
    clientId: '',
    supplierId: '',
    status: 'Draft' as 'Draft' | 'Sent' | 'Paid',
    notes: '',
  });

  const [items, setItems] = useState([
    { id: uuidv4(), name: '', qty: 1, unit: 'pcs', price: 0, subtotal: 0 },
  ]);

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'qty' || field === 'price') {
            updatedItem.subtotal = Number(updatedItem.qty) * Number(updatedItem.price);
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems([...items, { id: uuidv4(), name: '', qty: 1, unit: 'pcs', price: 0, subtotal: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'Receivable' && !formData.clientId) {
      alert('Please select a client');
      return;
    }
    if (formData.type === 'Payable' && !formData.supplierId) {
      alert('Please select a supplier');
      return;
    }
    if (items.some((item) => !item.name)) {
      alert('Please fill in all item names');
      return;
    }

    addInvoice({
      ...formData,
      items,
      total,
    });
    navigate('/invoices');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Create Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any, clientId: '', supplierId: '' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
              >
                <option value="Receivable">Receivable (To Client)</option>
                <option value="Payable">Payable (From Supplier)</option>
              </select>
            </div>

            <div>
              <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            {formData.type === 'Receivable' ? (
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                  Client
                </label>
                <select
                  id="client"
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <select
                  id="supplier"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  required
                >
                  <option value="">Select a supplier</option>
                  {/* We need to import suppliers from useAppContext */}
                  {/* Let's fix this in the next edit or just destructure it now */}
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            <div className="space-y-4">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                <div className="col-span-4">Item Name</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Subtotal</div>
              </div>
              
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-b sm:border-b-0 pb-4 sm:pb-0">
                  <div className="col-span-1 sm:col-span-4">
                    <label className="block sm:hidden text-xs text-gray-500 mb-1">Item Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      placeholder="Item description"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block sm:hidden text-xs text-gray-500 mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block sm:hidden text-xs text-gray-500 mb-1">Unit</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      placeholder="pcs, box, etc."
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block sm:hidden text-xs text-gray-500 mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                      required
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <label className="block sm:hidden text-xs text-gray-500 mb-1">Subtotal</label>
                      <span className="text-sm text-gray-900">{item.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="-ml-0.5 mr-2 h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex justify-end">
            <div className="w-full sm:w-1/3">
              <div className="flex justify-between py-2 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes / Terbilang / Bank Details
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
              placeholder="e.g. Bank Transfer: Mandiri 123-456-789 a.n. Company"
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
