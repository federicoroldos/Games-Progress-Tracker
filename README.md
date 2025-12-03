# Games Progress Tracker
Webapp simple en React + TypeScript para llevar un registro de videojuegos con CRUD y persistencia en `localStorage`.

## Requisitos previos
- Node.js 18+

## Instalación
```bash
npm install
```

## Desarrollo
```bash
npm run dev
```
Abrirá el servidor de Vite en modo desarrollo.

## Build de producción
```bash
npm run build
```
El resultado quedará en `dist/`. Puedes previsualizarlo con:
```bash
npm run preview
```

## Respaldo y sincronización
- Exportar JSON: desde la app, sección "Respaldo y sincronización" → "Exportar JSON".
- Importar JSON: "Importar JSON" y selecciona el archivo.
- Google Drive: inicia sesión con Google (se solicitará el scope `drive.file`), indica el `fileId` de un archivo en Drive (ej. crea `gametracker-backup.json` y copia su ID) y usa "Subir a Drive" / "Descargar de Drive".
  - Nuevo: puedes crear el archivo desde la app con el botón "Crear archivo en Drive" (requiere sesión iniciada).

### Configuración de Firebase (auth con Google)
1) Crea un proyecto en Firebase, habilita Google Sign-In en Authentication.  
2) Añade la configuración web en un archivo `.env` (ejemplo):
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```
3) En la pantalla de OAuth (Google Cloud), añade el scope `https://www.googleapis.com/auth/drive.file`.  
4) Obtén el `fileId` de un archivo en tu Drive donde guardarás el backup (puede estar vacío) y pégalo en la UI.  
Nota: el token de Drive se obtiene al iniciar sesión; tras recargar es posible que necesites volver a iniciar para renovar el token.
