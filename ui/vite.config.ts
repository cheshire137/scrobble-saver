import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  let port = 4000;
  if (process.env.PORT) {
    port = parseInt(process.env.PORT);
  }
  return defineConfig({
    plugins: [react()],
    server: { port },
  });
};
