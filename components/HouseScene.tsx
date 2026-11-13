'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import type { MotionValue } from 'framer-motion'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/*
 * A small modern Toronto infill house, built from simple solids.
 * Scroll progress (0 → 1) drives three phases:
 *   drawing  : parts float apart as ink line drawings
 *   assembly : parts drop into place, in build order
 *   finish   : real materials fade in, the lines step back
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3)
const INK = new THREE.Color('#1c1b19')

type PartProps = {
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  order: number // 0..1, build order
  explode: [number, number, number]
  roughness?: number
  metalness?: number
  progress: React.MutableRefObject<number>
  intro: React.MutableRefObject<number>
  shadow?: boolean
  emissive?: string
  emissiveIntensity?: number
}

function Part({ geometry, position, rotation = [0, 0, 0], color, order, explode, roughness = 0.85, metalness = 0, progress, intro, shadow = true, emissive = '#000000', emissiveIntensity = 0 }: PartProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const lineMat = useRef<THREE.LineBasicMaterial>(null)
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 20), [geometry])

  useFrame(() => {
    const p = progress.current
    const assemble = ease((p - 0.18 - order * 0.32) / 0.3)
    const solid = ease((p - 0.62 - order * 0.18) / 0.2)
    const drawIn = ease((intro.current - order * 0.6) / 0.5)
    if (group.current) {
      const k = 1 - assemble
      group.current.position.set(position[0] + explode[0] * k, position[1] + explode[1] * k, position[2] + explode[2] * k)
      group.current.rotation.set(rotation[0], rotation[1] + 0.25 * k * (order - 0.5), rotation[2])
    }
    if (mat.current) {
      mat.current.opacity = solid
      mat.current.depthWrite = solid > 0.98
      mat.current.visible = solid > 0.002
    }
    if (lineMat.current) lineMat.current.opacity = drawIn * (1 - solid * 0.82)
  })

  return (
    <group ref={group}>
      <group rotation={rotation}>
        <mesh geometry={geometry} castShadow={shadow} receiveShadow>
          <meshStandardMaterial ref={mat} color={color} roughness={roughness} metalness={metalness} emissive={emissive} emissiveIntensity={emissiveIntensity} transparent opacity={0} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial ref={lineMat} color={INK} transparent opacity={0} />
        </lineSegments>
      </group>
    </group>
  )
}

const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)

function gable(width: number, height: number, depth: number) {
  const s = new THREE.Shape()
  s.moveTo(-width / 2, 0)
  s.lineTo(width / 2, 0)
  s.lineTo(0, height)
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false })
  g.translate(0, 0, -depth / 2)
  return g
}

/** A small pill label drawn on a canvas, used as a sprite texture. */
function labelTexture(text: string) {
  const c = document.createElement('canvas')
  c.width = 360
  c.height = 100
  const g = c.getContext('2d')!
  g.fillStyle = '#f3efe7'
  g.strokeStyle = '#a67c3d'
  g.lineWidth = 4
  g.beginPath()
  g.roundRect(6, 10, 348, 80, 40)
  g.fill()
  g.stroke()
  g.fillStyle = '#a67c3d'
  g.font = '500 40px system-ui, sans-serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, 180, 52)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function Dimension({ from, to, label, progress, offset }: { from: [number, number, number]; to: [number, number, number]; label: string; progress: React.MutableRefObject<number>; offset: number }) {
  const ref = useRef<THREE.LineBasicMaterial>(null)
  const sprite = useRef<THREE.SpriteMaterial>(null)
  const tex = useMemo(() => labelTexture(label), [label])
  const geo = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a).normalize()
    const n = new THREE.Vector3(0, 1, 0).cross(dir).normalize().multiplyScalar(0.18)
    if (n.lengthSq() < 1e-6) n.set(0.18, 0, 0)
    const pts = [a, b, a.clone().add(n), a.clone().sub(n), b.clone().add(n), b.clone().sub(n)]
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [from, to])
  const mid = useMemo(() => new THREE.Vector3(...from).add(new THREE.Vector3(...to)).multiplyScalar(0.5), [from, to])
  useFrame(() => {
    const p = progress.current
    const o = clamp01((p - offset) / 0.08) * (1 - clamp01((p - 0.55) / 0.12))
    if (ref.current) ref.current.opacity = o
    if (sprite.current) sprite.current.opacity = o
  })
  return (
    <group>
      <lineSegments geometry={geo}>
        <lineBasicMaterial ref={ref} color="#a67c3d" transparent opacity={0} />
      </lineSegments>
      <sprite position={mid} scale={[1.5, 0.42, 1]}>
        <spriteMaterial ref={sprite} map={tex} transparent opacity={0} depthTest={false} />
      </sprite>
    </group>
  )
}

