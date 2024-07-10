import { formatRelativeTime, getLastUpdatedTimestamp } from "util/time.ts";

export default async function Header() {
  const lastUpdatedDate = getLastUpdatedTimestamp();
  const lastUpdated = lastUpdatedDate
    ? formatRelativeTime(lastUpdatedDate)
    : null;

  return (
    <header className="w-full flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg px-4 py-2 rounded-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-12 h-12 mr-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 10h16M4 14h10M4 18h10M2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4"
        />
      </svg>
      <div className="flex flex-col">
        <h1 className="text-xl font-serif italic">hyperwave news</h1>
        {lastUpdated && (
          <p className="text-sm mt-1">Last updated: {lastUpdated}</p>
        )}
      </div>
    </header>
  );
}
