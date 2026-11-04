const ink = 'var(--c-ink)'
const muted = 'var(--c-muted)'
const line = 'var(--c-line-strong)'
const surface = 'var(--c-surface)'
const sunken = 'var(--c-sunken)'

function Door({ x, y, flip = false }) {
  const d = flip
    ? `M${x} ${y} h34 a34 34 0 0 0 -34 -34 z`
    : `M${x} ${y} h-34 a34 34 0 0 1 34 -34 z`
  return <path d={d} fill="var(--c-brand-soft)" stroke="var(--c-brand)" strokeWidth="1.5" />
}

function Svg({ viewBox, label, children }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className="block h-auto w-full">
      {children}
    </svg>
  )
}

export function RoomDisplayArt() {
  return (
    <Svg viewBox="0 0 560 420" label="A tablet outside a meeting room showing that it is available">
      <defs>
        <clipPath id="rd-screen">
          <rect x="40" y="40" width="480" height="340" rx="12" />
        </clipPath>
      </defs>
      <rect x="20" y="20" width="520" height="380" rx="30" fill="#161b2e" />
      <g clipPath="url(#rd-screen)">
        <rect x="40" y="40" width="480" height="340" fill={surface} />
        <rect x="40" y="40" width="480" height="64" fill="var(--c-green)" />
        <text x="64" y="82" fontSize="26" fontWeight="700" fill="#fff">Boardroom</text>
        <text x="280" y="80" fontSize="20" fill="#fff" textAnchor="middle">Available</text>
        <text x="496" y="82" fontSize="24" fontWeight="700" fill="#fff" textAnchor="end">09:41</text>

        <rect x="40" y="104" width="200" height="30" fill={sunken} />
        <text x="56" y="125" fontSize="14" fill={muted}>Today</text>
        <text x="56" y="160" fontSize="14" fontWeight="700" fill={ink}>10:00 to 11:00</text>
        <text x="56" y="180" fontSize="13" fill={muted}>Design review</text>
        <text x="56" y="214" fontSize="14" fontWeight="700" fill={ink}>13:30 to 14:30</text>
        <text x="56" y="234" fontSize="13" fill={muted}>Sprint planning</text>
        <rect x="40" y="262" width="200" height="30" fill={sunken} />
        <text x="56" y="283" fontSize="14" fill={muted}>Upcoming</text>
        <text x="56" y="318" fontSize="14" fontWeight="700" fill={ink}>Tomorrow 15:00</text>
        <text x="56" y="338" fontSize="13" fill={muted}>Client call</text>

        <rect x="240" y="104" width="280" height="276" fill="var(--c-sky-soft)" />
        <rect x="290" y="130" width="180" height="70" rx="6" fill={surface} stroke={line} strokeWidth="3" />
        <rect x="300" y="140" width="160" height="50" rx="3" fill="var(--c-subtle)" />
        <ellipse cx="380" cy="262" rx="100" ry="38" fill="var(--c-brand-soft)" stroke="var(--c-brand)" strokeWidth="2" />
        {[300, 340, 380, 420, 460].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="208" r="11" fill="var(--c-violet-soft)" stroke="var(--c-violet)" strokeWidth="2" />
            <circle cx={cx} cy="316" r="11" fill="var(--c-violet-soft)" stroke="var(--c-violet)" strokeWidth="2" />
          </g>
        ))}
        <rect x="318" y="346" width="124" height="26" rx="13" fill="var(--c-green)" />
        <text x="380" y="364" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">Book now</text>
      </g>
    </Svg>
  )
}

