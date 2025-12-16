// components/dashboard/TabsNav.jsx
import { useEffect, useRef, useState } from "react";

/**
 * TabsNav
 * props:
 *  - tabs: [{ key, label, icon: Icon }]
 *  - active: string
 *  - onChange: (key)=>void
 */
export default function TabsNav({ tabs = [], active, onChange }) {
  const railRef = useRef(null);
  const itemRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const setItemRef = (key) => (el) => {
    if (el) itemRefs.current[key] = el;
  };

  const measure = () => {
    const rail = railRef.current;
    const el = itemRefs.current[active];
    if (!rail || !el) return;
    // account for horizontal scroll so the underline stays under the tab
    const left = el.offsetLeft - rail.scrollLeft;
    setIndicator({ left, width: el.offsetWidth });
  };

  useEffect(() => {
    measure();
    const rail = railRef.current;
    if (!rail) return;

    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    window.addEventListener("resize", measure);
    rail.addEventListener("scroll", measure, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      rail.removeEventListener("scroll", measure);
    };
  }, [active, tabs.length]);

  return (
    <div className="relative w-full max-w-full min-w-0 border-b border-subtle overflow-hidden">
      {/* Scrollable rail */}
      <div
        ref={railRef}
        role="tablist"
        aria-orientation="horizontal"
        className="w-full overflow-x-auto overflow-y-hidden no-scrollbar
                   flex gap-4 md:gap-6 px-2 md:px-0 -mx-2 md:mx-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange?.(key)}
              ref={setItemRef(key)}
              className={[
                "p4 md:sh3 shrink-0 inline-flex items-center gap-1.5 md:gap-2 py-3 px-1",
                isActive ? "text-accent" : "text-secondary",
              ].join(" ")}
            >
              {Icon && (
                <Icon
                  size={18}
                  className={[
                    "md:w-5 md:h-5",
                    isActive ? "text-accent" : "text-secondary",
                  ].join(" ")}
                />
              )}
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Active underline (inside same container, scroll-aware) */}
      <span
        className="absolute bottom-0 h-0.5 bg-lavender-600 transition-all duration-200"
        style={{ left: indicator.left, width: indicator.width }}
        aria-hidden
      />
    </div>
  );
}
