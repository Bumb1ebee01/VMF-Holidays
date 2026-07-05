import type { ToolIcon } from "@/lib/data/tools";

// Simple 24px line icons (stroke = currentColor) so tool cards stay on-brand
// without shipping an icon library.
const PATHS: Record<ToolIcon, React.ReactNode> = {
  split: (
    <>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="17" r="3" />
      <path d="M10 7h5a2 2 0 0 1 2 2v5" />
      <path d="M14 17H9a2 2 0 0 1-2-2v-5" />
    </>
  ),
  currency: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.9-2.5 2s1.1 1.7 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2A2.5 2.5 0 0 1 9.5 15" />
      <path d="M12 6v1M12 17v1" />
    </>
  ),
  tip: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M14.5 9a2.2 2.2 0 0 0-2.5-1.3c-1.3 0-2.3.8-2.3 1.9s1 1.6 2.3 1.9 2.3.8 2.3 1.9-1 1.8-2.3 1.8A2.2 2.2 0 0 1 9.5 15" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      <path d="M15.5 13.5l1.5 1.5 3-3" />
    </>
  ),
  budget: (
    <>
      <path d="M3 7h13a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H5a2 2 0 0 1-2-2V7z" />
      <path d="M3 7l3-3h9l2 3" />
      <circle cx="16" cy="13" r="1.4" />
    </>
  ),
  compare: (
    <>
      <path d="M12 3v18" />
      <path d="M6 7l-3 5h6l-3-5zM3 12a3 3 0 0 0 6 0" />
      <path d="M18 7l-3 5h6l-3-5zM15 12a3 3 0 0 0 6 0" />
    </>
  ),
  passport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 17h5" />
    </>
  ),
  packing: (
    <>
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2M9 12v6M15 12v6" />
    </>
  ),
  weather: (
    <>
      <circle cx="8" cy="9" r="3.2" />
      <path d="M8 2.5v1.5M8 14v1.5M2.5 9H4M12 9h1.5M4.2 5.2l1 1M11.8 5.2l-1 1" />
      <path d="M12 19a3 3 0 0 1 .3-6 4 4 0 0 1 7.5 1.4A2.6 2.6 0 0 1 19.5 19H12z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3L12 3z" />
      <path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </>
  ),
};

export function ToolGlyph({ icon }: { icon: ToolIcon }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[icon]}
    </svg>
  );
}