export function FloorPlanArt() {
  return (
    <Svg viewBox="0 0 560 400" label="A floor plan with rooms coloured by whether they are free or booked">
      <rect x="10" y="10" width="540" height="340" rx="16" fill={surface} stroke={line} strokeWidth="2" />
      <rect x="26" y="26" width="508" height="308" fill="none" stroke={ink} strokeWidth="6" />

      <rect x="42" y="42" width="190" height="150" rx="8" fill="var(--c-rose-soft)" stroke="var(--c-rose)" strokeWidth="2" />
      <text x="137" y="112" fontSize="17" fontWeight="700" fill={ink} textAnchor="middle">Boardroom</text>
      <text x="137" y="134" fontSize="13" fill="var(--c-rose-ink)" textAnchor="middle">Booked until 11:30</text>
      <Door x={78} y={192} />

      <rect x="248" y="42" width="150" height="150" rx="8" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <text x="323" y="112" fontSize="17" fontWeight="700" fill={ink} textAnchor="middle">Atlas</text>
      <text x="323" y="134" fontSize="13" fill="var(--c-green-ink)" textAnchor="middle">Free</text>
      <Door x={290} y={192} />

      <rect x="414" y="42" width="104" height="90" rx="8" fill="var(--c-brand-soft)" stroke="var(--c-brand)" strokeWidth="2" />
      <text x="466" y="84" fontSize="15" fontWeight="700" fill={ink} textAnchor="middle">Huddle</text>
      <text x="466" y="104" fontSize="12" fill="var(--c-brand-ink)" textAnchor="middle">Booked by you</text>

      <rect x="414" y="144" width="104" height="48" rx="8" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <text x="466" y="174" fontSize="14" fontWeight="700" fill={ink} textAnchor="middle">Phone booth</text>

      {[48, 112, 176].map((x) => (
        <rect key={x} x={x} y="236" width="52" height="40" rx="6" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      ))}
      <text x="42" y="304" fontSize="13" fill={muted}>Projector, whiteboard, speakerphone</text>

      <circle cx="330" cy="262" r="22" fill="var(--c-teal-soft)" stroke="var(--c-teal)" strokeWidth="2" />
      <circle cx="388" cy="262" r="14" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <rect x="440" y="236" width="76" height="76" rx="8" fill={sunken} stroke={line} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="448" x2="508" y1={248 + i * 14} y2={248 + i * 14} stroke={muted} strokeWidth="2" />
      ))}

      <g>
        <rect x="252" y="130" width="146" height="82" rx="12" fill={surface} stroke={line} strokeWidth="2" />
        <text x="268" y="154" fontSize="15" fontWeight="700" fill={ink}>Atlas</text>
        <text x="268" y="172" fontSize="12" fill={muted}>Free, up to 6 people</text>
        <rect x="268" y="182" width="76" height="22" rx="11" fill="var(--c-brand)" />
        <text x="306" y="197" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">Book now</text>
        <path d="M360 92 l0 -2 l22 22 l-9 1 l6 11 l-5 2 l-6 -11 l-8 6 z" fill={ink} stroke={surface} strokeWidth="1.5" strokeLinejoin="round" />
      </g>

      <g fontSize="13" fill={muted}>
        {[
          ['var(--c-green)', 'Free', 150],
          ['var(--c-rose)', 'Booked', 230],
          ['var(--c-brand)', 'Yours', 330],
        ].map(([color, text, x]) => (
          <g key={text}>
            <circle cx={x} cy="376" r="6" fill={color} />
            <text x={x + 14} y="381">{text}</text>
          </g>
        ))}
      </g>
    </Svg>
  )
}

export function CalendarArt() {
  const days = Array.from({ length: 35 }, (_, i) => i)
  return (
    <Svg viewBox="0 0 560 400" label="A calendar and a booking being added to Google, Outlook or Apple Calendar">
      <rect x="20" y="30" width="300" height="330" rx="16" fill={surface} stroke={line} strokeWidth="2" />
      <path d="M20 46 a16 16 0 0 1 16 -16 h268 a16 16 0 0 1 16 16 v34 h-300 z" fill="var(--c-brand)" />
      <text x="44" y="63" fontSize="18" fontWeight="700" fill="#fff">November</text>
      <g fontSize="12" fill={muted} textAnchor="middle">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <text key={i} x={50 + i * 37} y="102">{d}</text>
        ))}
      </g>
      {days.map((i) => {
        const cx = 50 + (i % 7) * 37
        const cy = 130 + Math.floor(i / 7) * 46
        const hot = [10, 11, 17, 24].includes(i)
        const mine = i === 18
        return (
          <g key={i}>
            {mine && <circle cx={cx} cy={cy} r="16" fill="var(--c-brand)" />}
            {hot && <rect x={cx - 13} y={cy + 12} width="26" height="5" rx="2.5" fill="var(--c-teal)" />}
            <text x={cx} y={cy + 5} fontSize="14" textAnchor="middle" fill={mine ? '#fff' : ink}>
              {(i % 31) + 1}
            </text>
          </g>
        )
      })}

      <rect x="340" y="110" width="200" height="190" rx="16" fill={surface} stroke={line} strokeWidth="2" />
      <rect x="340" y="110" width="8" height="190" rx="4" fill="var(--c-teal)" />
      <text x="362" y="142" fontSize="18" fontWeight="700" fill={ink}>Atlas</text>
      <text x="362" y="166" fontSize="13" fill={muted}>Today, 10:00 to 11:00</text>
      <text x="362" y="186" fontSize="13" fill={muted}>Includes whiteboard</text>
      <rect x="360" y="204" width="164" height="34" rx="10" fill="var(--c-brand)" />
      <text x="442" y="226" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">Add to calendar</text>
      {[
        ['Google', 'var(--c-sky)', 352],
        ['Outlook', 'var(--c-brand)', 410],
        ['Apple', 'var(--c-ink)', 472],
      ].map(([text, color, x]) => (
        <g key={text}>
          <circle cx={x + 6} cy="268" r="6" fill={color} />
          <text x={x + 18} y="273" fontSize="12" fill={muted}>{text}</text>
        </g>
      ))}
    </Svg>
  )
}

