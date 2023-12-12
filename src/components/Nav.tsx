import NavItem from "./NavItem";
import PinkButton from "./PinkButton";
import { routes } from "../routes";

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <aside class="bg-slate-800 transition-width group fixed top-14 block h-full w-16 leading-5 duration-200 hover:w-56 md:w-56">
      <nav>
        <ul class="m-0 flex w-full flex-col items-center p-0">
          <PinkButton class="items-start! justify-start! my-4 w-5/6 pl-5">
            <span class="fixed pl-0.5">+</span>
            <span class="relative left-10 m-0 p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:opacity-100">
              CREATE
            </span>
          </PinkButton>
          {routes.map((route) => (
            <NavItem currentPath={currentPath} route={route} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
