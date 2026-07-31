const STYLES = {
  APPLIED: 'bg-slate-100 text-slate-700',
  INTERVIEWING: 'bg-amber-100 text-amber-800',
  OFFER: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-700',
  WITHDRAWN: 'bg-slate-100 text-slate-500',
}

const DOTS = {
  APPLIED: 'bg-slate-400',
  INTERVIEWING: 'bg-amber-500',
  OFFER: 'bg-emerald-500',
  REJECTED: 'bg-rose-500',
  WITHDRAWN: 'bg-slate-400',
}

const LABELS = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || STYLES.APPLIED}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status] || DOTS.APPLIED}`} />
      {LABELS[status] || status}
    </span>
  )
}
