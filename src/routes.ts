import Gear from "../assets/icons/gear";
import House from "../assets/icons/house";

export type Route = {
  title: string;
  link?: string;
  childRoutes?: Route[];
  icon?: any;
};

export const routes: Route[] = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: House(),
  },
  {
    title: "Settings",
    link: "/settings",
    icon: Gear(),
  },
];
