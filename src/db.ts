import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });

const createMovies = db.query(`
  CREATE TABLE IF NOT EXISTS Movie (
    movie_id INTEGER PRIMARY KEY,
    name TEXT,
    year TEXT,
    runtime INTEGER,
    categories TEXT,
    release_date TEXT,
    director TEXT,
    writer TEXT,
    actors TEXT,
    storyline TEXT
  );
`);

const createActors = db.query(`
  CREATE TABLE IF NOT EXISTS Actor (
    actor_id INTEGER PRIMARY KEY,
    name TEXT,
    birthname TEXT,
    birthdate TEXT,
    birthplace TEXT
  );
`);

createMovies.run();
createActors.run();
