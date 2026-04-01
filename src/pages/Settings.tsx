import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Save } from 'lucide-react';

export default function Settings() {
  const { companyProfile, updateCompanyProfile } = useAppContext();
  const [formData, setFormData] = useState(companyProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Profil Perusahaan</h3>
          <p className="text-sm text-gray-500">
            Informasi ini akan ditampilkan pada nota Anda.
          </p>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Perusahaan
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Alamat
              </label>
              <textarea
                id="address"
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telepon
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700">
                Rekening Bank
              </label>
              <textarea
                id="bankDetails"
                rows={3}
                value={formData.bankDetails}
                onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Nama Pemilik / Penandatangan
              </label>
              <input
                type="text"
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md border p-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center rounded-b-lg">
          {isSaved && (
            <span className="text-sm text-green-600 mr-4 font-medium">Pengaturan berhasil disimpan!</span>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