function House({ progress, intro }: { progress: React.MutableRefObject<number>; intro: React.MutableRefObject<number> }) {
  const g = useMemo(() => ({
    ground: box(11, 0.24, 7.5),
    plinth: box(4.4, 2.8, 4.2),
    glassFront: box(3.1, 2.15, 0.08),
    door: box(0.95, 2.15, 0.1),
    upper: box(5.4, 2.7, 3.8),
    slat: box(0.07, 2.5, 0.09),
    upperWin: box(1.5, 1.7, 0.08),
    roof: gable(5.7, 1.65, 4.1),
    rear: box(2.4, 2.5, 3.2),
    rearGlass: box(0.08, 1.9, 2.4),
    chimney: box(0.55, 1.5, 0.55),
    step: box(1.6, 0.16, 0.5),
    trunk: new THREE.CylinderGeometry(0.07, 0.1, 1.6, 8),
    canopy: new THREE.IcosahedronGeometry(0.95, 0),
    planter: box(2.4, 0.5, 0.6),
  }), [])

  const P = { progress, intro }
  const slats = Array.from({ length: 16 }, (_, i) => i)

  return (
    <group position={[-0.4, 0, 0]}>
      <Part {...P} geometry={g.ground} position={[0.4, -0.12, 0.4]} color="#e4ddd0" order={0} explode={[0, -0.6, 0]} shadow={false} />
      <Part {...P} geometry={g.plinth} position={[-0.6, 1.4, 0]} color="#efebe4" order={0.1} explode={[-2.2, -1.2, 0.6]} />
      <Part {...P} geometry={g.glassFront} position={[-0.95, 1.2, 2.11]} color="#2f3f49" roughness={0.1} metalness={0.55} emissive="#f0c27a" emissiveIntensity={0.1} order={0.22} explode={[-1.2, 0.2, 2.6]} />
      <Part {...P} geometry={g.door} position={[1.05, 1.2, 2.12]} color="#a67c3d" roughness={0.5} order={0.26} explode={[0.6, -0.4, 2.4]} />
      <Part {...P} geometry={g.rear} position={[2.75, 1.25, -0.5]} color="#9c7650" roughness={0.75} order={0.3} explode={[2.6, -0.8, -1]} />
      <Part {...P} geometry={g.rearGlass} position={[3.96, 1.25, -0.5]} color="#2f3f49" roughness={0.1} metalness={0.55} emissive="#f0c27a" emissiveIntensity={0.1} order={0.36} explode={[2.8, 0, -0.4]} />
      <Part {...P} geometry={g.upper} position={[0.3, 4.15, 0.25]} color="#2c2b28" roughness={0.9} order={0.45} explode={[0.8, 1.8, 1.2]} />
      {slats.map((i) => (
        <Part key={i} {...P} geometry={g.slat} position={[-2.15 + i * 0.205, 4.15, 2.2]} color="#b08458" roughness={0.7} order={0.55 + i * 0.008} explode={[-1 + i * 0.13, 2.0, 2.8]} shadow={false} />
      ))}
      <Part {...P} geometry={g.upperWin} position={[1.55, 4.2, 2.18]} color="#2f3f49" roughness={0.1} metalness={0.55} emissive="#f0c27a" emissiveIntensity={0.1} order={0.62} explode={[1.8, 1.8, 2.6]} />
      <Part {...P} geometry={g.roof} position={[0.3, 5.5, 0.25]} color="#33312d" roughness={0.6} order={0.72} explode={[0.2, 2.2, -0.6]} />
      <Part {...P} geometry={g.chimney} position={[1.6, 6.2, -0.8]} color="#2c2b28" order={0.78} explode={[1.2, 2.6, -0.8]} />
      {[0, 1, 2].map((i) => (
        <Part key={i} {...P} geometry={g.step} position={[1.05, 0.08 + i * 0.16, 2.95 - i * 0.32]} color="#d9d2c5" order={0.82 + i * 0.02} explode={[0.4, -0.4, 2]} />
      ))}
      <Part {...P} geometry={g.planter} position={[-1.8, 0.25, 3.0]} color="#d9d2c5" order={0.86} explode={[-1.4, -0.4, 1.6]} />
      <Part {...P} geometry={g.trunk} position={[-3.9, 0.8, 2.4]} color="#5d4a36" order={0.9} explode={[1.4, 0.4, 3.2]} />
      <Part {...P} geometry={g.canopy} position={[-3.9, 2.1, 2.4]} color="#7f8c69" roughness={0.95} order={0.94} explode={[1.6, 1.2, 3.4]} />

      <Dimension from={[-2.8, 0.02, 3.6]} to={[1.6, 0.02, 3.6]} label="4.40 m" progress={progress} offset={0.04} />
      <Dimension from={[-3.4, 0, 2.1]} to={[-3.4, 5.5, 2.1]} label="5.50 m" progress={progress} offset={0.08} />
      <Dimension from={[-2.4, 7.6, 0.25]} to={[3.0, 7.6, 0.25]} label="5.40 m" progress={progress} offset={0.12} />
    </group>
  )
}

