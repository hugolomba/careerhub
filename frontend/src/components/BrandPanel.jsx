import { Link } from 'react-router-dom'
import Logo from './Logo'
import { CheckCircleIcon } from './icons'

const POINTS = [
  'Track every application in one pipeline',
  'Log interviews and never lose the thread',
  'Keep every CV version organized',
]

export default function BrandPanel({ heading, subheading }) {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-blob rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-white/10 blur-3xl" />

      <Link to="/" className="relative z-10">
        <Logo dark markClassName="h-9 w-9" textClassName="text-lg" />
      </Link>

      <div className="relative z-10 max-w-md">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white">{heading}</h2>
        <p className="mt-4 text-base leading-relaxed text-primary-100">{subheading}</p>
        <ul className="mt-8 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm text-white/90">
              <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-300" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative z-10 text-xs text-primary-200">&copy; {new Date().getFullYear()} CareerHub. All rights reserved.</p>
    </div>
  )
}
