import { SITE } from "@/lib/site";

export function LogoMark({ className = "h-8 w-8", color = "#F6F1E8" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <g transform="translate(60, 60)">
        <g transform="rotate(0) translate(0, -16)">
          <path
            d="M -14 6 C -18 -4 -8 -16 4 -16 C 16 -16 22 -4 18 8 C 14 18 2 20 -6 14 C -12 8 -10 -2 -2 -6 C 4 -8 8 -4 6 2"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g transform="rotate(120) translate(0, -16)">
          <path
            d="M -14 6 C -18 -4 -8 -16 4 -16 C 16 -16 22 -4 18 8 C 14 18 2 20 -6 14 C -12 8 -10 -2 -2 -6 C 4 -8 8 -4 6 2"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g transform="rotate(240) translate(0, -16)">
          <path
            d="M -14 6 C -18 -4 -8 -16 4 -16 C 16 -16 22 -4 18 8 C 14 18 2 20 -6 14 C -12 8 -10 -2 -2 -6 C 4 -8 8 -4 6 2"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <circle cx="0" cy="0" r="3.5" fill="#E0AA6B" />
      </g>
    </svg>
  );
}

export function Logo({
  showKannada = true,
  className = "",
  size = "md",
}: {
  showKannada?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const iconSize = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-11 w-11" : "h-8 w-8";
  const nameSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg md:text-xl";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={iconSize} />
      <div className="flex flex-col leading-none">
        <span className={`font-display tracking-[0.16em] text-cream transition-all duration-700 ${nameSize}`}>
          {SITE.nameShort}
        </span>
        {showKannada && (
          <span className="mt-1 flex items-center gap-2 text-[0.55rem] tracking-[0.24em] text-mist/55 md:text-[0.6rem]">
            COFFEE HOUSE
            <span className="h-2.5 w-px bg-linen/20" />
            <span className="font-kannada tracking-normal">{SITE.nameKannada}</span>
          </span>
        )}
      </div>
    </div>
  );
}
