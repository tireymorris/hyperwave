import { Route } from "../routes";

type NavItemProps = {
  currentPath: string;
  route: Route;
};

export default function NavItem({ currentPath, route }: NavItemProps) {
  return (
    <li
      class={`hover:bg-slate-700 text-slate-400 m-0 w-full list-none pl-6 hover:text-white ${
        currentPath === route.link && "bg-slate-700 text-white"
      }`}
    >
      <a
        href={route.link}
        class="duration-50 min-h-14 flex max-h-14 cursor-pointer items-center gap-4 fill-white py-4 text-left text-sm uppercase no-underline"
      >
        <span class="fixed">{route.icon}</span>
        <span class="relative left-10 m-0 p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:opacity-100">
          {route.title}
        </span>
      </a>
    </li>
  );
}
