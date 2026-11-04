import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import buttonClass from '../../utils/buttonStyles'
import { publicLinks, siteConfig } from '../../config/siteConfig'

const navClass =
  'rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="RoomBook home" className="rounded-lg focus-visible:outline-2 focus-visible:outline-brand">
          <Logo />
        </a>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          {publicLinks.map((link) => (
            <a key={link.href} href={link.href} className={navClass}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <ThemeToggle className="hidden sm:grid" />
          <Link to="/login" className={buttonClass('ghost', 'max-sm:hidden')}>
            Log in
          </Link>
          <Link to="/register" className={buttonClass('primary', 'whitespace-nowrap')}>
            Sign up
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-lg text-ink hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 pb-4 pt-2 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className={`${navClass} block py-3 text-base`}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex items-center gap-2 border-t border-line pt-3">
              <Link to="/login" className={buttonClass('secondary', 'flex-1')}>
                Log in
              </Link>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

const YEAR = new Date().getFullYear()

function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-line bg-sunken">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <p className="text-sm font-semibold text-ink">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {publicLinks.slice(0, 5).map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-muted hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold text-ink">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-muted hover:text-ink">
                {siteConfig.contact.email}
              </a>
            </li>
            <li><Link to="/login" className="text-muted hover:text-ink">Log in</Link></li>
            <li><Link to="/register" className="text-muted hover:text-ink">Sign up</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-faint">
        © {YEAR} {siteConfig.name}
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-surface text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
