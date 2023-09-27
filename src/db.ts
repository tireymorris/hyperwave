import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });

const query = db.query(`select "Hello world" as message`);

console.log(query);
