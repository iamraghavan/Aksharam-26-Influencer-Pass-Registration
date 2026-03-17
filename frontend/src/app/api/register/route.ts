import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local file DB
const DATA_FILE = path.join(process.cwd(), '..', 'data.json');

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ensure data.json exists in the parent directory
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }

    // Read current data
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

    // Append new submission
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };

    currentData.push(entry);

    // Save
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));

    return NextResponse.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save data' },
      { status: 500 }
    );
  }
}
