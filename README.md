# Games Progress Tracker
Simple React + TypeScript web app to track video games, filter them, and persist data with Google Drive.

## Usage
Use the app via the [link](https://federicoroldos.github.io/Games-Progress-Tracker/).

## Prerequisites
- Node.js 18+

## Installation
```bash
npm install
```

Google sign-in goes through Firebase, so the app needs a Firebase project. Create a `.env` file in the repo root with its web app settings (Firebase console → Project settings → Your apps):

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

In Google Cloud, enable the **Google Drive API** for that project and allow the `https://www.googleapis.com/auth/drive.appdata` scope.

## Development
```bash
npm run dev        # start the dev server
npm run build      # type-check and build into dist/
npm run preview    # serve the built version locally
```

## Deploy
Every push to `main` builds the app and publishes it to GitHub Pages ([`deploy.yml`](.github/workflows/deploy.yml)). The workflow reads the four `VITE_FIREBASE_*` values from the repository's **Actions secrets**, so set them there too.

## Features
- Add, list, edit, and delete games.
- Search by title, filter by status and ranking, and choose sort order (title A-Z or ranking). Includes pagination.
- Persistence in `localStorage` and JSON backup import/export.
- Excel import and export.
- Backup to Google Drive (hidden `appDataFolder` folder) after signing in with Google.
- Language selection between English and Spanish.

## Key fields
- Title, Platform, Status (Platino / Completed / Beaten / Started / Unplayed / Abandoned / Tried / Not applicable), Ranking (S+ to G), Publisher, Genre, dates (release, first time, start, last, finish), hours (last session and total), years played, and comment.

## Backup and sync
- Export JSON: "Backup and sync" section -> "Export JSON".
- Import JSON: "Import JSON" and select your file.
- Google Drive: sign in with Google. Backup is stored in `appDataFolder`; the app prepares the file automatically. Use "Upload to Drive" to save and "Download from Drive" to restore (works on any device where you sign in).
- Import Excel: in "Local file" use "Import Excel" with your Excel file (recommended to match the form fields as columns).
- Export Excel: "Backup and sync" section -> "Export Excel".
