export const studio = {
  name: 'Halden Row',
  fullName: 'Halden Row Renovation Studio',
  tagline: 'Considered renovations for Toronto homes',
  phone: '(416) 555-0148',
  phoneHref: '+14165550148',
  area: 'Toronto and the inner suburbs',
  studio: 'Leslieville, Toronto. Visits by appointment.',
  hours: 'Mon to Fri, 8:00 to 5:30',
  credit: { label: 'Website by Dhanush', href: 'https://builtbydhanush.com' },
}

export type ProjectType = 'Kitchens' | 'Bathrooms' | 'Basements' | 'Whole home' | 'Additions'

export type Project = {
  slug: string
  title: string
  neighbourhood: string
  type: ProjectType
  year: number
  duration: string
  scope: string[]
  investment: string
  summary: string
  brief: string
  approach: string
  outcome: string
  /** focus point for object-position on crops */
  focus?: string
  portrait?: boolean
}

export const projects: Project[] = [
  {
    slug: 'riverdale-infill',
    title: 'The Riverdale Infill',
    neighbourhood: 'Riverdale',
    type: 'Additions',
    year: 2026,
    duration: '11 months',
    scope: ['Rear and third-storey addition', 'Timber and steel cladding', 'Full interior rebuild'],
    investment: '$650k and up',
    summary: 'A narrow lot, a tired semi and a family that needed a third floor. We added up without overpowering the street.',
    brief: 'Keep the scale of the street, add two bedrooms and a studio, and bring daylight into the middle of a deep, dark plan.',
    approach: 'A set-back third storey wrapped in charred timber reads quieter than its size. Inside, a light well over the stair pulls sun down three floors.',
    outcome: 'Two bedrooms, a roof-level studio and a stair that works like a lantern, delivered through permits, committee of adjustment and build.',
  },
  {
    slug: 'beach-hill-home',
    title: 'Beach Hill Residence',
    neighbourhood: 'The Beaches',
    type: 'Whole home',
    year: 2025,
    duration: '9 months',
    scope: ['Gut renovation', 'Steel beam and open plan', 'Custom millwork', 'Radiant floors'],
    investment: '$480k to $560k',
    summary: 'Three small rooms became one bright floor that opens to the garden on two sides.',
    brief: 'Open the main floor without losing the warmth of an older house, and make winter mornings feel bright.',
    approach: 'A single flush steel beam replaced two bearing walls. Floor-to-ceiling oak frames and a plaster fireplace give the room its anchor.',
    outcome: 'A main floor that is one room in summer and three zones in winter, with radiant heat under limestone tile.',
  },
  {
    slug: 'carlaw-basement',
    title: 'Carlaw Lower Level',
    neighbourhood: 'Leslieville',
    type: 'Basements',
    year: 2026,
    duration: '14 weeks',
    scope: ['Underpinning', 'Waterproofing', 'Media room', 'Fluted oak wall'],
    investment: '$140k to $180k',
    summary: 'A 6-foot basement lowered to 8 feet and finished as the family room the main floor never had.',
    brief: 'Gain real ceiling height, keep it dry for good, and make a room teenagers would actually choose to use.',
    approach: 'Bench footings and interior drainage before anything pretty. Then a slatted oak feature wall that hides storage and the panel.',
    outcome: 'A warm, dry lower level with a linear fireplace, flush pot lights and a clear 8-foot ceiling.',
  },
  {
    slug: 'wychwood-kitchen',
    title: 'Wychwood Kitchen',
    neighbourhood: 'Wychwood',
    type: 'Kitchens',
    year: 2025,
    duration: '10 weeks',
    scope: ['Kitchen layout', 'Inset cabinetry', 'Quartz and zellige', 'Oak flooring'],
    investment: '$95k to $120k',
    summary: 'A cramped galley turned into an L-shaped kitchen with a window you can actually cook beside.',
    brief: 'More counter, more light and storage for a family that cooks every night.',
    approach: 'Moving the sink under a widened window freed a full run of counter. Deep charcoal lowers and open oak shelves keep it calm.',
    outcome: 'Twice the prep space in the same footprint, with every appliance on one working wall.',
    portrait: true,
  },
  {
    slug: 'roncesvalles-ensuite',
    title: 'Roncesvalles Ensuite',
    neighbourhood: 'Roncesvalles',
    type: 'Bathrooms',
    year: 2026,
    duration: '7 weeks',
    scope: ['Primary ensuite', 'Curbless shower', 'Freestanding tub', 'Microcement walls'],
    investment: '$70k to $90k',
    summary: 'A spare bedroom given up for an ensuite with a curbless shower and a tub under the window.',
    brief: 'A primary bathroom that feels like a quiet room, not a fixture catalogue.',
    approach: 'Seamless microcement, one timber wall and lighting hidden in the ceiling reveal. The floor drops 10 mm into a linear drain.',
    outcome: 'A calm, step-free ensuite with heated floors and a walnut vanity built in our shop.',
  },
  {
    slug: 'junction-lounge',
    title: 'Junction Lounge',
    neighbourhood: 'The Junction',
    type: 'Basements',
    year: 2025,
    duration: '9 weeks',
    scope: ['Basement finish', 'Library wall', 'Wet bar', 'Sound insulation'],
    investment: '$85k to $110k',
    summary: 'A dark lounge with a library wall, built for records, books and loud friends.',
    brief: 'A moody lower level for listening to music, with soundproofing so the house stays quiet upstairs.',
    approach: 'Resilient channel and two layers of drywall under a deep navy ceiling. Built-in shelving frames the fireplace.',
    outcome: 'A room that sounds as good as it looks, and a bedroom above that never hears it.',
  },
  {
    slug: 'long-branch-kitchen',
    title: 'Long Branch Galley',
    neighbourhood: 'Long Branch',
    type: 'Kitchens',
    year: 2024,
    duration: '8 weeks',
    scope: ['Galley kitchen', 'Integrated appliances', 'Walnut veneer', 'Garden doors'],
    investment: '$80k to $100k',
    summary: 'A long, narrow kitchen that leads the eye straight out to the garden.',
    brief: 'Make a long, thin room feel deliberate instead of cramped.',
    approach: 'Handleless walnut on one side, a single stone counter on the other, and new glass doors at the end of the run.',
    outcome: 'A galley that feels like a corridor to the garden, with every appliance hidden behind matching panels.',
    portrait: true,
  },
  {
    slug: 'annex-open-plan',
    title: 'Annex Open Plan',
    neighbourhood: 'The Annex',
    type: 'Whole home',
    year: 2024,
    duration: '6 months',
    scope: ['Open stair', 'Main floor reconfiguration', 'Steel and glass guard', 'Lighting design'],
    investment: '$320k to $400k',
    summary: 'A closed Victorian stair opened up so light from the back windows reaches the front door.',
    brief: 'Connect the front and back of a deep Victorian without losing its character.',
    approach: 'An open stair with a glass guard and oak treads replaces the walled-in original, and the living room flows into the kitchen.',
    outcome: 'One continuous main floor with sightlines from the porch to the garden.',
  },
]

