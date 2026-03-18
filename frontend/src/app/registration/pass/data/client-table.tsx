"use client";

import React, { useState, useEffect } from "react";
import { deleteRegistrationAction } from "./actions";

export function ClientDataTable({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter data
  const filteredData = data.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (timestamp: string, phone: string) => {
    if (confirmId !== timestamp) {
      setConfirmId(timestamp);
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => setConfirmId(null), 3000);
      return;
    }
    
    setConfirmId(null);
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
    <div className="flex flex-col space-y-4 font-sans">
      {/* Search & Actions Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 border border-[var(--color-carbon-gray-30)] shadow-sm">
        <div className="flex w-full sm:w-auto items-center gap-2">
           <svg className="w-5 h-5 text-[var(--color-carbon-gray-50)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
           <input 
             type="text" 
             placeholder="Search all columns..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full sm:w-80 px-2 py-1 text-sm border-b-2 border-transparent focus:border-[var(--color-carbon-blue-60)] outline-none bg-[var(--color-carbon-gray-10)] text-[var(--color-carbon-gray-100)] placeholder-[var(--color-carbon-gray-60)] transition-colors"
           />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-carbon-gray-80)] bg-[var(--color-carbon-gray-20)] px-3 py-1.5 border border-[var(--color-carbon-gray-30)]">
          Total Entries: {filteredData.length}
        </div>
      </div>

      {/* Advanced Excel-Like Grid */}
      <div className="border border-[var(--color-carbon-gray-40)] overflow-auto max-h-[75vh] shadow-sm bg-[var(--color-carbon-gray-10)]">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead className="bg-[#e0e0e0] sticky top-0 z-10 shadow-sm outline outline-1 outline-[var(--color-carbon-gray-30)]">
            <tr>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)] w-12 text-center">#</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Actions</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Timestamp</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Name</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Email</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Instagram ID</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Followers</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Other Platforms</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Category</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Branch</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">College</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">City</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Phone</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">WhatsApp</th>
              <th className="px-3 py-2 border border-[var(--color-carbon-gray-40)] font-semibold text-[var(--color-carbon-gray-90)]">Pass Count</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredData.length === 0 ? (
               <tr>
                 <td colSpan={15} className="px-4 py-8 text-center text-[var(--color-carbon-gray-60)] italic bg-white">No active registrations match your search.</td>
               </tr>
            ) : (
              filteredData.map((reg, index) => (
                <tr key={reg.timestamp + index} className={`transition-all duration-300 group hover:bg-[var(--color-carbon-blue-10)] ${deletingId === reg.timestamp ? 'opacity-30 scale-[0.99]' : ''}`}>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-60)] text-center font-mono text-xs">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] flex items-center gap-2 min-w-[150px] bg-white group-hover:bg-[var(--color-carbon-blue-10)]">
                    <a 
                      href={`https://wa.me/${(reg.whatsappNumber || reg.phoneNumber)?.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex-1 text-center border border-[#1DA851]"
                    >
                      WHATSAPP
                    </a>
                    <button 
                      onClick={() => handleDelete(reg.timestamp, reg.phoneNumber)}
                      disabled={deletingId === reg.timestamp}
                      className={`${confirmId === reg.timestamp ? 'bg-[var(--color-carbon-danger-70)] text-white border-[var(--color-carbon-danger-80)]' : 'bg-white hover:bg-[var(--color-carbon-danger-10)] text-[var(--color-carbon-danger-60)] border-[var(--color-carbon-danger-60)] hover:text-[var(--color-carbon-danger-70)]'} border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex-1 disabled:opacity-50`}
                    >
                      {deletingId === reg.timestamp ? "..." : (confirmId === reg.timestamp ? "Sure?" : "Delete")}
                    </button>
                  </td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-80)] font-mono text-xs">
                    {mounted ? new Date(reg.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : reg.timestamp}
                  </td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] font-semibold text-[var(--color-carbon-gray-100)] w-48 truncate" title={reg.name}>{reg.name}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-blue-70)] hover:underline cursor-pointer truncate max-w-[200px]" title={reg.email}>{reg.email}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-blue-70)] font-medium">
                    <a href={`https://instagram.com/${reg.instagramId?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {reg.instagramId}
                    </a>
                  </td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-90)]">{reg.followers}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-70)] truncate max-w-[150px]" title={reg.otherPlatforms}>{reg.otherPlatforms}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] font-medium text-[var(--color-carbon-gray-90)] bg-[var(--color-carbon-gray-10)]">{reg.category}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-80)]">{reg.branch}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-80)] truncate max-w-[200px]" title={reg.college}>{reg.college}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-[var(--color-carbon-gray-90)] font-medium">{reg.city}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] font-mono text-xs text-[var(--color-carbon-gray-80)] bg-[var(--color-carbon-gray-10)]">{reg.phoneNumber}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] font-mono text-xs text-[var(--color-carbon-blue-70)] bg-blue-50/30">{reg.whatsappNumber || reg.phoneNumber}</td>
                  <td className="px-3 py-2 border border-[var(--color-carbon-gray-30)] text-center font-bold text-[var(--color-carbon-gray-100)] bg-[var(--color-carbon-gray-20)]">{reg.passCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
