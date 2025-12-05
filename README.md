# Games Progress Tracker
Simple React + TypeScript web app to track video games, filter them, and persist data with Google Drive.

## Usage
Use the app via the [link](https://federicoroldos.github.io/gamesCompletitionTracker/).

## Prerequisites
- Node.js 18+

## Installation
```bash
npm install
```

## Development
```bash
npm run build
```
```bash
npm run dev
```
Starts the Vite dev server in development mode.

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
