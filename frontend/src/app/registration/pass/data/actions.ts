"use server";

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { revalidatePath } from 'next/cache';

export async function deleteRegistrationAction(timestamp: string, phone: string) {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo(); 
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    // Find the exact row
    const targetRow = rows.find(r => r.get('Timestamp') === timestamp && r.get('Phone') === phone);
    
    if (targetRow) {
      await targetRow.delete();
      revalidatePath('/registration/pass/data');
      return { success: true };
    }
    
    return { success: false, error: 'Row not found in the Google Sheet.' };
  } catch (err: any) {
    console.error("Delete Action Error:", err);
    return { success: false, error: err.message };
  }
}
