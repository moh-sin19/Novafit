import { NavLink } from "react-router-dom";

export default function SideMenuLink({ icon: Icon, name, to, exact = false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 h-[52px] rounded-xl px-4 transition-colors duration-150
          ${
            isActive
              ? "bg-lime-400 text-gray-950"
              : "bg-none text-secondary hover:bg-primary"
          }`
      }
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="p2">{name}</span>
    </NavLink>
  );
}
