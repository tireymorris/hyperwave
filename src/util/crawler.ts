import { load } from "cheerio";
import { Article, isValidArticle } from "models/article";
import { log, debug } from "util/log";
import db from "@/db";
import { NewsSource } from "../models/newsSources";

const getStoredHash = (source: string): string | null => {
  const result = db
    .prepare("SELECT hash FROM source_hashes WHERE source = ?")
    .get(source) as { hash: string } | undefined;
  return result ? result.hash : null;
};

const updateStoredHash = (source: string, hash: string): void => {
  db.prepare(
    "INSERT OR REPLACE INTO source_hashes (source, hash) VALUES (?, ?)",
  ).run(source, hash);
};

export const fetchArticlesFromSource = async (
  source: NewsSource,
): Promise<Article[]> => {
  log(`Fetching articles from: ${source.name}`);

  const response = await fetch(source.url);
  const text = await response.text();

  const currentHash = Bun.hash(text).toString();
  const storedHash = getStoredHash(source.name);

  if (currentHash === storedHash) {
    debug(`No changes detected for ${source.name}. Skipping processing.`);
    return [];
  }

  updateStoredHash(source.name, currentHash);

  debug(`*** Fetched ${text.length} bytes from: ${source.name}`);
  const $ = load(text);
  const articles: Article[] = [];

  $(source.listSelector)
    .slice(0, source.limit || 100)
    .each((_, element) => {
      const titleElement = source.titleSelector
        ? $(element).find(source.titleSelector)
        : $(element);
      const title = titleElement.text().trim();
      const relativeLink = $(element).attr("href");

      if (title && relativeLink) {
        const link = new URL(relativeLink, source.baseUrl).href;
        const article: Article = {
          id: Bun.hash(title).toString(),
          title,
          link,
          source: source.name,
          created_at: new Date().toISOString(),
        };
        if (!isValidArticle(article)) {
          debug(`*** INVALID: ${source.name}: ${title} ${link}`);
        } else {
          articles.push(article);
          debug(`*** VALID: ${source.name}: ${title} ${link}`);
        }
      } else {
        debug(`*** MISSING INFO: ${source.name}: ${title} ${relativeLink}`);
      }
    });

  debug(`*** Fetched ${articles.length} articles from: ${source.name}`);

  return articles;
};
