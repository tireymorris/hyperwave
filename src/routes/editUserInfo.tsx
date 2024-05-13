import { Hono } from "hono";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import { addUser, createUsers, db } from "../db.ts";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";

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
      <div class="text-md self-start rounded-md bg-blue-100 px-10 py-2 shadow-sm">
        <p>Hi, {me.first_name}!</p>
        <p>Email: {me.email}</p>
      </div>

      <h3>Change Info</h3>
      <form
        class="bg-palette-section text-palette-textBody flex w-full flex-col gap-4 p-4 shadow-md md:w-96"
        hx-post={`/editUser/${me.email}`}
        hx-target="closest section"
      >
        <div class="flex flex-col justify-between md:flex-row">
          <label>Email Address</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="Email"
            type="email"
            name="email"
          />
        </div>
        <div class="flex flex-col justify-between md:flex-row">
          <label>First Name</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="First name"
            type="text"
            name="firstName"
          />
        </div>
        <div class="flex flex-col justify-between md:flex-row">
          <label>Last Name</label>
          <Input
            class="bg-palette-highlight! sm:ml-4"
            placeholder="Last name"
            type="text"
            name="lastName"
          />
        </div>
        <Button class="btn btn-default" type="submit">
          Submit
        </Button>
      </form>
    </section>,
  );
});

app.post("/:email", async (c) => {
  const email = c.req.param("email");
  const body = await c.req.parseBody();

  const userSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  });

  try {
    const validatedBody = userSchema.parse(body);
    const { email: newEmail, firstName, lastName } = validatedBody;

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
        <Button class="w-40" hx-get="/editUser" hx-target="closest div">
          Get User Info
        </Button>
      </div>,
    );
  } catch (error) {
    console.error(error);
    return c.html(
      <div>
        <p>Error: {error.errors[0]?.message ?? "Unknown error"}. </p>
        <Button class="w-40" hx-get="/editUser" hx-target="closest div">
          Get User Info
        </Button>
      </div>,
    );
  }
});

export default app;
