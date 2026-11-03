import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import useAuth from '../hooks/useAuth'
import useToast from '../hooks/useToast'
import getErrorMessage from '../utils/errorMessage'
import { validateRegister } from '../utils/validators'

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
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
    const foundErrors = validateRegister(values)
    setErrors(foundErrors)
    if (Object.keys(foundErrors).length) return

    setSubmitting(true)
    try {
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      toast.success('Account created')
      navigate('/rooms', { replace: true })
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
          <h1 className="text-xl font-bold text-ink">Create account</h1>
          <p className="text-sm text-muted">Register with your work email</p>
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
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Register
        </Button>

        <p className="text-center text-sm text-muted">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-brand underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
