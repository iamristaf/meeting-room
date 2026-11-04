import { ChevronDown } from 'lucide-react'
import { Container } from './Section'

const tracks = [
  {
    title: 'For admins',
    intro: 'Set up once. Most of this takes minutes.',
    steps: [
      ['Add rooms and resources', 'Name them, give rooms a capacity, and attach built-in equipment to a room.'],
      ['Set hours and rules', 'Choose when each can be booked and how long a booking can be.'],
      ['Draw the floor plan', 'Place rooms and resources on a map of your office. This step is optional.'],
      ['Share the link', 'People sign up themselves as employees. Promote anyone who should manage the office.'],
    ],
  },
  {
    title: 'For employees',
    intro: 'Booking takes under a minute.',
    steps: [
      ['Find a room', 'Open the floor plan or the rooms list, and pick a date and time.'],
      ['Book it', 'Choose a free slot, add any extra equipment, and confirm.'],
      ['See it in your calendar', 'It shows up in RoomBook, and you can add it to Google, Outlook or Apple Calendar.'],
      ['Change plans', 'Edit or cancel from My bookings. The room becomes free for others.'],
    ],
  },
]

const faqs = [
  ['Who is RoomBook for?', 'Teams that share meeting rooms and equipment in an office and want to stop double bookings.'],
  ['What is the difference between a room and a resource?', 'A room is a space with a capacity. A resource is a thing, such as a projector or a speakerphone. Resources can be built into a room or booked on their own.'],
  ['What happens when I book a room with built-in equipment?', 'The room and its equipment are booked together as one booking, and your calendar shows a single entry.'],
  ['Can two people book the same room at the same time?', 'No. Overlapping bookings are rejected by the database, so it holds even if two people click at the same moment.'],
  ['Do I need to draw a floor plan?', 'No. The floor plan is optional. Without one, people book from the rooms and resources lists.'],
  ['Can I see my bookings in Google, Outlook or Apple Calendar?', 'Yes. Add a single booking with a link or an .ics file, or subscribe to your private calendar link so new bookings appear automatically. Sync goes one way, from RoomBook to your calendar.'],
  ['How do I get an account?', 'Sign up with your name, email and a password. New accounts are employees. An admin can change someone’s role.'],
  ['I forgot my password. What now?', 'Use “Forgot password” on the login page to send a request. An admin then sets a new password for you.'],
  ['Can I limit when rooms can be booked?', 'Yes. Admins set operating hours per room or resource, plus minimum and maximum booking length and how far ahead people can book.'],
  ['Does it work on a phone?', 'Yes. The layout adapts to phones and tablets, and the floor plan supports pinch to zoom.'],
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-sunken py-16 sm:py-20">
      <Container>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">How it works</h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {tracks.map((track) => (
            <div key={track.title}>
              <h3 className="text-xl font-semibold text-ink">{track.title}</h3>
              <p className="mt-1 text-muted">{track.intro}</p>
              <ol className="mt-7 space-y-6 border-l-2 border-line-strong pl-8">
                {track.steps.map(([title, text], index) => (
                  <li key={title} className="relative">
                    <span className="absolute -left-[3.05rem] grid size-8 place-items-center rounded-full border-2 border-brand bg-sunken text-sm font-bold text-brand-ink">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-ink">{title}</h4>
                    <p className="mt-1 text-sm text-muted">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-center text-muted">Short answers about booking, accounts and calendars.</p>
        <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded font-semibold text-ink focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted">{answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
