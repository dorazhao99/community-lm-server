import { google } from 'googleapis';
import serviceAccount from "./serviceKeys_docs.json" assert { type: "json" };

// Load service account key file
const KEY_FILE_PATH = "./serviceKeys_docs.json";
const SCOPES = ["https://www.googleapis.com/auth/documents.readonly"];
export const docAuth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
});


export const docs = google.docs({ version: "v1", docAuth });
export const client = await docAuth.getClient();
  