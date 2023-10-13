import { Database } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });

const createMovies = db.query(`
  CREATE TABLE IF NOT EXISTS Movie (
    movie_id INTEGER PRIMARY KEY,
    year TEXT,
    description TEXT,
    genre TEXT,
    cover_image BLOB,
    actors_json JSON -- or JSONB for binary JSON storage
  );
`)

const createActors = db.query(`
  CREATE TABLE IF NOT EXISTS Actor (
    actor_id INTEGER PRIMARY KEY,
    name TEXT
  );
`)

createMovies.run();
createActors.run();


