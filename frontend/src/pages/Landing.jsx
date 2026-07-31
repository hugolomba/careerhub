import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import {
  PipelineIcon, CalendarIcon, DocumentIcon, ChartIcon, BellIcon, ShieldIcon,
  ArrowRightIcon, CheckCircleIcon, SparkleIcon, MenuIcon, CloseIcon,
} from '../components/icons'

const FEATURES = [
  {
    icon: PipelineIcon,
    title: 'Application pipeline',
    description: 'See every application by stage — applied, interviewing, offer, or rejected — without a single spreadsheet.',
  },
  {
    icon: CalendarIcon,
    title: 'Interview scheduling',
    description: 'Log phone, video and on-site rounds against each application and never lose track of what’s next.',
  },
  {
    icon: DocumentIcon,
    title: 'CV version manager',
    description: 'Keep every tailored resume in one library and link the exact version you sent for each role.',
  },
  {
    icon: ChartIcon,
    title: 'Real progress analytics',
    description: 'Response rate, interview conversion and offer rate, calculated automatically as you go.',
  },
  {
    icon: BellIcon,
    title: 'Never miss a beat',
    description: 'Past and upcoming interviews are grouped for you, so nothing slips through the cracks.',
  },
  {
    icon: ShieldIcon,
    title: 'Private by default',
    description: 'Your applications, notes and documents are yours alone — scoped to your account, always.',
  },
]

const STEPS = [
  { title: 'Add your applications', description: 'Log the company, role and date the moment you hit submit.' },
  { title: 'Track every step', description: 'Update status as you move through screens, interviews and offers.' },
  { title: 'Spot what’s working', description: 'Your dashboard shows response and conversion rates in real time.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <CtaBanner />
      <Footer />
    </div>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo markClassName="h-8 w-8 sm:h-9 sm:w-9" textClassName="text-base sm:text-lg" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">How it works</a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700"
          >
            Get started free
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6 md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              How it works
            </a>
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            <Link
              to="/login"
              className="rounded-md border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-soft hover:bg-primary-700"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative bg-grid">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-primary-300/30 mix-blend-multiply blur-3xl" />
        <div className="absolute -right-16 top-10 h-72 w-72 animate-blob animation-delay-2000 rounded-full bg-amber-200/50 mix-blend-multiply blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob animation-delay-4000 rounded-full bg-primary-200/30 mix-blend-multiply blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            <SparkleIcon className="h-3.5 w-3.5" />
            Built for job seekers who apply on purpose
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Run your job search like a <span className="text-amber-500">real pipeline</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            CareerHub keeps every application, interview and CV version in one place — so you spend your energy
            preparing for offers, not digging through spreadsheets and email threads.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-md bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-700"
            >
              Get started free
              <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-soft transition hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            No credit card required &middot; Set up in under a minute
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:150ms]">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-glow">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 text-xs font-medium text-slate-400">careerhub.app/dashboard</span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800">Welcome back, Alex</div>
            <div className="rounded-md bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">+ Add application</div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { label: 'Applications', value: '24' },
              { label: 'Response', value: '58%' },
              { label: 'Interviews', value: '35%' },
              { label: 'Offers', value: '12%' },
            ].map((s) => (
              <div key={s.label} className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50/60 p-2 sm:p-2.5">
                <div className="truncate text-[9px] font-medium uppercase tracking-wide text-slate-400 sm:text-[10px]">{s.label}</div>
                <div className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-slate-100 p-3">
            <div className="mb-2 text-xs font-semibold text-slate-500">Applications by status</div>
            <div className="flex h-24 items-end gap-3">
              {[38, 62, 45, 80, 30].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-primary-800 to-amber-400" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { name: 'Notion', role: 'Product Designer', status: 'Interviewing', color: 'bg-amber-100 text-amber-800' },
              { name: 'Linear', role: 'Frontend Engineer', status: 'Offer', color: 'bg-emerald-100 text-emerald-800' },
            ].map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-xs">
                <div>
                  <div className="font-semibold text-slate-700">{row.name}</div>
                  <div className="text-slate-400">{row.role}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 font-medium ${row.color}`}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-6 -top-12 z-10 hidden animate-float items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-glow sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-600">
          <CalendarIcon className="h-4 w-4" />
        </span>
        <div className="text-xs">
          <div className="font-semibold text-slate-700">Interview scheduled</div>
          <div className="text-slate-400">Tomorrow, 10:00 AM</div>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-4 z-10 hidden animate-float items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-glow [animation-delay:1.2s] sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleIcon className="h-4 w-4" />
        </span>
        <div className="text-xs">
          <div className="font-semibold text-slate-700">Offer received 🎉</div>
          <div className="text-slate-400">Linear &middot; Frontend Engineer</div>
        </div>
      </div>
    </div>
  )
}

function LogosStrip() {
  const items = [
    { label: 'Applications tracked automatically', icon: PipelineIcon },
    { label: 'Interview reminders, grouped by date', icon: CalendarIcon },
    { label: 'One library for every CV version', icon: DocumentIcon },
    { label: 'Your data, scoped to your account', icon: ShieldIcon },
  ]
  return (
    <div className="border-y border-slate-100 bg-slate-50/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm text-slate-600">
            <item.icon className="h-5 w-5 shrink-0 text-primary-500" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Everything your job search actually needs
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          No boards to configure, no columns to set up. CareerHub is opinionated about the job-search workflow so you don’t have to be.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-900 text-amber-400">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Up and running in three steps</h2>
          <p className="mt-4 text-lg text-slate-600">No onboarding calls, no imports to configure. Start tracking your very next application today.</p>
        </div>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent sm:block" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center sm:text-left">
              <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-900 text-lg font-bold text-amber-400 shadow-glow sm:mx-0">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-slate-950 px-6 py-14 text-center shadow-glow sm:px-16">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to organize your job search?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-100">
          Create your free CareerHub account and add your first application in under a minute.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-soft transition hover:bg-primary-50"
          >
            Get started free
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Logo markClassName="h-7 w-7" textClassName="text-base" />
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} CareerHub. All rights reserved.</p>
        <div className="flex items-center gap-5 text-sm text-slate-500">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
          <Link to="/login" className="hover:text-slate-900">Log in</Link>
        </div>
      </div>
    </footer>
  )
}
