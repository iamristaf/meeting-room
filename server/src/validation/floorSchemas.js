import { z } from 'zod'

export const floorSchema = z.object({
  name: z
    .string('Name is required')
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name can have at most 100 characters'),
  width: z.coerce
    .number('Width must be a number')
    .int('Width must be a whole number')
    .min(400, 'Width must be at least 400')
    .max(4000, 'Width can be at most 4000'),
  height: z.coerce
    .number('Height must be a number')
    .int('Height must be a whole number')
    .min(300, 'Height must be at least 300')
    .max(3000, 'Height can be at most 3000'),
})

const itemSchema = z.object({
  kind: z.enum([
    'room',
    'resource',
    'wall',
    'door',
    'window',
    'label',
    'decor',
  ]),
  resourceId: z.uuid().nullish(),
  x: z.number().min(-5000).max(10000),
  y: z.number().min(-5000).max(10000),
  w: z.number().positive().max(10000),
  h: z.number().positive().max(10000),
  rotation: z.number().min(-720).max(720).default(0),
  shape: z.enum(['rect', 'ellipse']).default('rect'),
  label: z.string().trim().max(100).default(''),
  icon: z.string().trim().max(30).default(''),
})

export const layoutSchema = z.object({
  items: z.array(itemSchema).max(500, 'A floor can have up to 500 items'),
})

export const statusQuerySchema = z.object({
  date: z
    .string('Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must look like YYYY-MM-DD'),
  time: z
    .string('Time is required')
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must look like HH:MM'),
  duration: z.coerce.number().int().min(15).max(720).default(60),
})
