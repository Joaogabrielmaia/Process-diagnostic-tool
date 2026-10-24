import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60000,
  // o servidor de desenvolvimento compila cada rota na primeira visita; 5 s não bastam para uma rota fria
  expect: { timeout: 15000 },
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: BASE_URL, locale: "pt-BR" },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `${BASE_URL}/login`,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
