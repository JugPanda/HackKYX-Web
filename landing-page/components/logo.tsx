export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent text-sm font-semibold text-emerald-200 shadow-lg shadow-emerald-900/40">
        KYX
      </div>
      <div>
        <p className="text-base font-semibold tracking-tight text-white">
          KYX Engine
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
          Build playable worlds
        </p>
      </div>
    </div>
  );
}
