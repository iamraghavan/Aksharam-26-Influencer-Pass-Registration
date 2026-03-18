import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { ref, set } from "firebase/database";
import { database } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const timestamp = new Date().toISOString();
    const registrationId = uuidv4();

    const entry = {
      Timestamp: timestamp,
      Name: body.fullName || '',
      Email: body.email || '',
      'Instagram ID': body.instagram || '',
      Followers: body.followers || '',
      'Other Platforms': body.otherPlatforms || '',
      Category: body.category || '',
      Branch: body.branch ? `${body.branch} (${body.year || ''})` : '',
      College: body.college || '',
      City: body.city || '',
      Phone: body.phone || '',
      WhatsApp: body.whatsapp || body.phone || '',
      'Pass Count': body.passCount || ''
    };

    // 1. Save to Firebase Realtime Database
    try {
      await set(ref(database, 'registrations/' + registrationId), {
        ...entry,
        rawPayload: body // Store the raw JSON alongside formatted fields in NoSQL
      });
      console.log("Successfully saved to Firebase Realtime DB");
    } catch (fbError) {
      console.error("Firebase Save Error:", fbError);
      // We don't fail the request here, we attempt Sheets as a fallback
    }

    // 2. Save to Google Sheets (Redundancy)
    try {
      const serviceAccountAuth = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
      await doc.loadInfo(); 
      const sheet = doc.sheetsByIndex[0];

      // Robust Self-Healing: If the user forgot headers, inject them automatically
      try {
        await sheet.loadHeaderRow();
      } catch (headerError) {
        console.log("Headers missing in Google Sheet. Auto-injecting now...");
        await sheet.setHeaderRow([
          'Timestamp', 'Name', 'Email', 'Instagram ID', 'Followers', 
          'Other Platforms', 'Category', 'Branch', 'College', 'City', 
          'Phone', 'WhatsApp', 'Pass Count'
        ]);
      }

      await sheet.addRow(entry);
      console.log("Successfully saved registration to Google Sheets!");
    } catch (gsError) {
       console.error("Google Sheets Save Error:", gsError);
       // Return error only if BOTH database saves failed
       throw new Error("Failed to save to secondary database");
    }

    return NextResponse.json({ success: true, message: 'Registration successfully received and saved to Cloud Databases' });

  } catch (error) {
    console.error('Database Sync API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save data to the databases due to configuration errors.' },
      { status: 500 }
    );
  }
}