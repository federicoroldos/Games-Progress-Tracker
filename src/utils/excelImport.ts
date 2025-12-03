import { Game, GameRanking, GameStatus } from '../types/Game';
import * as XLSX from 'xlsx';

type GameInput = Omit<Game, 'id' | 'createdAt'>;

const STATUS_VALUES: GameStatus[] = [
  'Platino',
  'Completado',
  'Pasado',
  'Empezado',
  'Sin probar',
  'Abandonado',
  'Probado',
  'No aplica'
];

const RANKING_VALUES: GameRanking[] = ['S+', 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

const toStatus = (value: unknown): GameStatus => {
  const s = String(value ?? '').trim();
  return STATUS_VALUES.includes(s as GameStatus) ? (s as GameStatus) : 'Probado';
};

const toRanking = (value: unknown): GameRanking => {
  const s = String(value ?? '').trim();
  return RANKING_VALUES.includes(s as GameRanking) ? (s as GameRanking) : 'G';
};

const toDateString = (value: unknown): string => {
  if (value instanceof Date) {
    return formatDate(value);
  }
  if (typeof value === 'number') {
    const d = XLSX.SSF.parse_date_code(value);
    if (d) {
      const jsDate = new Date(d.y, (d.m ?? 1) - 1, d.d ?? 1);
      return formatDate(jsDate);
    }
  }
  if (typeof value === 'string') {
    const clean = value.trim();
    if (!clean) return '';
    const parsed = new Date(clean);
    if (!Number.isNaN(parsed.getTime())) {
      return formatDate(parsed);
    }
    return clean;
  }
  return '';
};

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

export const parseExcelFile = async (file: File): Promise<GameInput[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

  // Header is in row 3 (index 2)
  const header = rows[2] || [];
  const indexOf = (name: string) =>
    header.findIndex((h) => typeof h === 'string' && h.toLowerCase().startsWith(name));

  const idxNombre = indexOf('nombre');
  const idxPlataforma = indexOf('plataforma');
  const idxEstado = indexOf('estado');
  const idxTier = indexOf('tier');
  const idxNotas = indexOf('nota');
  const idxRelease = indexOf('fecha de lanzamiento');
  const idxPublisher = indexOf('publisher');
  const idxGenero = indexOf('género');
  const idxPrimera = indexOf('fecha primera');
  const idxInicio = indexOf('fecha de comienzo');
  const idxFin = indexOf('fecha de fin');
  const idxHorasUlt = indexOf('horas jugadas');
  const idxYears = indexOf('años pasado');
  const idxHorasTot = indexOf('horas totales');

  const dataRows = rows.slice(3); // start after header
  const games: GameInput[] = [];

  for (const row of dataRows) {
    if (!row || row.length === 0) continue;
    const title = row[idxNombre];
    if (!title) continue;

    const game: GameInput = {
      title: String(title),
      platform: idxPlataforma >= 0 ? String(row[idxPlataforma] ?? '') : '',
      status: toStatus(idxEstado >= 0 ? row[idxEstado] : ''),
      ranking: toRanking(idxTier >= 0 ? row[idxTier] : ''),
      comment: idxNotas >= 0 ? String(row[idxNotas] ?? '') : '',
      releaseDate: toDateString(idxRelease >= 0 ? row[idxRelease] : ''),
      publisher: idxPublisher >= 0 ? String(row[idxPublisher] ?? '') : '',
      genres: idxGenero >= 0 ? String(row[idxGenero] ?? '') : '',
      firstPlayedAt: toDateString(idxPrimera >= 0 ? row[idxPrimera] : ''),
      startDate: toDateString(idxInicio >= 0 ? row[idxInicio] : ''),
      endDate: toDateString(idxFin >= 0 ? row[idxFin] : ''),
      lastSessionHours:
        idxHorasUlt >= 0 && row[idxHorasUlt] !== undefined && row[idxHorasUlt] !== null
          ? Number(row[idxHorasUlt])
          : null,
      yearsPlayed: idxYears >= 0 ? String(row[idxYears] ?? '') : '',
      totalHours:
        idxHorasTot >= 0 && row[idxHorasTot] !== undefined && row[idxHorasTot] !== null
          ? Number(row[idxHorasTot])
          : null
    };

    games.push(game);
  }

  return games;
};
