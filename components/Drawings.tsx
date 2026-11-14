'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

/*
 * Architectural line drawings that ink themselves in when they scroll into view.
 * Ink lines use currentColor; brass accents use the .b class.
 */

const ease = [0.65, 0, 0.35, 1] as const
const line: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay: 0.1 + i * 0.05, ease }, opacity: { duration: 0.01, delay: 0.1 + i * 0.05 } },
  }),
}
const fade: Variants = {
  hidden: { opacity: 0 },
  show: (i: number = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: 0.5 + i * 0.05 } }),
}

/** A stroked path that draws in. */
function L({ d, i = 0, b, faint, dash }: { d: string; i?: number; b?: boolean; faint?: boolean; dash?: boolean }) {
  return <motion.path d={d} custom={i} variants={line} className={[b && 'b', faint && 'faint', dash && 'dash'].filter(Boolean).join(' ') || undefined} />
}
/** A filled shape that fades in after the lines. */
function F({ d, i = 0, b, soft }: { d: string; i?: number; b?: boolean; soft?: boolean }) {
  return <motion.path d={d} custom={i} variants={fade} className={['fill', b && 'b', soft && 'soft'].filter(Boolean).join(' ')} />
}
function T({ x, y, children, i = 0, anchor = 'middle' }: { x: number; y: number; children: ReactNode; i?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return <motion.text x={x} y={y} textAnchor={anchor} custom={i} variants={fade}>{children}</motion.text>
}

function Sheet({ w, h, children, className = '' }: { w: number; h: number; children: ReactNode; className?: string }) {
  return (
    <motion.svg className={`drawing ${className}`} viewBox={`0 0 ${w} ${h}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-8% 0px' }} aria-hidden="true">
      {children}
    </motion.svg>
  )
}

/** Horizontal dimension line with ticks and a label. */
function Dim({ x1, x2, y, label, i = 0 }: { x1: number; x2: number; y: number; label: string; i?: number }) {
  const m = (x1 + x2) / 2
  return (
    <>
      <L d={`M${x1} ${y}H${m - 14}M${m + 14} ${y}H${x2}M${x1} ${y - 4}v8M${x2} ${y - 4}v8M${x1 - 3} ${y + 3}l6 -6M${x2 - 3} ${y + 3}l6 -6`} i={i} b />
      <T x={m} y={y + 2.6} i={i}>{label}</T>
    </>
  )
}

const tiles = (x0: number, x1: number, y0: number, y1: number, step: number) => {
  let d = ''
  for (let y = y0; y <= y1; y += step) d += `M${x0} ${y}H${x1}`
  let row = 0
  for (let y = y0; y < y1; y += step, row++) for (let x = x0 + (row % 2 ? step : step * 2); x < x1; x += step * 2) d += `M${x} ${y}v${step}`
  return d
}

/* ---------- Services ---------- */

export function KitchenDrawing() {
  return (
    <Sheet w={200} h={120}>
      <L d="M8 104H192" />
      <F d={tiles(20, 180, 44, 62, 6)} soft />
      <L d={tiles(20, 180, 44, 62, 6)} faint i={2} />
      {/* uppers */}
      <L d="M20 12h64v32H20zM41 12v32M62 12v32M37 36v5M45 36v5M58 36v5M66 36v5" i={1} />
      <L d="M136 12h44v32h-44zM158 12v32M154 36v5M162 36v5" i={1} />
      <L d="M102 12h16v14l12 12H90l12-12z" i={3} />
      <L d="M96 38h28" i={4} b />
      {/* counter + base */}
      <L d="M14 62H186v5H14z" i={5} />
      <F d="M14 62H186v5H14z" b />
      <L d="M20 67h160v37H20zM60 67v37M100 67v37M140 67v37M100 79h40M100 91h40M116 73h8M116 85h8M116 97h8M52 76v12M68 76v12" i={6} />
      {/* range */}
      <L d="M64 74h32v24H64zM70 70h2M78 70h2M86 70h2" i={7} />
      <F d="M66 76h28v20H66z" soft />
      {/* sink + faucet */}
      <L d="M146 62c0 7 24 7 24 0" i={8} />
      <L d="M158 62V48q0-6 7-6v5" i={9} b />
      {/* pot plant + bowl */}
      <L d="M26 62l2-9h10l2 9zM33 53c-6-8-2-14 0-16c2 2 6 8 0 16M33 53c4-7 10-7 11-6" i={10} />
      <L d="M118 62c0-5 14-5 14 0" i={10} />
      <Dim x1={20} x2={180} y={113} label="3.60 m" i={11} />
    </Sheet>
  )
}

export function BathroomDrawing() {
  return (
    <Sheet w={200} h={120}>
      <L d="M8 104H192" />
      <L d={tiles(124, 188, 16, 104, 8)} faint i={1} />
      <F d={tiles(124, 188, 16, 104, 8)} soft />
      {/* shower */}
      <L d="M124 14V104" i={2} />
      <L d="M156 16v10M146 26h20" i={3} b />
      <L d="M149 32v6M153 34v6M157 32v6M161 34v6M165 32v6M151 44v6M159 44v6M155 54v6" i={4} b dash />
      <L d="M150 104h12" i={5} b />
      {/* window over tub */}
      <L d="M30 18h52v34H30zM56 18v34M30 35h52M26 52h60" i={2} />
      {/* tub */}
      <L d="M14 74h80c0 18-12 26-26 26H40c-14 0-26-8-26-26zM24 100l-3 4M84 100l3 4" i={5} />
      <L d="M100 104V68q0-7-8-7h-4" i={6} b />
      <L d="M18 78c18 3 52 3 72 0" i={7} faint />
      {/* towel ring + plant */}
      <L d="M105 45a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M110 35v-4" i={8} b />
      <L d="M104 104l2-10h10l2 10zM111 94c-7-10-1-16 0-18c2 2 7 9 0 18M111 94c4-8 11-8 13-7M111 94c-5-6-11-6-13-4" i={9} />
      <Dim x1={14} x2={94} y={113} label="1.70 m" i={10} />
    </Sheet>
  )
}

export function BasementDrawing() {
  return (
    <Sheet w={200} h={120}>
      {/* grade */}
      <L d="M4 34H196" />
      <L d="M8 34l2-4M14 34l1-5M20 34l2-4M178 34l2-4M184 34l1-5M190 34l2-4" i={1} />
      <L d="M30 34V16H170V34" i={1} faint />
      {/* foundation + footing */}
      <L d="M30 34V104M170 34V104M24 104h152v6H24z" i={2} />
      <F d="M24 104h152v6H24z" soft />
      <L d="M26 92l8 8M30 88l10 10M156 92l8 8M160 88l10 10" i={3} b />
      {/* old floor and new depth */}
      <L d="M34 84H166" i={3} dash faint />
      <L d="M182 84V102M178 98l4 4 4-4" i={4} b />
      {/* stair */}
      <L d="M40 34v10h10v10h10v10h10v10h10v10h10v14" i={5} />
      {/* sofa + lamp */}
      <L d="M112 104v-12h40v12M108 94h4v10M152 94h4v10M116 92v-8h32v8" i={6} />
      <L d="M162 104V78M156 78h12l-3-8h-6z" i={7} />
      <F d="M157 77h10l-2-6h-6z" b />
      {/* egress window + sump */}
      <L d="M170 42h12v24h-12M170 54h12" i={8} />
      <L d="M60 104c0 6 14 6 14 0" i={9} />
      <T x={100} y={60} i={10}>2.4 m clear</T>
    </Sheet>
  )
}

export function WholeHomeDrawing() {
  return (
    <Sheet w={200} h={120}>
      <L d="M4 106H196" />
      <L d="M30 106V42L100 10L170 42V106" i={1} />
      <L d="M140 24V8h10v20" i={2} />
      <L d="M30 74H170M30 42H170" i={3} />
      {/* steel beam */}
      <F d="M54 70h92v4H54z" b />
      <L d="M54 70h92M54 74h92M100 70v4" i={4} b />
      {/* stair */}
      <L d="M40 106v-6h7v-6h7v-6h7v-6h7v-6h7" i={5} />
      {/* upstairs bed + window */}
      <L d="M44 74v-12h40v12M44 66h40M48 62v-6h10v6" i={6} />
      <L d="M118 48h22v18h-22zM129 48v18" i={6} />
      {/* main floor sofa, table, pendant */}
      <L d="M96 106v-10h30v10M92 98h4v8M126 98h4v8" i={7} />
      <L d="M140 106V92h24M152 92v14M152 76v6M146 82h12l-3 4h-6z" i={8} />
      <F d="M147 82h10l-2 4h-6z" b />
      {/* radiant floor */}
      <L d="M34 103q4-3 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0" i={9} b />
      <L d="M95 41a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" i={9} />
      <T x={100} y={84} i={10}>open plan</T>
    </Sheet>
  )
}

export function AdditionDrawing() {
  return (
    <Sheet w={200} h={120}>
      <L d="M4 106H196" />
      {/* existing house dashed */}
      <L d="M34 106V56L74 32L114 56V106" i={1} dash faint />
      <L d="M50 106V84h14v22M86 64h14v14H86z" i={2} dash faint />
      {/* new third storey + rear */}
      <L d="M52 46V18H124V46" i={3} />
      <F d="M52 18h72v4H52z" />
      <L d="M60 24v20M66 24v20M72 24v20M78 24v20M84 24v20M90 24v20M96 24v20" i={4} b />
      <L d="M104 26h14v16h-14z" i={5} />
      <L d="M114 106V56H154V106M124 66h20v24h-20zM134 66v24" i={5} />
      <L d="M116 104l36-36M116 94l26-26M126 104l26-26" i={6} faint />
      <L d="M88 12V2M84 6l4-4 4 4" i={7} b />
      {/* crane */}
      <L d="M182 106V14M168 14h28M182 14l-8 8M182 22l8-8M174 14v18M172 32h4" i={8} />
      <L d="M178 106l4-8 4 8" i={8} />
      {/* tree */}
      <L d="M18 106V88M18 88c-10 0-12-14-2-16c0-8 12-8 12 0c8 2 6 16-4 16z" i={9} />
      <T x={132} y={12} i={10} anchor="start">+2 rooms</T>
    </Sheet>
  )
}

export const serviceDrawings: Record<string, () => ReactNode> = {
  kitchens: KitchenDrawing,
  bathrooms: BathroomDrawing,
  basements: BasementDrawing,
  'whole-home': WholeHomeDrawing,
  additions: AdditionDrawing,
}

/* ---------- Process steps ---------- */

function WalkthroughDrawing() {
  return (
    <Sheet w={240} h={140}>
      {/* floor plan */}
      <L d="M14 14h130v112H14z" />
      <L d="M14 70h56M90 70h54M80 14v34M80 62v8" i={1} />
      <L d="M70 70a20 20 0 0 1 20-20" i={2} faint />
      <L d="M14 98h10M34 98h10" i={2} />
      <L d="M108 14v-4h24v4M14 40h-4v20h4" i={3} b />
      <T x={46} y={44} i={4}>KITCHEN</T>
      <T x={112} y={44} i={4}>DINING</T>
      <T x={78} y={102} i={4}>LIVING</T>
      {/* tape measure */}
      <L d="M174 114a22 22 0 1 0 44 0a22 22 0 1 0 -44 0" i={5} />
      <F d="M180 114a16 16 0 1 0 32 0a16 16 0 1 0 -32 0" b soft />
      <L d="M190 114a6 6 0 1 0 12 0a6 6 0 1 0 -12 0" i={6} />
      <L d="M174 120H150M150 116v8M158 118v4M166 118v4" i={7} b />
      {/* clipboard */}
      <L d="M164 10h62v52h-62zM186 6h18v8h-18zM172 26h4l2 3 5-6M188 26h30M172 38h4l2 3 5-6M188 38h30M172 50h4M188 50h22" i={8} />
    </Sheet>
  )
}

function DesignDrawing() {
  return (
    <Sheet w={240} h={140}>
      {/* isometric house */}
      <L d="M30 98l50 24l50-24V60L80 36L30 60z" />
      <L d="M30 60l50 24l50-24M80 84v38" i={1} />
      <L d="M30 60L58 22L108 46L130 60M58 22l22 14" i={2} />
      <L d="M44 82l14 7V74l-14-7zM96 92l20-10V68l-20 10z" i={3} b />
      {/* swatches */}
      <L d="M156 18h32v32h-32z" i={4} />
      <L d="M160 50l28-28M156 40l18-18M168 50l20-20M156 30l8-8M178 50l10-10" i={5} faint />
      <L d="M196 18h32v32h-32z" i={4} />
      <F d="M196 18h32v32h-32z" b soft />
      <L d="M156 60h32v32h-32z" i={6} />
      <L d="M162 66h1M170 72h1M178 66h1M164 82h1M176 84h1M184 74h1M160 76h1M172 88h1" i={7} />
      <L d="M196 60h32v32h-32zM196 70h32M196 80h32M206 60v10M218 70v10M206 80v12" i={6} />
      {/* pencil */}
      <L d="M150 124L222 104l6 6-72 20zM150 124l-6 4 8-1" i={8} b />
    </Sheet>
  )
}

function PriceDrawing() {
  return (
    <Sheet w={240} h={140}>
      <L d="M40 8h120v128H40z" />
      <L d="M52 22h60M52 30h40" i={1} />
      {[44, 56, 68, 80, 92].map((y, k) => (
        <L key={y} d={`M52 ${y}h${34 + (k % 3) * 8}M${92 + (k % 3) * 8} ${y}h${30 - (k % 3) * 8}M126 ${y}h22`} i={2 + k} faint={k % 2 === 1} />
      ))}
      <L d="M52 104h96v14H52z" i={7} />
      <F d="M52 104h96v14H52z" soft />
      <T x={58} y={114} i={8} anchor="start">TOTAL</T>
      <L d="M120 112h22" i={8} />
      <L d="M54 128c6-6 10 4 14-2s8-4 12 0" i={9} />
      {/* stamp */}
      <L d="M170 88a26 26 0 1 0 52 0a26 26 0 1 0 -52 0M176 88a20 20 0 1 0 40 0a20 20 0 1 0 -40 0" i={10} b />
      <T x={196} y={84} i={11}>FIXED</T>
      <L d="M186 94l6 6 12-12" i={11} b />
    </Sheet>
  )
}

function BuildDrawing() {
  return (
    <Sheet w={240} h={140}>
      <L d="M10 128H230" />
      {/* stud wall */}
      <L d="M14 20h150v6H14zM14 116h150v6H14z" />
      <L d="M24 26v90M40 26v90M56 26v90M120 26v90M136 26v90M152 26v90" i={1} />
      <L d="M72 26v90M104 26v90M72 44h32v8H72zM78 52v64M98 52v64M88 26v18" i={2} b />
      <L d="M24 70h16M120 74h16" i={3} faint />
      {/* sawhorse + level */}
      <L d="M176 92h48M182 92l-8 36M218 92l8 36M186 92l-4 36M214 92l4 36" i={4} />
      <L d="M180 84h40v8h-40zM196 86h8v4h-8z" i={5} b />
      {/* hard hat */}
      <L d="M182 66c0-18 36-18 36 0zM176 66h48M200 48v18" i={6} />
      <F d="M182 66c0-18 36-18 36 0z" b soft />
    </Sheet>
  )
}

function HandoverDrawing() {
  return (
    <Sheet w={240} h={140}>
      <L d="M10 128H230" />
      {/* door */}
      <L d="M30 128V20h64v108" />
      <L d="M38 128V28h48v100" i={1} />
      <L d="M46 36h32v30H46zM62 36v30M46 51h32" i={2} faint />
      <L d="M78 84v18" i={3} b />
      <L d="M52 12h20v6H52z" i={3} b />
      <L d="M22 128h80v-4H22z" i={4} />
      {/* keys */}
      <L d="M140 36a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" i={5} b />
      <L d="M138 58a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M152 56a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M146 46l-2 6M156 46l2 4" i={6} />
      <L d="M142 64l-4 26M138 90l5 1M140 82l5 1M161 61l12 22M173 83l-4 3M168 74l-4 3" i={6} b />
      {/* checklist */}
      <L d="M176 60h50v62h-50zM184 74l4 4 7-8M200 74h18M184 92l4 4 7-8M200 92h18M184 110l4 4 7-8M200 110h14" i={7} />
      <T x={201} y={54} i={8}>2-YR WARRANTY</T>
    </Sheet>
  )
}

export const stepDrawings = [WalkthroughDrawing, DesignDrawing, PriceDrawing, BuildDrawing, HandoverDrawing]
