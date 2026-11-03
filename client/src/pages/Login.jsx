import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import useAuth from '../hooks/useAuth'
import { homePath } from '../utils/paths'
import getErrorMessage from '../utils/errorMessage'
import { validateLogin } from '../utils/validators'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setServerError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const foundErrors = validateLogin(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length) return

    setSubmitting(true)
    try {
      const signedIn = await login({
        email: values.email.trim(),
        password: values.password,
      })
      navigate(location.state?.from?.pathname || homePath(signedIn), {
        replace: true,
      })
    } catch (error) {
      setServerError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-card"
      >
        <div>
          <h1 className="text-xl font-bold text-ink">Sign in</h1>
          <p className="text-sm text-muted">Use your work email</p>
        </div>

        {serverError && (
          <p
            role="alert"
            className="rounded-lg border border-rose/40 bg-rose-soft p-3 text-sm text-rose-ink"
          >
            {serverError}
          </p>
        )}

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <div>
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange('password')}
            error={errors.password}
          />
          <p className="mt-1.5 text-right text-sm">
            <Link
              to="/forgot-password"
              className="font-semibold text-brand hover:underline"
            >
              Forgot password?
            </Link>
          </p>
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          Sign in
        </Button>

        <p className="text-center text-sm text-muted">
          No account yet?{' '}
          <Link to="/register" className="font-semibold text-brand underline">
            Register
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
