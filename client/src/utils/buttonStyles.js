import cn from './cn'

const variants = {
  primary:
    'bg-brand text-white shadow-sm hover:bg-brand-strong focus-visible:outline-brand dark:text-[#0b0e1c]',
  secondary:
    'border border-line-strong bg-surface text-ink-soft hover:bg-sunken focus-visible:outline-brand',
  soft: 'bg-brand-soft text-brand-ink hover:brightness-95 focus-visible:outline-brand',
  success:
    'bg-green text-white hover:brightness-95 focus-visible:outline-green dark:text-[#0b0e1c]',
  danger:
    'bg-rose text-white hover:brightness-95 focus-visible:outline-rose dark:text-[#0b0e1c]',
  ghost: 'text-ink-soft hover:bg-sunken focus-visible:outline-brand',
  ghostDanger: 'text-rose-ink hover:bg-rose-soft focus-visible:outline-rose',
}

export default function buttonClass(variant = 'primary', extra) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold active:scale-[0.97] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55',
    variants[variant],
    extra,
  )
}
