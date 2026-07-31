export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#121822" />
      <rect x="9" y="22" width="5.5" height="9" rx="1.6" fill="#ffffff" fillOpacity="0.55" />
      <rect x="17.25" y="15.5" width="5.5" height="15.5" rx="1.6" fill="#ffffff" fillOpacity="0.8" />
      <rect x="25.5" y="8.5" width="5.5" height="22.5" rx="1.6" fill="#fbbf24" />
    </svg>
  )
}

export default function Logo({ className = '', markClassName = 'h-9 w-9', textClassName = 'text-lg', dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      <span className={`font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'} ${textClassName}`}>
        Career<span className={dark ? 'text-amber-400' : 'text-primary-600'}>Hub</span>
      </span>
    </span>
  )
}
