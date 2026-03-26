"use client";

const CRITERIA = [
  { label: "Relevancy",   href: "#relevancy"   },
  { label: "Technical",   href: "#technical"   },
  { label: "Presentation",href: "#presentation"},
  { label: "Impact",      href: "#impact"      },
  { label: "Innovation",  href: "#innovation"  },
];

export function CriteriaNav() {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="sticky top-[57px] z-40 border-b-2 border-white bg-[#0e0e0e]">
      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop: horizontal row */}
        <div className="hidden md:flex items-center gap-0 overflow-x-auto">
          {CRITERIA.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={(e) => handleClick(e, c.href)}
              className="px-6 py-3 text-sm font-bold text-[#a0a0a0] border-r-2 border-white hover:text-white hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Mobile: horizontal scroll bar */}
        <div
          className="flex md:hidden items-center gap-0 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CRITERIA.map((c) => (
            <a
              key={c.href}
              href={c.href}
              onClick={(e) => handleClick(e, c.href)}
              className="flex-none px-4 py-3 text-xs font-bold text-[#a0a0a0] border-r-2 border-white hover:text-white hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
