// components/sections/Destinations.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

const GROUPS = [
  ['all', 'All'],
  ['savannah', 'Savannah'],
  ['rift', 'Rift Valley'],
  ['north', 'North'],
  ['coast', 'Coast'],
] as const

type GroupKey = (typeof GROUPS)[number][0]

const DESTINATIONS = [
  {
    n: 'Maasai Mara',
    r: 'Southwest Kenya',
    g: 'savannah',
    best: 'July to October',
    img: '/images/destinations/maasai-mara.jpg',
    d: 'The Great Migration and the Big Five in Africa’s most famous reserve.',
    see: 'Lions, cheetahs, wildebeest',
  },
  {
    n: 'Amboseli',
    r: 'Southern Kenya',
    g: 'savannah',
    best: 'June to October',
    img: '/images/destinations/amboseli.jpg',
    d: 'Iconic views of Mount Kilimanjaro and large herds of elephants.',
    see: 'Elephants, buffalo, hippos',
  },
  {
    n: 'Tsavo',
    r: 'Southeast Kenya',
    g: 'savannah',
    best: 'May to September',
    img: '/images/destinations/tsavo.jpg',
    d: 'Kenya’s largest park, known for its red elephants and wide skies.',
    see: 'Red elephants, lions, leopards',
  },
  {
    n: 'Samburu',
    r: 'Northern Kenya',
    g: 'north',
    best: 'June to October',
    img: '/images/destinations/samburu.jpg',
    d: 'Dry northern country with species you won’t see in the south.',
    see: 'Grevy’s zebra, reticulated giraffe, Somali ostrich',
  },
  {
    n: 'Lake Nakuru',
    r: 'Great Rift Valley',
    g: 'rift',
    best: 'November to April',
    img: '/images/destinations/lake-nakuru.jpg',
    d: 'A soda lake famous for flamingos, with a rhino sanctuary.',
    see: 'Flamingos, rhinos, lions',
  },
  {
    n: 'Diani Beach',
    r: 'Kenyan coast',
    g: 'coast',
    best: 'December to March',
    img: '/images/destinations/diani.jpg',
    d: 'White sand and turquoise Indian Ocean, the easy way to end a safari.',
    see: 'Marine life, dolphins, sea turtles',
  },
] as const

const Destinations = () => {
  const [activeGroup, setActiveGroup] = useState<GroupKey>('all')

  const filtered =
    activeGroup === 'all'
      ? DESTINATIONS
      : DESTINATIONS.filter((d) => d.g === activeGroup)

  return (
    <section
      className="py-10 sm:py-14 md:py-16 lg:py-24 bg-[#FAF2EB] text-[#2A1810]"
      id="destinations"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Desktop: vertical filter rail + content. Mobile: stacked. */}
        <div className="grid grid-cols-1 lg:grid-cols-[56px_1fr] gap-4 lg:gap-8 items-start">
          {/* Vertical sidebar filters (desktop) */}
          <aside
            className="hidden lg:flex flex-col gap-5 sticky top-6 pt-2"
            aria-label="Filter destinations by region"
          >
            {GROUPS.map(([k, label]) => {
              const isActive = k === activeGroup
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setActiveGroup(k)}
                  aria-pressed={isActive}
                  className={`[writing-mode:vertical-rl] [transform:rotate(180deg)] min-h-[44px] px-3 py-2 text-sm font-semibold transition-colors text-left rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B] ${
                    isActive
                      ? 'text-[#C97A2B]'
                      : 'text-[#2A1810]/50 hover:text-[#2A1810]'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </aside>

          <div className="min-w-0">
            {/* Horizontal chips (mobile/tablet) */}
            <div
              className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-5 -mx-4 px-4 scrollbar-none"
              role="group"
              aria-label="Filter destinations by region"
            >
              {GROUPS.map(([k, label]) => {
                const isActive = k === activeGroup
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActiveGroup(k)}
                    aria-pressed={isActive}
                    className={`flex-none px-4 py-2.5 rounded-full text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C97A2B] ${
                      isActive
                        ? 'bg-[#2A1810] text-[#FAF2EB]'
                        : 'bg-white/70 text-[#2A1810] hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Header — h2 because hero owns h1 on the page */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-serif text-[clamp(2rem,7vw,4.6rem)] font-bold leading-[1.1] tracking-tight">
                Discover <em className="font-normal text-[#C97A2B]">Kenya</em> and beyond
              </h2>
              <p className="max-w-[46ch] mt-3 sm:mt-4 text-[#2A1810]/75 text-sm sm:text-base md:text-lg leading-relaxed">
                Safaris led by local guides, from the Mara plains to the Indian Ocean coast. Pick a place to see what’s there.
              </p>
            </div>

            {/* Destination rail */}
            <div
              className="flex gap-3 sm:gap-4 md:gap-[1.1rem] overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-none"
              role="list"
              aria-live="polite"
            >
              {filtered.length === 0 ? (
                <p className="text-[#2A1810]/60 text-sm py-8">
                  No destinations match this region yet.
                </p>
              ) : (
                filtered.map((d) => (
                  <article
                    key={d.n}
                    role="listitem"
                    className="relative flex-none snap-start w-[min(78vw,270px)] sm:w-[240px] md:w-[270px] aspect-[3/4] sm:aspect-auto sm:h-[380px] rounded-[24px] sm:rounded-[30px] overflow-hidden text-left text-white bg-gradient-to-br from-[#E5A663] to-[#7a4519] shadow-[0_14px_34px_rgba(42,24,16,0.2)] group cursor-pointer"
                  >
                    <Image
                      src={d.img}
                      alt={`${d.n}, ${d.r}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                      sizes="(max-width: 640px) 78vw, (max-width: 768px) 240px, 270px"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(42,24,16,0.88)] via-[rgba(42,24,16,0.1)] to-transparent" />

                    <div className="absolute left-4 right-4 bottom-4 sm:left-[1.1rem] sm:right-[1.1rem] sm:bottom-[1.1rem] z-10">
                      <h3 className="font-serif text-lg sm:text-[1.35rem] leading-[1.15] font-bold">
                        {d.n}
                      </h3>
                      <p className="text-xs opacity-85 mt-1">{d.r}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Destinations