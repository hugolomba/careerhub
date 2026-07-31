import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import BrandPanel from '../components/BrandPanel'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(fullName, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <BrandPanel
        heading="Your next offer starts here."
        subheading="Join CareerHub and turn a messy job search into a pipeline you can actually see through."
      />

      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <Link to="/" className="mb-3 lg:hidden">
              <Logo markClassName="h-11 w-11" textClassName="text-xl" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
                <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-md bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 lg:text-left">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
