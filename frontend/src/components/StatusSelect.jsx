import { ChevronDownIcon } from './icons'

const STYLES = {
  APPLIED: 'bg-slate-100 text-slate-700',
  INTERVIEWING: 'bg-amber-100 text-amber-800',
  OFFER: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-700',
  WITHDRAWN: 'bg-slate-100 text-slate-500',
}

const OPTIONS = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
]

export default function StatusSelect({ status, onChange, disabled, className = '' }) {
  return (
    <span className={`relative inline-flex items-center rounded-full text-xs font-semibold ${STYLES[status] || STYLES.APPLIED} ${className}`}>
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full bg-transparent py-1 pl-2.5 pr-6 text-xs font-semibold outline-none disabled:opacity-60"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-1.5 h-3 w-3" />
    </span>
  )
}
