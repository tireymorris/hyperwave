import { fetchAndStoreArticles } from "models/article";

const scheduleArticleUpdate = async () => {
  await fetchAndStoreArticles();
};

const runEveryMinute = () => {
  const now = new Date();
  const millisecondsUntilNextMinute =
    60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

  setTimeout(() => {
    scheduleArticleUpdate();
    setInterval(scheduleArticleUpdate, 60000);
  }, millisecondsUntilNextMinute);
};

runEveryMinute();
