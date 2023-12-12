import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import Layout from "./components/Layout.tsx";
import PinkButton from "./components/PinkButton.tsx";

import editUserRoutes from "./routes/editUserInfo.tsx";

const app = new Hono();

app.use("/styles/*", serveStatic({ root: "./public/" }));
app.use("*", logger());

app.get("/", (c) => c.redirect("/dashboard"));
app.get("/dashboard", async ({ html }) =>
  html(
    <Layout title="Hyperwave" currentPath="/dashboard">
      <PinkButton class="w-40" hx-get="/editUser">
        Get User Info
      </PinkButton>
    </Layout>,
  ),
);

app.route("/editUser", editUserRoutes);

export default app;
