import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import authService from '../services/authService'
import getErrorMessage from '../utils/errorMessage'
import { validateEmail } from '../utils/validators'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const problem = validateEmail(email)
    setError(problem)
    if (problem) return

    setSubmitting(true)
    try {
      await authService.forgotPassword(email.trim())
      setSent(true)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card">
        {sent ? (
          <>
            <span className="grid size-11 place-items-center rounded-xl bg-green-soft text-green-ink">
              <MailCheck className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink">Request sent</h1>
              <p className="mt-1 text-sm text-muted">
                If that email belongs to an account, your administrator has been
                notified. They will set a new password and share it with you.
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-ink">Forgot password</h1>
              <p className="text-sm text-muted">
                Enter your work email and we will ask your administrator to
                reset it.
              </p>
            </div>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              error={error}
            />
            <Button type="submit" loading={submitting} className="w-full">
              Send request
            </Button>
          </form>
        )}
        <p className="text-center text-sm">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
