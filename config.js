import dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  SERVER_URL, 
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  GITHUB_CLIENT, 
  GITHUB_SECRET,
  TESTING_UID,
  OPENAI_KEY,
  DEVELOPER_TOKEN
} = process.env;

assert(PORT, 'Port is required');
assert(HOST, 'Host is required');

export default {
  port: PORT,
  host: HOST,
  hostUrl: HOST_URL,
  clientUrl: SERVER_URL,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
  },
  gh_client: GITHUB_CLIENT, 
  gh_secret: GITHUB_SECRET,
  testing_uid: TESTING_UID,
  openai: OPENAI_KEY,
  devToken: DEVELOPER_TOKEN
};
