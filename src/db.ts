import { Database } from "bun:sqlite";

export const db = new Database("db.sqlite", { create: true });

export const createUsers = () =>
  db.query(`
  CREATE TABLE IF NOT EXISTS User (
    first_name TEXT,
    last_name TEXT,
    email TEXT
  );
`);

export const addUser = () =>
  db.query("INSERT INTO User (first_name, last_name, email) VALUES (?, ?, ?);");
