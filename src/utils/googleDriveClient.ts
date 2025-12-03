const UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DOWNLOAD_URL = 'https://www.googleapis.com/drive/v3/files';
const FILES_URL = 'https://www.googleapis.com/drive/v3/files';

export const uploadToDrive = async (token: string, fileId: string, content: string) => {
  if (!fileId) {
    throw new Error('Debes indicar un fileId de Drive donde guardar el backup');
  }

  const url = `${UPLOAD_URL}/${fileId}?uploadType=media`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: content
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al subir a Google Drive: ${errorText || response.statusText}`);
  }
};

export const downloadFromDrive = async (token: string, fileId: string) => {
  if (!fileId) {
    throw new Error('Debes indicar un fileId de Drive para descargar el backup');
  }

  const url = `${DOWNLOAD_URL}/${fileId}?alt=media`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al descargar de Google Drive: ${errorText || response.statusText}`);
  }

  return response.text();
};

export const createBackupFileOnDrive = async (token: string, name = 'gametracker-backup.json') => {
  const response = await fetch(FILES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      mimeType: 'application/json'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear archivo en Drive: ${errorText || response.statusText}`);
  }

  const data = (await response.json()) as { id?: string };
  if (!data.id) {
    throw new Error('No se pudo obtener el ID del archivo creado en Drive');
  }
  return data.id;
};
