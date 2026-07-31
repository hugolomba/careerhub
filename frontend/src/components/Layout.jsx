import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { PipelineIcon, CalendarIcon, DocumentIcon, ChartIcon, MenuIcon, CloseIcon } from './icons'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartIcon },
  { to: '/applications', label: 'Applications', icon: PipelineIcon },
  { to: '/interviews', label: 'Interviews', icon: CalendarIcon },
  { to: '/cvs', label: 'My CVs', icon: DocumentIcon },
]

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard">
              <Logo markClassName="h-8 w-8" textClassName="text-base" />
            </NavLink>
            <nav className="hidden gap-1 sm:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-amber-400">
                {initials(user?.fullName)}
              </span>
              <span className="text-sm text-slate-600">{user?.fullName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:block"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 sm:hidden"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden">
            <div className="mb-3 flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-900 text-xs font-semibold text-amber-400">
                {initials(user?.fullName)}
              </span>
              <span className="text-sm font-medium text-slate-700">{user?.fullName}</span>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
