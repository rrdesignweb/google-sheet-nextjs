// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from "googleapis";

async function handler(req, res) {
  if (req.method === "POST") {
    const {
      day,
      date,
      time,
      category,
      subcategory,
      brand,
      other,
      latitude,
      longitude,
    } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.NEXT_CLIENT_EMAIL,
        client_id: process.env.NEXT_CLIENT_ID,
        private_key: process.env.NEXT_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.NEXT_SPREADSHEET_ID,
      range: "Sheet1!A2:N",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            day,
            date,
            time,
            category,
            subcategory,
            brand,
            other,
            latitude,
            longitude,
          ],
        ],
      },
    });

    res.status(201).json({ message: "Google sheet updated", response });
  }
  res.status(200).json({ message: "Success" });
}

export default handler;
