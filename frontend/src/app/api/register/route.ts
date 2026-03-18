import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ⚠️ CLOUDFLARE EDGE WORKAROUND
    // The Edge runtime does NOT support the Node.js 'fs' (file system) module.
    // Local data.json writing will not work here. 
    // We are temporarily logging the data so the build succeeds.
    // We need to implement Cloudflare D1, KV, or Google Sheets here next.

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };

    console.log("New Registration Received (Not Saved Yet):", entry);

    // TODO: Insert DB saving logic here

    return NextResponse.json({ success: true, message: 'Registration received (storage pending DB setup)' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save data' },
      { status: 500 }
    );
  }
}
// 01