import {
  Boxes,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  DoorOpen,
  LayoutDashboard,
  ListChecks,
  Package,
  SlidersHorizontal,
  Users,
} from 'lucide-react'

export const memberLinks = [
  { to: '/rooms', label: 'Meeting rooms', icon: DoorOpen },
  { to: '/resources', label: 'Resources', icon: Boxes },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/bookings', label: 'My bookings', icon: ClipboardList },
]

export const adminSections = [
  {
    title: 'Overview',
    links: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'Book',
    links: memberLinks,
  },
  {
    title: 'Manage',
    links: [
      { to: '/admin/rooms', label: 'Manage rooms', icon: Building2 },
      { to: '/admin/resources', label: 'Manage resources', icon: Package },
      { to: '/admin/employees', label: 'Employees', icon: Users },
      { to: '/admin/bookings', label: 'All bookings', icon: ListChecks },
      { to: '/admin/hours', label: 'Operating hours', icon: Clock },
      {
        to: '/admin/restrictions',
        label: 'Restrictions',
        icon: SlidersHorizontal,
      },
    ],
  },
]
