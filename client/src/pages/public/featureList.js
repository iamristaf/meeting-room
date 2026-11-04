import {
  CalendarCheck,
  CalendarDays,
  CalendarSync,
  Clock,
  DoorOpen,
  Layers,
  Map,
  Moon,
  PencilRuler,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Users,
  Boxes,
  Download,
} from 'lucide-react'

export const keyFeatures = [
  { icon: DoorOpen, title: 'Rooms and resources', text: 'Meeting rooms with a capacity, plus things like projectors and speakerphones, all in one catalog.' },
  { icon: Boxes, title: 'Built-in equipment', text: 'Equipment that belongs to a room is booked with it as a single booking. Other items can be added on top.' },
  { icon: CalendarCheck, title: 'Free slots only', text: 'The booking page shows the day as a timeline, so you only pick times that are actually open.' },
  { icon: Map, title: '2D floor plan', text: 'See the office as a map. Rooms are coloured free, booked or yours for the time you choose.' },
  { icon: PencilRuler, title: 'Floor plan editor', text: 'Admins drag in rooms, walls, doors, windows and labels to match the real office.' },
  { icon: Layers, title: 'Multiple floors', text: 'Add as many floors as you have and switch between them with a tap.' },
  { icon: CalendarDays, title: 'Calendar views', text: 'Day, week and month views. A room and its equipment show as one entry.' },
  { icon: CalendarSync, title: 'Calendar sync', text: 'Add a booking to Google, Outlook or Apple Calendar, or subscribe once with a private link.' },
  { icon: Clock, title: 'Operating hours', text: 'Each room and resource has its own open hours, and the map and booking page follow them.' },
  { icon: SlidersHorizontal, title: 'Booking rules', text: 'Set minimum and maximum length, how far ahead people can book, and the size of a time slot.' },
  { icon: Users, title: 'People and roles', text: 'Admins manage employees, change roles, deactivate accounts and reset passwords.' },
  { icon: ShieldCheck, title: 'No double bookings', text: 'Overlapping bookings are rejected by the database, even if two people click at once.' },
]

export const moreFeatures = [
  { icon: Download, title: 'All bookings and CSV export', text: 'Admins see every booking in one place and can export it to a spreadsheet.' },
  { icon: Smartphone, title: 'Phones and tablets', text: 'The layout adapts to small screens, with navigation within thumb reach.' },
  { icon: Moon, title: 'Dark and light themes', text: 'Switch themes any time. The choice is remembered on your device.' },
]
