'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow, typeIcons } from './icons'
import {
  MAX_PHOTOS, contactPrefs, finishes, kinds, money, planningRange, projectKinds, propertyTypes, quoteSchema, timelines,
  type Finish, type Kind, type QuoteInput,
} from '@/lib/quote'

type Photo = { file: File; url: string }
type Form = Omit<QuoteInput, 'kind' | 'property' | 'timeline' | 'consent'> & {
  kind: Kind | ''
  property: QuoteInput['property'] | ''
  timeline: QuoteInput['timeline'] | ''
  consent: boolean
}

const STEPS = ['Project', 'Details', 'Photos', 'Contact', 'Review'] as const
const stepFields: (keyof Form)[][] = [['kind'], ['size', 'finish', 'property', 'timeline', 'postal'], [], ['name', 'email', 'phone', 'contact', 'notes'], ['consent']]

/** Downscale a photo in the browser so uploads stay small and fast. */
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), 'image/jpeg', 0.82))
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
}

function AnimatedMoney({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => money(v))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [mv, value])
  return <motion.span>{text}</motion.span>
}

export function QuoteWizard() {
  const params = useSearchParams()
  const initialKind = (kinds as string[]).includes(params.get('type') ?? '') ? (params.get('type') as Kind) : ''
  const [step, setStep] = useState(initialKind ? 1 : 0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<Form>({
    kind: initialKind, size: initialKind ? projectKinds[initialKind].size[2] : 200, finish: 'considered', property: '', timeline: '', postal: '',
    name: '', email: '', phone: '', contact: 'Email', notes: '', consent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photos, setPhotos] = useState<Photo[]>([])
  const [over, setOver] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ reference: string } | null>(null)
  const [serverError, setServerError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }
  const range = useMemo(() => (form.kind ? planningRange(form.kind, form.size, form.finish) : null), [form.kind, form.size, form.finish])

  useEffect(() => heading.current?.focus({ preventScroll: true }), [step])
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []) // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (s: number) => {
    const fields = stepFields[s]
    if (!fields.length) return true
    const res = quoteSchema.safeParse(form)
    if (res.success) return true
    const errs: Record<string, string> = {}
    for (const i of res.error.issues) {
      const k = String(i.path[0]) as keyof Form
      if (fields.includes(k) && !errs[k]) errs[k] = i.message
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const go = (to: number) => {
    if (to > step) {
      for (let s = step; s < to; s++) if (!validate(s)) return setStep(s)
    }
    setDir(to > step ? 1 : -1)
    setStep(to)
    window.scrollTo({ top: Math.max(0, (document.querySelector('.quote-wrap') as HTMLElement)?.offsetTop - 120), behavior: 'smooth' })
  }

  const addFiles = async (list: FileList | null) => {
    if (!list) return
    const room = MAX_PHOTOS - photos.length
    const picked = Array.from(list).filter((f) => f.type.startsWith('image/')).slice(0, room)
    const shrunk = await Promise.all(picked.map(shrink))
    setPhotos((p) => [...p, ...shrunk.map((file) => ({ file, url: URL.createObjectURL(file) }))])
  }

  const submit = async () => {
    if (!validate(4)) return
    setStatus('sending')
    setServerError('')
    const fd = new FormData()
    fd.set('data', JSON.stringify({ ...form, size: Number(form.size) }))
    fd.set('website', (document.getElementById('hp-website') as HTMLInputElement)?.value ?? '')
    photos.forEach((p) => fd.append('photos', p.file))
    try {
      const res = await fetch('/api/quote', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        if (json.fields) setErrors(json.fields)
        setServerError(json.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }
      setResult({ reference: json.reference })
      setStatus('done')
    } catch {
      setServerError('We could not reach the server. Check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'done' && result) {
    return (
      <div className="quote-wrap">
        <motion.div className="success" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="label">Request received</span>
          <h2 className="serif h-2" style={{ marginTop: 14 }} tabIndex={-1} ref={heading}>Thank you, {form.name.split(' ')[0]}.</h2>
          <div className="ref">Reference {result.reference}</div>
          <p className="lede">This is a request, not a booked appointment. Here is what happens next:</p>
          <ol>
            <li>A designer reads your answers{photos.length ? ` and ${photos.length} photo${photos.length > 1 ? 's' : ''}` : ''} within two business days.</li>
            <li>We {form.contact === 'Phone' ? 'call you' : 'email you'} to suggest times for a walkthrough at your house.</li>
            <li>After the walkthrough you get a written summary and a budget range for your actual house.</li>
          </ol>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
            <Link href="/projects" className="btn">Browse projects <span className="arrow"><Arrow size={12} /></span></Link>
            <Link href="/" className="btn ghost">Back home <span className="arrow"><Arrow size={12} /></span></Link>
          </div>
        </motion.div>
        <Summary form={form} range={range} photoCount={photos.length} />
      </div>
    )
  }

  const err = (k: string) => (errors[k] ? <span className="err" id={`${k}-err`}>{errors[k]}</span> : null)
  const inv = (k: string) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-err` } : {})

  return (
    <div className="quote-wrap">
      <div>
        <div className="ruler" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          <div className="ruler-base" />
          <motion.div className="ruler-fill" animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.6 }} />
          <div className="ruler-steps">
            {STEPS.map((s, i) => (
              <button key={s} type="button" disabled={i > step} className={i < step ? 'done' : i === step ? 'current' : ''} onClick={() => i < step && go(i)} aria-current={i === step ? 'step' : undefined}>
                <i />{s}
              </button>
            ))}
          </div>
        </div>

        <input id="hp-website" name="website" tabIndex={-1} autoComplete="off" className="visually-hidden" aria-hidden="true" />

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            className="q-step"
            custom={dir}
            initial={{ opacity: 0, x: dir * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -50 }}
            transition={{ duration: 0.45 }}
          >
            {step === 0 && (
              <>
                <h2 className="serif h-2" tabIndex={-1} ref={heading}>What are we working on?</h2>
                <p>Pick the closest match. You can add more detail later.</p>
                <div className="choice-grid" role="radiogroup" aria-label="Project type">
                  {kinds.map((k) => (
                    <button key={k} type="button" role="radio" aria-checked={form.kind === k} className="choice" onClick={() => { setForm((f) => ({ ...f, kind: k, size: projectKinds[k].size[2] })); setErrors({}) }}>
                      {typeIcons[k]}
                      <span><strong>{projectKinds[k].label}</strong><br /><small>{projectKinds[k].hint}</small></span>
                    </button>
                  ))}
                </div>
                {err('kind')}
              </>
            )}

            {step === 1 && form.kind && (
              <>
                <h2 className="serif h-2" tabIndex={-1} ref={heading}>The details</h2>
                <p>Rough numbers are fine. We measure properly at the walkthrough.</p>
                <div className="field-grid">
                  <div className="field full">
                    <label htmlFor="size">Approximate size</label>
                    <div className="range-row">
                      <input id="size" type="range" min={projectKinds[form.kind].size[0]} max={projectKinds[form.kind].size[1]} step={5} value={form.size} onChange={(e) => set('size', Number(e.target.value))} aria-valuetext={`${form.size} square feet`} />
                      <output htmlFor="size">{form.size} ft²</output>
                    </div>
                  </div>
                  <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend>Level of finish</legend>
                    <div className="seg" role="radiogroup" aria-label="Level of finish">
                      {(Object.keys(finishes) as Finish[]).map((f) => (
                        <button key={f} type="button" role="radio" aria-checked={form.finish === f} onClick={() => set('finish', f)}>{finishes[f].label}</button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend>Property type</legend>
                    <div className="seg" role="radiogroup" aria-label="Property type" {...inv('property')}>
                      {propertyTypes.map((p) => (
                        <button key={p} type="button" role="radio" aria-checked={form.property === p} onClick={() => set('property', p)}>{p}</button>
                      ))}
                    </div>
                    {err('property')}
                  </fieldset>
                  <div className="field">
                    <label htmlFor="timeline">When would you like to start?</label>
                    <select id="timeline" value={form.timeline} onChange={(e) => set('timeline', e.target.value as Form['timeline'])} {...inv('timeline')}>
                      <option value="">Choose one</option>
                      {timelines.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    {err('timeline')}
                  </div>
                  <div className="field">
                    <label htmlFor="postal">Postal code of the property</label>
                    <input id="postal" autoComplete="postal-code" placeholder="M4M 2E5" value={form.postal} onChange={(e) => set('postal', e.target.value.toUpperCase())} {...inv('postal')} />
                    {err('postal')}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="serif h-2" tabIndex={-1} ref={heading}>Show us the space</h2>
                <p>Optional, but a few phone photos help us prepare for the walkthrough. Up to {MAX_PHOTOS}, resized on your device before they are sent.</p>
                <div
                  className={`drop ${over ? 'over' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInput.current?.click()}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setOver(true) }}
                  onDragLeave={() => setOver(false)}
                  onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files) }}
                  aria-label="Add photos"
                >
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="7" width="28" height="21" rx="2" /><circle cx="17" cy="17.5" r="5.5" /><path d="M12 7l2-3h6l2 3" /></svg>
                  <strong>Drop photos here or browse</strong>
                  <small style={{ color: 'var(--stone)' }}>{photos.length} of {MAX_PHOTOS} added</small>
                  <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
                </div>
                {photos.length > 0 && (
                  <div className="thumbs">
                    <AnimatePresence>
                      {photos.map((p, i) => (
                        <motion.figure key={p.url} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                          <img src={p.url} alt={`Photo ${i + 1}`} />
                          <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => { URL.revokeObjectURL(p.url); setPhotos((ps) => ps.filter((x) => x !== p)) }}>×</button>
                        </motion.figure>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="serif h-2" tabIndex={-1} ref={heading}>How do we reach you?</h2>
                <p>We only use this to reply to your request.</p>
                <div className="field-grid">
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} {...inv('name')} />
                    {err('name')}
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} {...inv('email')} />
                    {err('email')}
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone <span style={{ color: 'var(--stone)', fontWeight: 400 }}>(optional)</span></label>
                    <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} {...inv('phone')} />
                    {err('phone')}
                  </div>
                  <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                    <legend>Best way to reach you</legend>
                    <div className="seg" role="radiogroup" aria-label="Preferred contact">
                      {contactPrefs.map((c) => <button key={c} type="button" role="radio" aria-checked={form.contact === c} onClick={() => set('contact', c)}>{c}</button>)}
                    </div>
                  </fieldset>
                  <div className="field full">
                    <label htmlFor="notes">Anything else? <span style={{ color: 'var(--stone)', fontWeight: 400 }}>(optional)</span></label>
                    <textarea id="notes" rows={4} placeholder="What is not working in the space today, what you would love it to be." value={form.notes} onChange={(e) => set('notes', e.target.value)} {...inv('notes')} />
                    {err('notes')}
                  </div>
                </div>
              </>
            )}

            {step === 4 && form.kind && (
              <>
                <h2 className="serif h-2" tabIndex={-1} ref={heading}>Check and send</h2>
                <p>Make sure everything looks right.</p>
                <dl className="review">
                  {[
                    ['Project', projectKinds[form.kind].label, 0],
                    ['Size and finish', `${form.size} ft², ${finishes[form.finish].label.toLowerCase()} finish`, 1],
                    ['Property', `${form.property}, ${form.postal}`, 1],
                    ['Timeline', form.timeline, 1],
                    ['Photos', photos.length ? `${photos.length} attached` : 'None', 2],
                    ['Contact', `${form.name} · ${form.email}${form.phone ? ` · ${form.phone}` : ''} · prefers ${form.contact.toLowerCase()}`, 3],
                  ].map(([k, v, s]) => (
                    <div key={k as string}><dt>{k}</dt><dd>{v}</dd><button type="button" onClick={() => go(s as number)}>Edit</button></div>
                  ))}
                </dl>
                <label className="check">
                  <input type="checkbox" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} {...inv('consent')} />
                  <span>Halden Row may contact me about this request. My details are not shared or used for marketing.</span>
                </label>
                {err('consent')}
                {serverError && <p role="alert" style={{ color: '#a3352a', marginTop: 16 }}>{serverError}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="q-nav">
          <button type="button" className="btn ghost" onClick={() => go(step - 1)} disabled={step === 0} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
            Back
          </button>
          {step < 4 ? (
            <button type="button" className="btn" onClick={() => go(step + 1)}>
              {step === 2 && photos.length === 0 ? 'Skip photos' : 'Continue'} <span className="arrow"><Arrow size={12} /></span>
            </button>
          ) : (
            <button type="button" className="btn" onClick={submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send request'} <span className="arrow"><Arrow size={12} /></span>
            </button>
          )}
        </div>
      </div>

      <Summary form={form} range={range} photoCount={photos.length} />
    </div>
  )
}

function Summary({ form, range, photoCount }: { form: Form; range: [number, number] | null; photoCount: number }) {
  return (
    <aside className="estimate" aria-live="polite" aria-label="Planning range">
      <span className="label">Planning range</span>
      <div className="big">
        {range ? <><AnimatedMoney value={range[0]} /><br /><span style={{ opacity: 0.5 }}>to </span><AnimatedMoney value={range[1]} /></> : '—'}
      </div>
      <p>Typical all-in cost for Toronto houses, including design, permits and construction. Your fixed price comes after the walkthrough and drawings.</p>
      <dl>
        <div><dt>Project</dt><dd>{form.kind ? projectKinds[form.kind].label : 'Not chosen'}</dd></div>
        <div><dt>Size</dt><dd>{form.kind ? `${form.size} ft²` : '—'}</dd></div>
        <div><dt>Finish</dt><dd>{finishes[form.finish].label}</dd></div>
        <div><dt>Photos</dt><dd>{photoCount}</dd></div>
      </dl>
    </aside>
  )
}
