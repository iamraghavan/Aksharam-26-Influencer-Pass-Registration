import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataPath = path.join(process.cwd(), '..', 'data.json');
    const internalDataPath = path.join(process.cwd(), 'data.json');

    const targetPath = fs.existsSync(internalDataPath) ? internalDataPath : dataPath;
    
    let currentData = [];
    if (fs.existsSync(targetPath)) {
      currentData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };

    currentData.push(entry);
    
    try {
      fs.writeFileSync(targetPath, JSON.stringify(currentData, null, 2));
      console.log("New Registration Saved locally!");
    } catch (writeErr) {
      console.warn("Could not write to local file system (expected in Serverless/Netlify environments). Data was received but not saved locally.", writeErr);
      // We still return true below so the user sees a success screen instead of a crash.
    }

    return NextResponse.json({ success: true, message: 'Registration received' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save data' },
      { status: 500 }
    );
  }
}