export function PhoneArt() {
  return (
    <Svg viewBox="0 0 360 440" label="The floor plan open on a phone">
      <rect x="90" y="10" width="180" height="420" rx="32" fill="#161b2e" />
      <rect x="100" y="22" width="160" height="396" rx="24" fill={surface} />
      <text x="116" y="56" fontSize="15" fontWeight="700" fill={ink}>Floor plan</text>
      <rect x="112" y="68" width="136" height="150" rx="8" fill="var(--c-subtle)" stroke={line} />
      <rect x="120" y="76" width="58" height="54" rx="4" fill="var(--c-rose-soft)" stroke="var(--c-rose)" />
      <rect x="184" y="76" width="56" height="54" rx="4" fill="var(--c-green-soft)" stroke="var(--c-green)" />
      <rect x="120" y="138" width="36" height="34" rx="4" fill="var(--c-brand-soft)" stroke="var(--c-brand)" />
      <rect x="162" y="138" width="78" height="34" rx="4" fill="var(--c-green-soft)" stroke="var(--c-green)" />
      <rect x="120" y="180" width="120" height="30" rx="4" fill={sunken} stroke={line} />
      <rect x="110" y="232" width="140" height="118" rx="12" fill={surface} stroke={line} strokeWidth="2" />
      <text x="122" y="256" fontSize="14" fontWeight="700" fill={ink}>Atlas</text>
      <text x="122" y="274" fontSize="11" fill={muted}>Up to 6 people</text>
      <rect x="122" y="284" width="46" height="20" rx="10" fill="var(--c-green-soft)" />
      <text x="145" y="298" fontSize="11" fontWeight="700" fill="var(--c-green-ink)" textAnchor="middle">Free</text>
      <rect x="122" y="314" width="116" height="26" rx="8" fill="var(--c-brand)" />
      <text x="180" y="332" fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle">Book now</text>
      {[130, 160, 200, 230].map((cx, i) => (
        <circle key={cx} cx={cx} cy="388" r="8" fill={i === 2 ? 'var(--c-brand)' : sunken} />
      ))}
    </Svg>
  )
}

export function BookingArt() {
  const slots = [
    'taken', 'taken', 'free', 'free', 'pick', 'pick', 'free', 'taken', 'taken', 'free', 'free', 'free',
  ]
  const fills = {
    taken: ['var(--c-rose-soft)', 'var(--c-rose)'],
    free: ['var(--c-green-soft)', 'var(--c-green)'],
    pick: ['var(--c-brand)', 'var(--c-brand)'],
  }
  return (
    <Svg viewBox="0 0 560 400" label="A booking form with free and taken time slots">
      <rect x="30" y="20" width="500" height="360" rx="18" fill={surface} stroke={line} strokeWidth="2" />
      <text x="56" y="62" fontSize="22" fontWeight="700" fill={ink}>Book Boardroom</text>
      <text x="56" y="86" fontSize="14" fill={muted}>Wednesday, 4 November</text>

      <text x="56" y="124" fontSize="14" fontWeight="700" fill={ink}>Pick a time</text>
      {slots.map((state, i) => {
        const col = i % 6
        const row = Math.floor(i / 6)
        const [fill, stroke] = fills[state]
        return (
          <g key={i}>
            <rect x={56 + col * 76} y={138 + row * 46} width="66" height="36" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <text x={89 + col * 76} y={161 + row * 46} fontSize="13" fontWeight="600" textAnchor="middle" fill={state === 'pick' ? '#fff' : ink}>
              {`${9 + Math.floor(i / 2)}:${i % 2 ? '30' : '00'}`}
            </text>
          </g>
        )
      })}

      <text x="56" y="256" fontSize="14" fontWeight="700" fill={ink}>Comes with the room</text>
      {[
        ['Projector', 56],
        ['Whiteboard', 148],
      ].map(([text, x]) => (
        <g key={text}>
          <rect x={x} y="268" width={text === 'Projector' ? 84 : 98} height="28" rx="14" fill="var(--c-teal-soft)" />
          <text x={x + (text === 'Projector' ? 42 : 49)} y="287" fontSize="13" fontWeight="600" fill="var(--c-teal-ink)" textAnchor="middle">{text}</text>
        </g>
      ))}

      <text x="56" y="326" fontSize="13" fill={muted}>Add: speakerphone</text>
      <rect x="360" y="312" width="144" height="40" rx="10" fill="var(--c-brand)" />
      <text x="432" y="337" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">Confirm booking</text>
    </Svg>
  )
}

