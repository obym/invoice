import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { formatCurrency, formatTerbilang } from '../lib/utils';
import { format } from 'date-fns';
import { Printer, ArrowLeft } from 'lucide-react';

export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, clients, suppliers, companyProfile } = useAppContext();
  const printRef = useRef<HTMLDivElement>(null);

  const invoice = invoices.find((i) => i.id === id);
  const client = invoice ? clients.find((c) => c.id === invoice.clientId) : null;
  const supplier = invoice ? suppliers.find((s) => s.id === invoice.supplierId) : null;
  const entity = invoice?.type === 'Receivable' ? client : supplier;

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Faktur tidak ditemukan</h2>
        <button
          onClick={() => navigate('/invoices')}
          className="mt-4 text-indigo-600 hover:text-indigo-900"
        >
          Kembali ke Faktur
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate('/invoices')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Printer className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Cetak / Simpan PDF
        </button>
      </div>

      <div
        ref={printRef}
        className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 print:shadow-none print:border-none print:p-0"
      >
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest">NOTA</h1>
          <h2 className="text-xl font-bold mt-2">{companyProfile.name}</h2>
          <p className="text-sm whitespace-pre-wrap">{companyProfile.address}</p>
          <p className="text-sm">Telepon : {companyProfile.phone}</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <div className="grid grid-cols-[100px_10px_1fr] gap-1">
              <span className="font-semibold">Nomor</span>
              <span>:</span>
              <span>{invoice.invoiceNumber}</span>
              
              <span className="font-semibold">Tanggal Nota</span>
              <span>:</span>
              <span>{format(new Date(invoice.date), 'dd MMMM yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="font-semibold mb-1">Kepada :</p>
          {entity ? (
            <div className="font-bold">
              <p>{entity.name}</p>
              <p className="whitespace-pre-wrap">{entity.address}</p>
              {entity.district && <p>{entity.district}</p>}
              <p>{entity.phone}</p>
            </div>
          ) : (
            <p>Tidak diketahui {invoice.type === 'Receivable' ? 'Klien' : 'Pemasok'}</p>
          )}
        </div>

        <table className="w-full border-collapse border border-black mb-8">
          <thead>
            <tr className="bg-gray-200 print:bg-gray-200">
              <th className="border border-black px-2 py-1 text-center w-12">NO</th>
              <th className="border border-black px-2 py-1 text-left">NAMA BARANG</th>
              <th className="border border-black px-2 py-1 text-center w-16">QTY</th>
              <th className="border border-black px-2 py-1 text-center w-24">SATUAN</th>
              <th className="border border-black px-2 py-1 text-right w-32">HARGA</th>
              <th className="border border-black px-2 py-1 text-right w-32">SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black px-2 py-1 text-center">{index + 1}</td>
                <td className="border border-black px-2 py-1">{item.name}</td>
                <td className="border border-black px-2 py-1 text-center">{item.qty}</td>
                <td className="border border-black px-2 py-1 text-center">{item.unit}</td>
                <td className="border border-black px-2 py-1 text-right">{item.price.toLocaleString('id-ID')}</td>
                <td className="border border-black px-2 py-1 text-right">{item.subtotal.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="border-t border-black"></td>
              <td className="border border-black px-2 py-1 font-bold text-center">TOTAL</td>
              <td className="border border-black px-2 py-1 font-bold text-right">{invoice.total.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>

        <div className="mb-8">
          <p className="font-semibold mb-1">Terbilang :</p>
          <div className="border border-black p-2 min-h-[40px] italic">
            {invoice.terbilang || formatTerbilang(invoice.total)}
          </div>
        </div>

        {invoice.notes && (
          <div className="mb-8">
            <p className="font-semibold mb-1">Catatan :</p>
            <div className="border border-black p-2 min-h-[40px]">
              {invoice.notes}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12">
          <div className="w-1/2">
            <p className="font-semibold">BANK TRANSFER :</p>
            <p className="whitespace-pre-wrap">{companyProfile.bankDetails}</p>
          </div>
          <div className="w-1/3 text-center">
            <p>Hormat Kami,</p>
            <div className="h-24"></div>
            <p className="font-bold">{companyProfile.ownerName}</p>
            <p>Ketua / Owner</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
