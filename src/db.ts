import { Database } from "bun:sqlite";

const isTest = process.env.NODE_ENV === "test";
const db = new Database(isTest ? "test_articles.db" : "articles.db");

db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT UNIQUE,
    link TEXT,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS source_hashes (
    source TEXT PRIMARY KEY,
    hash TEXT
  )
`);

export default db;