export const projectTypes: ProjectType[] = ['Kitchens', 'Bathrooms', 'Basements', 'Whole home', 'Additions']

export const services = [
  {
    key: 'kitchens',
    title: 'Kitchens',
    line: 'Layouts that fit how you actually cook.',
    detail: 'Layout planning, custom and semi-custom cabinetry, stone, tile, lighting and appliance coordination.',
    from: 'From $60k',
    image: '/images/projects/wychwood-kitchen-detail-1.webp',
  },
  {
    key: 'bathrooms',
    title: 'Bathrooms',
    line: 'Quiet rooms, built to stay dry.',
    detail: 'Ensuites, family bathrooms and powder rooms, with full waterproofing systems and curbless showers.',
    from: 'From $30k',
    image: '/images/projects/roncesvalles-ensuite-detail-1.webp',
  },
  {
    key: 'basements',
    title: 'Basements',
    line: 'Height, dryness, then comfort.',
    detail: 'Underpinning, waterproofing, legal secondary suites and finished family rooms.',
    from: 'From $65k',
    image: '/images/projects/carlaw-basement-detail-2.webp',
  },
  {
    key: 'whole-home',
    title: 'Whole-home renovations',
    line: 'One team from drawings to keys.',
    detail: 'Structural changes, open plans, new mechanical systems and full interior rebuilds.',
    from: 'From $230k',
    image: '/images/projects/beach-hill-home-detail-1.webp',
  },
  {
    key: 'additions',
    title: 'Additions',
    line: 'More room without leaving the street you love.',
    detail: 'Rear, side and third-storey additions, including permits and committee of adjustment.',
    from: 'From $170k',
    image: '/images/projects/riverdale-infill-detail-1.webp',
  },
]

export const process = [
  { n: '01', title: 'Walkthrough', time: 'Week 1', text: 'We visit, measure and listen. You leave with a written summary of what we heard and a realistic budget range.' },
  { n: '02', title: 'Design', time: 'Weeks 2 to 6', text: 'Measured drawings, 3D views and a material board. Nothing is priced until you have seen it.' },
  { n: '03', title: 'Fixed price', time: 'Week 7', text: 'A line-by-line fixed quote, a schedule and the permit plan. No allowances hiding the real number.' },
  { n: '04', title: 'Build', time: 'On schedule', text: 'One site lead from demolition to final clean, a shared schedule and a weekly update every Friday.' },
  { n: '05', title: 'Handover', time: 'Last day', text: 'Walkthrough, deficiency list and a 2-year workmanship warranty, in writing.' },
]

export const commitments = [
  ['Fixed-price contracts', 'Your quote is the price. Changes are written up and priced before work starts.'],
  ['One site lead', 'The same person runs your job every day, from demolition to final clean.'],
  ['Friday updates', 'Photos, progress and next week’s plan in your inbox every Friday.'],
  ['2-year warranty', 'Workmanship warranty in writing, on top of manufacturer warranties.'],
]
