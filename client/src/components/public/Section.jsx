import { Link } from 'react-router-dom'
import cn from '../../utils/cn'
import buttonClass from '../../utils/buttonStyles'

export function Container({ className, children }) {
  return <div className={cn('mx-auto max-w-6xl px-4 sm:px-6', className)}>{children}</div>
}

export function PageIntro({ title, children }) {
  return (
    <div className="bg-sunken">
      <Container className="py-14 text-center sm:py-20">
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
        {children && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{children}</p>}
      </Container>
    </div>
  )
}

export function SplitSection({ id, title, children, points = [], art, flip = false }) {
  return (
    <section id={id} className="relative scroll-mt-20 overflow-hidden">
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-y-0 hidden w-1/2 bg-sunken lg:block',
          flip
            ? 'left-0 [clip-path:polygon(0_0,100%_0,94%_100%,0_100%)]'
            : 'right-0 [clip-path:polygon(6%_0,100%_0,100%_100%,0_100%)]',
        )}
      />
      <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className={cn(flip && 'lg:order-2')}>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-muted">{children}</p>
          {points.length > 0 && (
            <ul className="mt-5 max-w-lg space-y-2.5 text-sm text-ink-soft">
              {points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={cn('rounded-2xl bg-sunken p-5 sm:p-8 lg:bg-transparent lg:p-0', flip && 'lg:order-1')}>
          <div className="mx-auto w-full max-w-lg">{art}</div>
        </div>
      </Container>
    </section>
  )
}

export function FeatureGrid({ id, title, items }) {
  return (
    <section id={id} className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        {title && (
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h2>
        )}
        <ul className={cn('grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3', title && 'mt-12')}>
          {items.map(({ icon: Icon, title: name, text }) => (
            <li key={name} className="flex gap-4">
              <Icon className="mt-0.5 size-9 shrink-0 text-brand" strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold text-ink">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function CtaBanner({ title = 'A simpler way to share your office space' }) {
  return (
    <section className="px-4 pb-16 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b2a7a] via-[#2a3bb8] to-[#3f4fe0] px-7 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <h2 className="max-w-lg text-2xl font-semibold leading-snug text-white sm:text-3xl">{title}</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/register" className={buttonClass('secondary', '!border-white !bg-white px-6 py-2.5 text-base !text-[#1b2a7a] hover:!bg-white/90')}>
            Sign up free
          </Link>
          <Link to="/login" className={buttonClass('ghost', 'px-5 py-2.5 text-base !text-white hover:!bg-white/15')}>
            Log in
          </Link>
        </div>
      </div>
    </section>
  )
}
