import { CalendarCheck, Clock, Boxes } from 'lucide-react'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

const highlights = [
  { icon: CalendarCheck, text: 'Pick from slots that are actually free' },
  { icon: Boxes, text: 'Add projectors and whiteboards to any room' },
  { icon: Clock, text: 'See who has the room and when' },
]

export default function AuthShell({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#2a34a8] via-[#5b35c9] to-[#0e9a8e] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-white/10" />
        <span className="relative inline-flex items-center gap-2.5 text-2xl font-bold">
          <Logo
            className="!text-white"
            textClassName="text-2xl [&>span]:!text-white"
          />
        </span>
        <div className="relative">
          <div className="mb-8 overflow-hidden rounded-3xl shadow-2xl ring-4 ring-white/25">
            <img
              src="/images/rooms/room-8.png"
              alt="A meeting room ready for a team"
              className="block h-64 w-full object-cover"
            />
          </div>
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Meetings start on time when the room is already yours.
          </h2>
          <ul className="mt-6 space-y-3 text-sm text-white/90">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-white/15">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/70">
          RoomBook for your office
        </p>
      </aside>

      <div className="relative flex items-center justify-center px-4 py-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm animate-rise">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo markClassName="size-10" textClassName="text-2xl" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
