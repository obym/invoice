import React from 'react';
import { useAppContext } from '../store/AppContext';
import { formatCurrency } from '../lib/utils';
import { FileText, Users, Truck, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { invoices, clients, suppliers } = useAppContext();

  const totalReceivable = invoices.filter(i => i.type === 'Receivable').reduce((sum, inv) => sum + inv.total, 0);
  const totalPayable = invoices.filter(i => i.type === 'Payable').reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter((i) => i.status === 'Paid').length;
  const pendingInvoices = invoices.filter((i) => i.status === 'Sent').length;

  const stats = [
    { name: 'Total Piutang', stat: formatCurrency(totalReceivable), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Hutang', stat: formatCurrency(totalPayable), icon: DollarSign, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Total Klien', stat: clients.length.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Total Pemasok', stat: suppliers.length.toString(), icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Ringkasan</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status Faktur</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Lunas</span>
              <span className="text-sm font-semibold text-gray-900">{paidInvoices}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${invoices.length ? (paidInvoices / invoices.length) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-gray-500">Tertunda / Terkirim</span>
              <span className="text-sm font-semibold text-gray-900">{pendingInvoices}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${invoices.length ? (pendingInvoices / invoices.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Faktur Terbaru</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {invoices.slice(-5).reverse().map((invoice) => {
                const client = clients.find((c) => c.id === invoice.clientId);
                const supplier = suppliers.find((s) => s.id === invoice.supplierId);
                const entityName = invoice.type === 'Receivable' ? client?.name : supplier?.name;
                
                return (
                  <li key={invoice.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {entityName || 'Tidak diketahui'}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.type === 'Receivable' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {invoice.type === 'Receivable' ? 'Piutang' : 'Hutang'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </div>
                    </div>
                  </li>
                );
              })}
              {invoices.length === 0 && (
                <li className="py-4 text-sm text-gray-500 text-center">Belum ada faktur.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
