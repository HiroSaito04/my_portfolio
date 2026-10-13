
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import githubContributionsHandler from "./api/github-contributions.js";

/* =========================================================
   LOCAL GITHUB API

   Makes /api/github-contributions work when running:

   npm run dev

   This is only for Vite development.
   The api/ file remains compatible with Vercel.
========================================================= */

function localGithubApi() {
  return {
    name: "local-github-api",

    configureServer(server) {
      server.middlewares.use(
        "/api/github-contributions",
        async (req, res, next) => {
          if (
            req.url !== "/" &&
            req.url !== "" &&
            !req.url?.startsWith("/?")
          ) {
            return next();
          }

          /* Adapt Node's HTTP response to the
             response methods used by Vercel. */

          const response = {
            setHeader(name, value) {
              res.setHeader(name, value);
              return response;
            },

            status(code) {
              res.statusCode = code;
              return response;
            },

            json(data) {
              res.setHeader(
                "Content-Type",
                "application/json; charset=utf-8"
              );

              res.end(JSON.stringify(data));

              return response;
            },
          };

          try {
            await githubContributionsHandler(
              req,
              response
            );
          } catch (error) {
            console.error(
              "Local GitHub API error:",
              error
            );

            if (!res.headersSent) {
              res.statusCode = 500;

              res.setHeader(
                "Content-Type",
                "application/json"
              );

              res.end(
                JSON.stringify({
                  error: "Internal API error",
                })
              );
            }
          }
        }
      );
    },
  };
}

/* =========================================================
   VITE CONFIGURATION
========================================================= */

export default defineConfig(({ mode }) => {
  // Load private environment variables
  // for use on the Node.js server only.
  const env = loadEnv(
    mode,
    process.cwd(),
    ""
  );

  if (
    env.GITHUB_TOKEN &&
    !process.env.GITHUB_TOKEN
  ) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
  }

  return {
    plugins: [
      react(),
      localGithubApi(),
    ],
  };
});
