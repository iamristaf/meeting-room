import { NavLink } from 'react-router-dom'
import { LogOut, Settings, UserRound } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Dropdown from '../ui/Dropdown'
import StatusBadge from '../ui/StatusBadge'
import useAuth from '../../hooks/useAuth'
import cn from '../../utils/cn'

const itemClass = ({ isActive }) =>
  cn(
    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-brand-soft text-brand-ink' : 'text-ink-soft hover:bg-sunken',
  )

export default function AccountMenu() {
  const { user, logout } = useAuth()

  return (
    <Dropdown
      label="Account menu"
      align="right"
      hideChevronOnMobile
      buttonClassName="!px-1.5 sm:!px-2.5"
      buttonContent={
        <>
          <Avatar name={user.name} className="size-8 text-xs" />
          <span className="hidden max-w-32 truncate sm:inline">
            {user.name}
          </span>
        </>
      }
    >
      <div className="flex items-center gap-3 border-b border-line px-3 py-2.5">
        <Avatar name={user.name} className="size-10 text-sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <div className="mt-1">
            <StatusBadge status={user.role} />
          </div>
        </div>
      </div>
      <div className="pt-1.5">
        <NavLink to="/profile" className={itemClass} role="menuitem">
          <UserRound className="size-4" />
          My profile
        </NavLink>
        <NavLink to="/settings" className={itemClass} role="menuitem">
          <Settings className="size-4" />
          Settings
        </NavLink>
        <button
          type="button"
          data-close
          onClick={logout}
          role="menuitem"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-ink transition-colors hover:bg-rose-soft"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </Dropdown>
  )
}
