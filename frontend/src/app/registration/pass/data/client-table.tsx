"use client";

import React, { useState } from "react";
import { deleteRegistrationAction } from "./actions";

export function ClientDataTable({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter data globally across all stringified object values
  const filteredData = data.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (timestamp: string, phone: string) => {
    if (!confirm("Are you sure you want to permanently delete this registration from the Live Google Sheet?")) return;
    
    setDeletingId(timestamp);
    const res = await deleteRegistrationAction(timestamp, phone);
    
    if (res.success) {
      setData(prev => prev.filter(r => r.timestamp !== timestamp));
    } else {
      alert("Failed to delete: " + res.error);
    }
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Search & Actions Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 border border-[var(--color-carbon-gray-30)] shadow-sm">
        <div className="flex w-full sm:w-auto items-center gap-2">
           <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input 
             type="text" 
             placeholder="Search all columns..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full sm:w-80 px-2 py-1 text-sm border-b-2 border-[var(--color-carbon-gray-30)] focus:outline-none focus:border-[var(--color-carbon-blue-60)] transition-colors bg-transparent placeholder-gray-400"
           />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-blue-70)] bg-blue-50 px-3 py-1.5 border border-blue-200">
          Showing {filteredData.length} entries
        </div>
      </div>

      {/* Advanced Excel-Like Grid */}
      <div className="border border-[var(--color-carbon-gray-40)] overflow-auto max-h-[75vh] shadow-sm bg-white relative excel-scroll">
        <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
          <thead className="bg-[#f4f4f4] sticky top-0 z-10 shadow-[0_1px_0_var(--color-carbon-gray-40)]">
            <tr>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700 w-10 text-center">#</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700 sticky left-0 bg-[#f4f4f4] z-20 shadow-[1px_0_0_var(--color-carbon-gray-40)]">Actions</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Timestamp</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Name</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Email</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Category</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700 text-center">Count</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Instagram ID</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Followers</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Other Platforms</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Branch</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">College</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">City</th>
              <th className="px-3 py-2 border-r border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">Phone</th>
              <th className="px-3 py-2 border-b border-[var(--color-carbon-gray-30)] font-semibold text-gray-700">WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
               <tr>
                 <td colSpan={15} className="px-4 py-8 text-center text-gray-500 italic bg-white">No matching records found.</td>
               </tr>
            ) : (
              filteredData.map((reg, index) => (
                <tr key={reg.timestamp + index} className="hover:bg-blue-50 transition-colors group bg-white">
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-500 text-center font-mono">
                    {index + 1}
                  </td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] flex items-center gap-2 min-w-[140px] sticky left-0 bg-white group-hover:bg-blue-50 shadow-[1px_0_0_var(--color-carbon-gray-20)] z-10">
                    <a 
                      href={`https://wa.me/${(reg.whatsappNumber || reg.phoneNumber)?.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      WhatsApp
                    </a>
                    <button 
                      onClick={() => handleDelete(reg.timestamp, reg.phoneNumber)}
                      disabled={deletingId === reg.timestamp}
                      className="bg-[var(--color-carbon-danger-60)] hover:bg-[var(--color-carbon-danger-70)] disabled:opacity-50 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      {deletingId === reg.timestamp ? "..." : "Delete"}
                    </button>
                  </td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-700 font-mono">
                    {new Date(reg.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] font-semibold text-gray-900">{reg.name}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-[var(--color-carbon-blue-60)] hover:underline cursor-pointer truncate max-w-[180px]" title={reg.email}>{reg.email}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] font-medium text-gray-800">{reg.category}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-center font-bold text-gray-900 bg-gray-50">{reg.passCount}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-[var(--color-carbon-blue-60)]">
                    <a href={`https://instagram.com/${reg.instagramId?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">
                      {reg.instagramId}
                    </a>
                  </td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)]">{reg.followers}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-600 truncate max-w-[140px]" title={reg.otherPlatforms}>{reg.otherPlatforms}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-600">{reg.branch}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-600 truncate max-w-[180px]" title={reg.college}>{reg.college}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] text-gray-600 font-semibold">{reg.city}</td>
                  <td className="px-3 py-1.5 border-r border-b border-[var(--color-carbon-gray-20)] font-mono text-gray-700 bg-gray-50">{reg.phoneNumber}</td>
                  <td className="px-3 py-1.5 border-b border-[var(--color-carbon-gray-20)] font-mono text-[var(--color-carbon-blue-60)] bg-blue-50/50">{reg.whatsappNumber || reg.phoneNumber}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
