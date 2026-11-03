import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import PageLoader from '../ui/PageLoader'
import { homePath } from '../../utils/paths'

export default function GuestRoute() {
  const { user, checking } = useAuth()

  if (checking) {
    return <PageLoader />
  }

  if (user) {
    return <Navigate to={homePath(user)} replace />
  }

  return <Outlet />
}
