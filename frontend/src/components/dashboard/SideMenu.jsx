import { useState } from "react";
import Logo from "../ui/Logo";
import { User, LogOut, X } from "lucide-react";
import SideMenuLink from "./SideMenuLink";
import LogoutModal from "./LogoutModal";
import { NAV_SECTIONS } from "../../config/dashboard-nav";

export default function SideMenu({ onClose }) {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="bg-base border-r border-subtle h-full md:h-screen w-full md:w-[280px] lg:w-[320px] xl:w-[380px] flex flex-col justify-between p-6 md:p-8 overflow-scroll">
      {/* Close (mobile only) */}
      <div className="md:hidden mb-3 absolute right-5 top-5">
        <button type="button" onClick={onClose} aria-label="Close menu">
          <X className="w-6 h-6 text-primary" />
        </button>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <Logo />
        <div className="flex flex-col gap-2">
          <p className="p2 text-secondary uppercase">Main Menu</p>
          {NAV_SECTIONS.slice(0, NAV_SECTIONS.length - 1).map(
            ({ name, path, icon, exact }) => (
              <SideMenuLink
                key={path}
                icon={icon}
                name={name}
                to={path}
                exact={exact}
                onClick={onClose} // close drawer on mobile
              />
            )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <p className="p2 text-secondary uppercase">General</p>
        <SideMenuLink icon={User} name="Profile" to="/app/profile" />
        {/* Sign Out opens modal */}
        <button
          type="button"
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-3 h-[56px] rounded-2xl px-4 text-left text-secondary hover:bg-primary hover:text-primary transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="p2">Sign Out</span>
        </button>
        <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
      </div>
    </div>
  );
}