export function EditorArt() {
  const handle = (x, y) => (
    <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width="10" height="10" rx="2" fill={surface} stroke="var(--c-brand)" strokeWidth="2" />
  )
  return (
    <Svg viewBox="0 0 560 400" label="The floor plan editor with a palette of shapes and a selected room">
      <rect x="20" y="20" width="520" height="360" rx="18" fill={surface} stroke={line} strokeWidth="2" />
      <rect x="20" y="20" width="520" height="44" rx="18" fill="var(--c-subtle)" />
      <rect x="20" y="46" width="520" height="18" fill="var(--c-subtle)" />
      <rect x="40" y="32" width="110" height="26" rx="8" fill="var(--c-brand)" />
      <text x="95" y="50" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">Ground floor</text>
      <text x="184" y="50" fontSize="13" fill={muted}>First floor</text>

      <text x="40" y="92" fontSize="13" fontWeight="700" fill={ink}>Add to plan</text>
      {[
        ['Room', 40, 104],
        ['Resource', 100, 104],
        ['Wall', 40, 150],
        ['Door', 100, 150],
        ['Window', 40, 196],
        ['Label', 100, 196],
      ].map(([text, x, y]) => (
        <g key={text}>
          <rect x={x} y={y} width="52" height="38" rx="8" fill={sunken} stroke={line} />
          <text x={x + 26} y={y + 24} fontSize="11" fill={ink} textAnchor="middle">{text}</text>
        </g>
      ))}
      <rect x="40" y="250" width="112" height="30" rx="8" fill={surface} stroke={line} />
      <text x="96" y="270" fontSize="12" fill={muted} textAnchor="middle">Snap to grid</text>
      <rect x="40" y="290" width="112" height="30" rx="8" fill="var(--c-brand-soft)" />
      <text x="96" y="310" fontSize="12" fontWeight="700" fill="var(--c-brand-ink)" textAnchor="middle">Save plan</text>

      <rect x="176" y="80" width="344" height="280" rx="10" fill="var(--c-subtle)" stroke={line} />
      <rect x="196" y="100" width="150" height="110" rx="6" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <text x="271" y="160" fontSize="14" fontWeight="700" fill={ink} textAnchor="middle">Boardroom</text>
      <rect x="196" y="100" width="150" height="110" rx="6" fill="none" stroke="var(--c-brand)" strokeWidth="2" strokeDasharray="5 4" />
      {[handle(196, 100), handle(346, 100), handle(196, 210), handle(346, 210)]}
      <rect x="366" y="100" width="130" height="70" rx="6" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <text x="431" y="140" fontSize="14" fontWeight="700" fill={ink} textAnchor="middle">Atlas</text>
      <line x1="196" y1="240" x2="496" y2="240" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      <rect x="196" y="262" width="60" height="44" rx="6" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <rect x="270" y="262" width="60" height="44" rx="6" fill="var(--c-green-soft)" stroke="var(--c-green)" strokeWidth="2" />
      <circle cx="440" cy="284" r="20" fill="var(--c-teal-soft)" stroke="var(--c-teal)" strokeWidth="2" />
      <path d="M452 300 l0 -2 l22 22 l-9 1 l6 11 l-5 2 l-6 -11 l-8 6 z" fill={ink} stroke={surface} strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  )
}
