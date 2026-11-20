// One authored icon set: 24px grid, 1.75 stroke, round caps.
type P = { size?: number; className?: string };
const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const PassportIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <circle cx="12" cy="10" r="3.2" />
    <path d="M8.8 10h6.4M12 6.8c1 .9 1.4 2 1.4 3.2s-.4 2.3-1.4 3.2c-1-.9-1.4-2-1.4-3.2s.4-2.3 1.4-3.2M9 17h6" />
  </svg>
);
export const StampIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9.5 3.5h5l-.8 5.5h-3.4z" />
    <path d="M7 9h10a2 2 0 0 1 2 2v2H5v-2a2 2 0 0 1 2-2z" />
    <path d="M5 13h14v2H5zM6 19h12" />
  </svg>
);
export const CloseIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const ChevronLeft = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const ChevronRight = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);
export const CheckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
export const ResetIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5v5h5" />
    <path d="M5.2 15a7.5 7.5 0 1 0 1.3-8.1L4 10" />
  </svg>
);
export const CompassIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </svg>
);
