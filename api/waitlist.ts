import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body ?? {}

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!keyJson || !sheetId) {
    return res.status(500).json({ error: 'Server misconfiguration' })
  }

  const credentials = JSON.parse(keyJson)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:B',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[email.toLowerCase().trim(), new Date().toISOString()]],
    },
  })

  return res.status(200).json({ success: true })
}
