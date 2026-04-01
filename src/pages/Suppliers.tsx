import React, { useState } from 'react';
import { useAppContext, Supplier } from '../store/AppContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', district: '', phone: '', suppliedProduct: '' });

  const handleOpenModal = (supplier: Supplier | null = null) => {
    if (supplier && supplier.id) {
      setEditingId(supplier.id);
      setFormData({ name: supplier.name, address: supplier.address, district: supplier.district || '', phone: supplier.phone, suppliedProduct: supplier.suppliedProduct || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', address: '', district: '', phone: '', suppliedProduct: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateSupplier(editingId, formData);
    } else {
      await addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteSupplier(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Supplier</h1>
        <button
          onClick={() => handleOpenModal(null)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Tambah Supplier
        </button>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telepon
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kecamatan/Kabupaten
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk yang disupply
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {supplier.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {supplier.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {supplier.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {supplier.district || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {supplier.suppliedProduct || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(supplier)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(supplier.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada supplier ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                  {editingId ? 'Edit Supplier' : 'Tambah Supplier'}
                </h3>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telepon</label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat</label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">Kecamatan dan Kabupaten</label>
                  <input
                    type="text"
                    name="district"
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                    placeholder="Contoh: Kec. Medan Barat, Kota Medan"
                  />
                </div>
                <div>
                  <label htmlFor="suppliedProduct" className="block text-sm font-medium text-gray-700">Produk yang disupply</label>
                  <input
                    type="text"
                    name="suppliedProduct"
                    id="suppliedProduct"
                    value={formData.suppliedProduct}
                    onChange={(e) => setFormData({ ...formData, suppliedProduct: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                    placeholder="Contoh: Kertas HVS, Tinta Printer"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mr-4">
                <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                Hapus Supplier
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
