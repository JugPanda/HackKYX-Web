export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-500 dark:border-emerald-400/40 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-emerald-400/10 dark:from-emerald-500/20 dark:via-cyan-500/10 dark:to-transparent text-sm font-bold text-emerald-700 dark:text-emerald-200 shadow-lg shadow-emerald-300/50 dark:shadow-emerald-900/40">
        JG
      </div>
      <div>
        <p className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
          JG Engine
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-700 dark:text-slate-400 font-medium">
          Build playable worlds
        </p>
      </div>
    </div>
  );
}
