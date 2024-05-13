import NavItem from "./NavItem";
import Button from "./Button";
import { routes } from "../routes";

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <aside class="transition-width text-cream-100 group fixed top-11 block h-full w-16 bg-blue-900 leading-5 duration-200 hover:w-56 md:top-14 md:w-56">
      <nav>
        <ul class="m-0 flex w-full flex-col items-center p-0">
          {routes.map((route) => (
            <NavItem currentPath={currentPath} route={route} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
