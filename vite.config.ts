import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeBase(value: string): string {
  let base = value.trim();
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base;
}

export default defineConfig(() => {
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const isUserOrOrgPagesRepo = repoName?.toLowerCase().endsWith('.github.io');

  const baseFromEnv = process.env.VITE_BASE ?? process.env.BASE_PATH;
  const base =
    baseFromEnv != null && baseFromEnv !== ''
      ? normalizeBase(baseFromEnv)
      : process.env.GITHUB_ACTIONS && repoName && !isUserOrOrgPagesRepo
        ? `/${repoName}/`
        : '/';

  return {
    plugins: [react()],
    base,
    server: {
      open: true
    }
  };
});
