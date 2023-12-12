import Calendar from "../assets/icons/calendar";
import Chart from "../assets/icons/chart";
import Check from "../assets/icons/check";
import CreditCard from "../assets/icons/credit_card";
import File from "../assets/icons/file";
import Gear from "../assets/icons/gear";
import House from "../assets/icons/house";
import Question from "../assets/icons/question";
import User from "../assets/icons/user";

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
  { title: "Tasks", link: "/tasks", icon: Check() },
  { title: "Calendar", link: "/calendar", icon: Calendar() },
  { title: "Contacts", link: "/clients", icon: User() },
  {
    title: "Templates",
    icon: File(),
    childRoutes: [
      { title: "Confirmations", link: "/confirmation_templates" },
      { title: "Emails", link: "/email_templates" },
      { title: "Forms", link: "/form_templates" },
      { title: "Invoices", link: "/invoice_item_templates" },
      {
        title: "Signature",
        link: "/signature_templates/TODOREPLACEWITHREALTOKEN/edit",
      },
      { title: "Task Lists", link: "/task_list_templates" },
      {
        title: "Terms and Conditions",
        link: "/terms_and_conditions_templates",
      },
    ],
  },
  {
    title: "Reports",
    icon: Chart(),
    childRoutes: [
      {
        title: "Commissions and Sales",
        link: "/reports/commissions_and_sales/summary",
      },
      {
        title: "Direct Payments",
        link: "/reports/direct_payments/details",
      },
      {
        title: "Bank Transfers",
        link: "/reports/bank_transfers",
      },
      {
        title: "Funds",
        link: "/reports/funds",
      },
    ],
  },
  {
    title: "Gift Cards",
    link: "/settings/gift_cards",
    icon: CreditCard(),
  },
  {
    title: "Settings",
    icon: Gear(),
    childRoutes: [
      {
        title: "Account",
        link: "/settings/account",
      },
      {
        title: "Agency Info",
        link: "/settings/agency_info",
      },
      {
        title: "Automation",
        link: "/settings/automation",
      },
      {
        title: "Direct Payments",
        link: "/settings/direct_payments",
      },
      {
        title: "Calendar",
        link: "/settings/calendars",
      },
      {
        title: "Email",
        link: "/settings/email",
      },
      {
        title: "Invoice",
        link: "/settings/invoice",
      },
      {
        title: "Membership",
        link: "/settings/membership",
      },
      {
        title: "Security",
        link: "/settings/security",
      },
      {
        title: "Team",
        link: "/team",
      },
      {
        title: "Trip Photos",
        link: "/settings/trip_photos",
      },
    ],
  },
  {
    title: "Help",
    link: "/help",
    icon: Question(),
  },
];
