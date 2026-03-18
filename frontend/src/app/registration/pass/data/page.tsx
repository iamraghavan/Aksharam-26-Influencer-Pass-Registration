import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const dynamic = 'force-dynamic';

export default async function AdminDataPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>
}) {
  const params = await searchParams;
  
  if (params.access !== 'raghavan') {
    return (
      <div className="min-h-screen bg-[var(--color-carbon-gray-10)] flex items-center justify-center p-4">
        <div className="bg-white p-8 max-w-md w-full shadow-lg border-t-4 border-[var(--color-carbon-danger-60)]">
          <h1 className="text-2xl font-semibold mb-2 text-[var(--color-carbon-danger-60)]">403 Forbidden</h1>
          <p className="text-[var(--color-carbon-gray-70)] text-sm">
            You do not have permission to access the Aksharam'26 Influencer registration data.
          </p>
        </div>
      </div>
    );
  }

  let registrations: any[] = [];
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];
    
    // Fetch all rows
    const rows = await sheet.getRows();
    
    // Map Spreadsheet rows back into the JSON structure expected by the table
    registrations = rows.map((row, index) => ({
      id: index,
      timestamp: row.get('Timestamp'),
      name: row.get('Name'),
      instagramId: row.get('Instagram ID'),
      followers: row.get('Followers'),
      branch: row.get('Branch'),
      college: row.get('College'),
      city: row.get('City'),
      phoneNumber: row.get('Phone'),
      whatsappNumber: row.get('WhatsApp')
    }));

  } catch (err) {
    console.error('Failed to parse registration data from Google Sheets', err);
  }

  // Ensure newest first (filtering out empty rows just in case)
  registrations = registrations.filter(r => r.timestamp).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen bg-[var(--color-carbon-gray-10)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-carbon-gray-100)]">Influencer Registrations</h1>
            <p className="text-[var(--color-carbon-gray-70)] text-sm mt-1">
              Real-time feed of Aksharam'26 Influencer Pass applicants.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-carbon-gray-20)] px-4 py-2 text-sm font-semibold text-[var(--color-carbon-blue-70)]">
              Total: {registrations.length}
            </div>
            {/* Simple client-side refresh by reloading the page */}
            <form>
              <button 
                formAction=""
                className="bg-[var(--color-carbon-blue-60)] hover:bg-[var(--color-carbon-blue-70)] text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                Refresh Data
              </button>
            </form>
          </div>
        </div>

        {/* IBM Carbon Data Table */}
        <div className="bg-white border border-[var(--color-carbon-gray-30)] overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[var(--color-carbon-gray-20)] text-[var(--color-carbon-gray-90)] border-b border-[var(--color-carbon-gray-30)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Instagram ID</th>
                <th className="px-4 py-3 font-semibold">Followers</th>
                <th className="px-4 py-3 font-semibold">Branch / Year</th>
                <th className="px-4 py-3 font-semibold">College</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-carbon-gray-20)]">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[var(--color-carbon-gray-60)]">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg, index) => (
                  <tr key={reg.id || index} className="hover:bg-[var(--color-carbon-gray-10)] transition-colors">
                    <td className="px-4 py-3 text-[var(--color-carbon-gray-70)]">
                      {new Date(reg.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--color-carbon-gray-100)]">{reg.name}</td>
                    <td className="px-4 py-3 text-[var(--color-carbon-blue-60)]">
                      <a href={`https://instagram.com/${reg.instagramId?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {reg.instagramId}
                      </a>
                    </td>
                    <td className="px-4 py-3">{reg.followers}</td>
                    <td className="px-4 py-3 text-[var(--color-carbon-gray-70)]">{reg.branch} ({reg.year})</td>
                    <td className="px-4 py-3 text-[var(--color-carbon-gray-70)]">{reg.college}</td>
                    <td className="px-4 py-3">{reg.city}</td>
                    <td className="px-4 py-3 font-mono text-xs">{reg.phoneNumber}</td>
                    <td className="px-4 py-3 font-mono text-xs">{reg.whatsappNumber || reg.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
