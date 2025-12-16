import { useEffect, useState } from "react";
import Topbar from "../components/dashboard/Topbar";
import SideMenu from "../components/dashboard/SideMenu";

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // lock/unlock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <div className="w-screen h-screen bg-gray flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <SideMenu />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <div className="flex-1 overflow-auto px-5 py-5 lg:px-8 gap-6">
          {children}
        </div>
      </div>

      {/* Mobile fullscreen drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div className="absolute inset-y-0 left-0 w-full h-full bg-base shadow-xl animate-[slideIn_.2s_ease-out_forwards]">
            <SideMenu onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
