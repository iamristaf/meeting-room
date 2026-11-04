import { Link } from 'react-router-dom'
import { Clock, SlidersHorizontal, Users } from 'lucide-react'
import { Container, CtaBanner, FeatureGrid, SplitSection } from '../../components/public/Section'
import { FaqSection, HowItWorksSection } from '../../components/public/Sections'
import {
  BookingArt,
  CalendarArt,
  EditorArt,
  FloorPlanArt,
  RoomDisplayArt,
} from '../../components/public/Illustrations'
import buttonClass from '../../utils/buttonStyles'
import usePageTitle from '../../hooks/usePageTitle'
import { keyFeatures, moreFeatures } from './featureList'

const adminControls = [
  { icon: Clock, title: 'Operating hours', text: 'Choose when each room and resource can be booked, day by day.' },
  { icon: SlidersHorizontal, title: 'Booking rules', text: 'Limit how long a booking can be and how far ahead people can book.' },
  { icon: Users, title: 'People and roles', text: 'Invite people, promote admins and reset a forgotten password.' },
]

export default function Home() {
  usePageTitle('RoomBook: meeting room and resource booking')

  return (
    <>
      <section>
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-20">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl">
              Meeting room and resource booking for your office
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted">
              Employees see what is free and book in a few clicks. Admins stay in control of hours,
              rules and the floor plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className={buttonClass('primary', 'px-6 py-3 text-base')}>
                Sign up free
              </Link>
              <a href="#features" className={buttonClass('secondary', 'px-6 py-3 text-base')}>
                See features
              </a>
            </div>
          </div>
          <RoomDisplayArt />
        </Container>
      </section>

      <SplitSection
        id="about"
        title="Bookings made easy"
        art={<BookingArt />}
        points={[
          'Pick a date and see only the times that are actually free.',
          'Equipment built into a room is booked with it as one booking.',
          'Works in the browser on a desktop, tablet or phone.',
        ]}
      >
        RoomBook helps teams share meeting rooms and equipment without messages back and forth. You see
        what is free, who has what, and book it in a few clicks.
      </SplitSection>

      <FeatureGrid id="features" title="Key features" items={[...keyFeatures, ...moreFeatures]} />

      <SplitSection
        flip
        title="Book from a 2D floor plan"
        art={<FloorPlanArt />}
        points={[
          'Colours show free, booked, yours and closed for the time you pick.',
          'Hover a room to see who has it and when it frees up.',
          'Switch floors, zoom and pan. Pinch works on touch screens.',
        ]}
      >
        Choose a date, a start time and a length, and the map recolours itself. Click a room to open the
        booking form with those details filled in.
      </SplitSection>

      <SplitSection
        title="Draw the office once"
        art={<EditorArt />}
        points={[
          'Rooms, resources, walls, doors, windows and labels.',
          'Set the size of each floor and add more floors.',
          'Move, resize, rotate, undo and redo.',
        ]}
      >
        Admins build the floor plan with drag and drop, in the shape of the real office. Each room or
        resource is placed once, so the map never shows the same thing twice.
      </SplitSection>

      <SplitSection
        id="integrations"
        flip
        title="Works with the calendar you already use"
        art={<CalendarArt />}
        points={[
          'Add any booking to Google Calendar, Outlook or Apple Calendar, or download an .ics file.',
          'Subscribe once with a private link and new bookings appear on their own.',
          'Reset the link from Settings if you ever share it by mistake.',
        ]}
      >
        Bookings do not stay locked inside one more app. They show up next to everything else on your
        schedule. Changes made inside those calendars do not flow back.
      </SplitSection>

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Admins stay in control
          </h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {adminControls.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                <Icon className="size-8 text-brand" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <HowItWorksSection />
      <FaqSection />
      <CtaBanner />
    </>
  )
}
