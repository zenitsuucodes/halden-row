import { NextResponse } from 'next/server'
import { MAX_PHOTOS, planningRange, quoteSchema } from '@/lib/quote'

const MAX_BYTES = 1.5 * 1024 * 1024 // photos are resized in the browser before upload

export async function POST(req: Request) {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not read the form.' }, { status: 400 })
  }

  // Honeypot: real visitors never see or fill this field.
  if (String(form.get('website') ?? '').length > 0) return NextResponse.json({ ok: true, reference: 'HR-000000' })

  let data: unknown
  try {
    data = JSON.parse(String(form.get('data') ?? '{}'))
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 })
  }

  const parsed = quoteSchema.safeParse(data)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message
    return NextResponse.json({ ok: false, error: 'Some answers need another look.', fields }, { status: 422 })
  }

  const photos = form.getAll('photos').filter((f): f is File => f instanceof File)
  if (photos.length > MAX_PHOTOS) return NextResponse.json({ ok: false, error: `Up to ${MAX_PHOTOS} photos.` }, { status: 422 })
  for (const f of photos) {
    if (!f.type.startsWith('image/')) return NextResponse.json({ ok: false, error: `${f.name} is not an image.` }, { status: 422 })
    if (f.size > MAX_BYTES) return NextResponse.json({ ok: false, error: `${f.name} is too large.` }, { status: 422 })
  }

  const q = parsed.data
  const [low, high] = planningRange(q.kind, q.size, q.finish)
  const d = new Date()
  const reference = `HR-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  return NextResponse.json({ ok: true, reference, range: [low, high], photos: photos.length })
}
