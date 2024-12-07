export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Cartem",
  description: "Make beautiful websites regardless of your design experience.",
  navItemsAdmin: [
    {
      label: "Inicio",
      href: "/dashboard",
    },
    {
      label: "Productos",
      href: "/dashboard/admin/products",
    },
    {
      label: "Personas",
      href: "/dashboard/admin/persons",
    },
    {
      label: "Ventas",
      href: "/about",
    },
    {
      label: "Reportes",
      href: "/about",
    },
  ],
  navItemsEmployee: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Productos",
      href: "/dashboard/worker/products",
    },
    {
      label: "Pedidos",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
