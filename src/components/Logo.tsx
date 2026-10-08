const BASE = import.meta.env.BASE_URL;

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`} aria-label="PilotSwap home">
      {/* Icon cropped from the brand logo. The white tile keeps its dark-navy parts visible on the dark theme. */}
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-lg shadow-black/30">
        <img src={`${BASE}logo-icon.png`} alt="" width={32} height={22} className="h-auto w-full" draggable={false} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-white">PilotSwap</span>
    </a>
  );
}
