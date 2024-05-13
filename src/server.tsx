import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import Layout from "./components/Layout.tsx";
import Button from "./components/Button.tsx";

import editUserRoutes from "./routes/editUserInfo.tsx";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

app.get("/", (c) => c.redirect("/dashboard"));
app.get("/settings", async ({ html }) =>
  html(
    <Layout title="hyperwave | settings" currentPath="/settings">
      Settings go here
    </Layout>,
  ),
);

app.get("/dashboard", async ({ html }) =>
  html(
    <Layout title="hyperwave | dashboard" currentPath="/dashboard">
      <Button class="w-40" hx-get="/editUser">
        Get User Info
      </Button>
    </Layout>,
  ),
);

app.route("/editUser", editUserRoutes);

export default {
  port: process.env.PORT || 1234,
  fetch: app.fetch,
};
