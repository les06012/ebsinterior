<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/366d05c8-e327-4a87-a837-ddaaa23535c7

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firestore Test Setup

This app currently writes portfolio entries to the `project` collection and reads them back in the gallery.

- Write path: `/project/{projectId}`
- Read path: `/project/{projectId}`
- Admin page saves documents into the `project` collection
- Gallery page fetches documents from the `project` collection

For temporary testing, use the rules in [firestore.rules](./firestore.rules):

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /project/{projectId} {
      allow read, write: if true;
    }
  }
}
```

This is only for development/testing. It allows anyone to read and write `project` documents.

To apply these rules to the actual Firebase project, deploy the rules file:

```bash
firebase deploy --only firestore:rules --project hompage-7f4a0
```

This project now expects open CRUD access on the `project` collection from the web client, so anyone who can open the admin page can create, update, and delete project documents.

## Firebase Storage Setup

Admin image upload writes files under `projects/{projectId}/...` in Firebase Storage.

1. Verify `.env.local` uses the real bucket name from Firebase Console.
2. Deploy Storage rules:

```bash
firebase deploy --only storage --project hompage-7f4a0
```

For temporary testing, `storage.rules` currently allows public read/write under `/projects/**`.

If image upload fails in the browser with a CORS error during local development, apply the bucket CORS config from `storage.cors.json` to the actual Google Cloud Storage bucket.

Example:

```bash
gsutil cors set storage.cors.json gs://YOUR_STORAGE_BUCKET
gsutil cors get gs://YOUR_STORAGE_BUCKET
```

For local dev on this repo, `storage.cors.json` includes `http://localhost:3000` and `http://127.0.0.1:3000`. Add your deployed site origin as well before applying it.
