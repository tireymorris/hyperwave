import { Hono } from "hono";
import Input from "../components/Input.tsx";
import PinkButton from "../components/PinkButton.tsx";
import { addUser, createUsers, db } from "../db.ts";

const app = new Hono();

createUsers().run();

app.get("/", async ({ html }) => {
  const me = db.query("select * from User limit 1").get() as {
    first_name: string;
    last_name: string;
    email: string;
  };

  if (!me || !me.email || !me.first_name || !me.last_name) {
    addUser().run("hyper@wave.com", "Hyper", "Wave");
    return html(<p>Refresh pls, you hit a race condition :)</p>);
  }

  return html(
    <section class="flex flex-col gap-4">
      <div class="text-md bg-blue-100 self-start rounded-md px-10 py-2 shadow-sm">
        <p>Hi, {me.first_name}!</p>
        <p>Email: {me.email}</p>
      </div>

      <h3>Change Info</h3>
      <form
        class="bg-palette-section text-palette-textBody flex w-96 flex-col gap-4 p-4 shadow-md"
        hx-post={`/editUser/${me.email}`}
        hx-target="closest section"
      >
        <div class="flex justify-between">
          <label>Email Address</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="Email"
            type="text"
            name="email"
          />
        </div>
        <div class="flex justify-between">
          <label>First Name</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="First name"
            type="text"
            name="firstName"
          />
        </div>
        <div class="flex justify-between">
          <label>Last Name</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="Last name"
            type="text"
            name="lastName"
          />
        </div>
        <PinkButton class="btn btn-default" type="submit">
          Submit
        </PinkButton>
      </form>
    </section>,
  );
});

app.post("/:email", async (c) => {
  const email = c.req.param("email");
  const body = await c.req.parseBody();
  const { email: newEmail, firstName, lastName } = body;

  if (
    typeof email !== "string" ||
    typeof newEmail !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string"
  ) {
    throw new Error("Bad Request");
  }

  db.prepare(
    "UPDATE USER SET email = $1, first_name = $2, last_name = $3 WHERE email = $4",
  ).run({
    $1: newEmail,
    $2: firstName,
    $3: lastName,
    $4: email,
  });

  return c.html(
    <div>
      <p>Updated user info. </p>
      <PinkButton class="w-40" hx-get="/editUser" hx-target="closest div">
        Get User Info
      </PinkButton>
    </div>,
  );
});

export default app;
