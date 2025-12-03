import { useEffect, useMemo, useState } from 'react';
import GameFilters from './components/GameFilters';
import GameForm from './components/GameForm';
import GameList from './components/GameList';
import BackupPanel from './components/BackupPanel';
import LegendPanel from './components/LegendPanel';
import { useGameStorage } from './hooks/useGameStorage';
import { Game, GameRanking, GameStatus } from './types/Game';

type SortOption = 'titulo' | 'ranking';

const rankingOrder: GameRanking[] = ['S+', 'S', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

const App = () => {
  const { games, addGame, addMany, updateGame, deleteGame, exportJson, importJson } =
    useGameStorage();
  const [statusFilter, setStatusFilter] = useState<GameStatus | 'todos'>('todos');
  const [rankingFilter, setRankingFilter] = useState<GameRanking | 'todos'>('todos');
  const [sortBy, setSortBy] = useState<SortOption>('titulo');
  const [editing, setEditing] = useState<Game | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const itemsPerPage = 9;

  const filteredGames = useMemo(() => {
    const bySearch = search
      ? games.filter((game) => game.title.toLowerCase().includes(search.toLowerCase()))
      : games;

    const byStatus =
      statusFilter === 'todos'
        ? bySearch
        : bySearch.filter((game) => game.status === statusFilter);

    const byRanking =
      rankingFilter === 'todos'
        ? byStatus
        : byStatus.filter((game) => game.ranking === rankingFilter);

    if (sortBy === 'ranking') {
      return [...byRanking].sort(
        (a, b) => rankingOrder.indexOf(a.ranking) - rankingOrder.indexOf(b.ranking)
      );
    }

    return [...byRanking].sort((a, b) => a.title.localeCompare(b.title, 'es'));
  }, [games, search, statusFilter, rankingFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredGames.length / itemsPerPage));
  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, rankingFilter, sortBy, search]);

  const pagedGames = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredGames.slice(start, start + itemsPerPage);
  }, [filteredGames, page]);

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSubmit = (
    data: Omit<Game, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      updateGame(existingId, data);
      setEditing(null);
      return;
    }

    addGame(data);
  };

  const handleEdit = (game: Game) => {
    setEditing(game);
  };

  const handleCancelEdit = () => setEditing(null);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Games Progress Tracker</p>
          <h1>Tu lista de videojuegos en un solo lugar</h1>
          <p className="app__subtitle">
            Agrega, edita y organiza los juegos que quieres jugar, estás jugando o ya
            terminaste.
          </p>
        </div>
        <div className="app__stats">
          <div className="stat">
            <span className="stat__label">Total</span>
            <span className="stat__value">{games.length}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Empezado</span>
            <span className="stat__value">{games.filter((g) => g.status === 'Empezado').length}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Platino</span>
            <span className="stat__value">{games.filter((g) => g.status === 'Platino').length}</span>
          </div>
          <div className="stat">
            <span className="stat__label">Sin probar</span>
            <span className="stat__value">
              {games.filter((g) => g.status === 'Sin probar').length}
            </span>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>{editing ? 'Editar juego' : 'Agregar juego'}</h2>
          <GameForm
            key={editing?.id ?? 'new'}
            initialGame={editing}
            onSubmit={handleSubmit}
            onCancelEdit={editing ? handleCancelEdit : undefined}
          />
        </section>

        <section className="panel">
          <div className="panel__header">
          <h2>Juegos guardados</h2>
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="button button--ghost">
              Buscar
            </button>
          </form>
          <GameFilters
            statusFilter={statusFilter}
            rankingFilter={rankingFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onRankingChange={setRankingFilter}
            onSortChange={setSortBy}
          />
        </div>

          <GameList games={pagedGames} onEdit={handleEdit} onDelete={deleteGame} />
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage(1)}
              disabled={page === 1}
              aria-label="Primera página"
            >
              «
            </button>
            {Array.from({ length: pageCount }, (_, idx) => idx + 1)
              .filter((n) => n >= page - 1 && n <= page + 4)
              .map((n) => (
                <button
                  key={n}
                  className={`page-btn ${n === page ? 'page-btn--active' : ''}`}
                  onClick={() => setPage(n)}
                  aria-label={`Página ${n}`}
                >
                  {n}
                </button>
              ))}
            <button
              className="page-btn"
              onClick={() => setPage(pageCount)}
              disabled={page === pageCount}
              aria-label="Última página"
            >
              »
            </button>
          </div>
        </section>
      </main>

      <BackupPanel
        onExportJson={exportJson}
        onImportJson={importJson}
        onImportExcel={(items) => addMany(items)}
      />
      <LegendPanel />
    </div>
  );
};

export default App;