function Rig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera, size } = useThree()
  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame(() => {
    const p = progress.current
    const narrow = size.width < 820
    const dist = (narrow ? 31 : 30) + (1 - p) * 3 - p * 2
    target.set(dist * 0.55, 6 + (1 - p) * 2, dist * 0.84)
    camera.position.lerp(target, 0.06)
    // Desktop: look left of the house so it sits in the right half, clear of the headline.
    camera.lookAt(narrow ? 0.6 : -5.2, narrow ? 3.4 + (1 - p) * 0.8 : 2.2 + (1 - p) * 0.8, narrow ? 0 : 2.2)
  })
  return null
}

function Scene({ progressMV, pointer, reduced }: { progressMV: MotionValue<number>; pointer: React.MutableRefObject<{ x: number; y: number }>; reduced: boolean }) {
  const progress = useRef(reduced ? 1 : 0)
  const intro = useRef(reduced ? 2 : 0)
  const spin = useRef<THREE.Group>(null)
  const shadow = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const target = reduced ? 1 : progressMV.get()
    progress.current = THREE.MathUtils.damp(progress.current, target, 5, dt)
    intro.current = Math.min(2, intro.current + dt * 0.9)
    if (spin.current) {
      const p = progress.current
      const y = -0.55 + p * 1.05 + pointer.current.x * 0.12
      spin.current.rotation.y = THREE.MathUtils.damp(spin.current.rotation.y, y, 3, dt)
      spin.current.rotation.x = THREE.MathUtils.damp(spin.current.rotation.x, pointer.current.y * 0.04, 3, dt)
      spin.current.position.x = window.innerWidth < 820 ? 0 : (1 - p) * 1.8
    }
    if (shadow.current) shadow.current.visible = progress.current > 0.74
  })

  return (
    <>
      <Rig progress={progress} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[7, 12, 8]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0004} />
      <directionalLight position={[-8, 5, -4]} intensity={0.5} color="#ffd9a8" />
      <group ref={spin}>
        <House progress={progress} intro={intro} />
      </group>
      <group ref={shadow}>
        <ContactShadows position={[0, -0.24, 0]} opacity={0.35} scale={22} blur={2.6} far={8} />
      </group>
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.4} position={[0, 6, 6]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffd9a8" position={[-8, 3, -2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[6, 8, -6]} scale={3} />
      </Environment>
    </>
  )
}

export default function HouseCanvas({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const pointer = useRef({ x: 0, y: 0 })
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [10, 7, 16], fov: 28, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMove={(e) => {
        const r = (e.target as HTMLElement).getBoundingClientRect()
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1
      }}
      aria-label="3D model of a modern house that assembles from a line drawing as you scroll"
      role="img"
    >
      <Scene progressMV={progress} pointer={pointer} reduced={reduced} />
    </Canvas>
  )
}
