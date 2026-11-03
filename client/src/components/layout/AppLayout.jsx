import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import Navbar from './Navbar'
import PageLoader from '../ui/PageLoader'
import useAuth from '../../hooks/useAuth'

export default function AppLayout() {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const content = (
    <Suspense fallback={<PageLoader />}>
      <div key={location.pathname} className="animate-rise">
        <Outlet />
      </div>
    </Suspense>
  )

  if (isAdmin) {
    return <AdminLayout>{content}</AdminLayout>
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:py-8 lg:pb-8">
        {content}
      </main>
    </div>
  )
}
