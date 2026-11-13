import { z } from 'zod'

export const projectKinds = {
  kitchen: { label: 'Kitchen', rate: [700, 1100], size: [100, 400, 180], hint: 'Layout, cabinetry, counters' },
  bathroom: { label: 'Bathroom', rate: [900, 1500], size: [35, 200, 70], hint: 'Ensuites, family baths' },
  basement: { label: 'Basement', rate: [150, 240], size: [500, 1500, 800], hint: 'Finish, underpin, suite' },
  'whole-home': { label: 'Whole home', rate: [300, 450], size: [900, 3500, 1800], hint: 'Gut and rebuild' },
  addition: { label: 'Addition', rate: [650, 900], size: [300, 1200, 500], hint: 'Rear, side or up' },
} as const

export type Kind = keyof typeof projectKinds
export const kinds = Object.keys(projectKinds) as Kind[]

export const finishes = {
  essential: { label: 'Essential', factor: 0.85 },
  considered: { label: 'Considered', factor: 1 },
  bespoke: { label: 'Bespoke', factor: 1.35 },
} as const
export type Finish = keyof typeof finishes

export const timelines = ['As soon as possible', 'In 3 to 6 months', 'In 6 to 12 months', 'Just exploring'] as const
export const propertyTypes = ['Detached', 'Semi-detached', 'Row house', 'Condo'] as const
export const contactPrefs = ['Email', 'Phone', 'Either'] as const

/** Planning range in CAD, rounded to the nearest $5,000. */
export function planningRange(kind: Kind, size: number, finish: Finish): [number, number] {
  const k = projectKinds[kind]
  const f = finishes[finish].factor
  const round = (n: number) => Math.round(n / 5000) * 5000
  return [round(size * k.rate[0] * f), round(size * k.rate[1] * f)]
}

export const money = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })

export const quoteSchema = z.object({
  kind: z.enum(kinds as [Kind, ...Kind[]], { message: 'Choose a project type.' }),
  size: z.number().int().min(20).max(5000),
  finish: z.enum(['essential', 'considered', 'bespoke']),
  property: z.enum(propertyTypes, { message: 'Choose your property type.' }),
  timeline: z.enum(timelines, { message: 'Choose a timeline.' }),
  postal: z.string().trim().regex(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/, 'Enter a full postal code, like M4M 2E5.'),
  name: z.string().trim().min(2, 'Enter your name.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z.string().trim().regex(/^[\d\s()+.-]{0,20}$/, 'Use digits only.').optional().or(z.literal('')),
  contact: z.enum(contactPrefs),
  notes: z.string().trim().max(1500, 'Keep it under 1,500 characters.').optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Please confirm we can contact you about this request.' }),
})

export type QuoteInput = z.infer<typeof quoteSchema>

export const MAX_PHOTOS = 6
