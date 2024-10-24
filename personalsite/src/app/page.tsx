'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const ArticleCard = ({ title, publication, index, url }: { title: string; publication: string; index: number; url: string }) => {
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const colors = ['#7333C6', '#C22A64', '#FF984D', '#4636FF']
  const color = colors[index % colors.length]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const points: { x: number; y: number; vy: number }[] = []
    const numPoints = 11
    for (let i = 0; i <= numPoints; i++) {
      points.push({
        x: (i / numPoints) * canvas.width,
        y: canvas.height,
        vy: Math.random() * 0.4 + 0.8
      })
    }

    points[0].x = 0
    points[numPoints].x = canvas.width

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / 300, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      points.forEach(point => {
        point.y = canvas.height - (canvas.height * progress * point.vy)
        point.y = Math.max(0, point.y)
      })

      ctx.moveTo(0, canvas.height)
      ctx.lineTo(0, points[0].y)
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }
      ctx.lineTo(canvas.width, points[points.length - 1].y)
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    if (isHovered) {
      startTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, color])

  return (
    
    <Link href={url} className="block h-full">
      <div 
        className="p-4 rounded-lg transition-all duration-300 ease-in-out 
                    bg-[#FFF9F4] border border-gray-200
                    group relative overflow-hidden h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative z-10">
          <h3 className="font-semibold mb-1 group-hover:text-white transition-colors duration-300">{title}</h3>
          <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-300">{publication}</p>
        </div>
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </Link>
  )
}

export default function Home() {
  const [typedText, setTypedText] = useState('')
  const fullText = `Hey, 👋
I'm a designer, engineer,
and civic organizer
who enjoys building cool stuff for
governments, non-profits, and biologists`

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        const newText = fullText.slice(0, i + 1)
        setTypedText(newText)
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  return (

    <div className="min-h-screen bg-[#FFF9F4] flex flex-col items-center py-[max(7vh,2.5rem)] px-[max(7vw,1.25rem)] font-sans text-gray-800">
      <div className="w-full max-w-[750px]">
        <header className="flex justify-between items-center mb-20 transition-all duration-1000 ease-out">
          <h1 className="text-3xl font-bold">Ryan Manthy</h1>
          <nav>
          <ul className="flex space-x-4">
        <li>
          <Link href="mailto:rmanthy@hawk.iit.edu" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link 
            href="https://drive.google.com/file/d/1PgV0hdBCOM9RsfHS7wdksxjg9ivQBYgB/view?usp=sharing" 
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </Link>
        </li>
      </ul>
          </nav>
        </header>

        <main className="space-y-20">
          <section className="transition-all duration-1000 ease-out delay-300">
          <div className="flex flex-col md:flex-row items-start mb-5">
            <div className="w-full flex justify-center md:w-auto">
              <Image src='/ryanmanthy_1.png' alt="Ryan Manthy Headshot" style={{ marginRight: '2rem' }} width={200} height={300} className="rounded-lg mb-4 md:mb-0 md:mr-4" priority />
            </div>
            <h2 className="text-3xl whitespace-pre-line">{typedText}</h2>
          </div>
            <div className="h-5" aria-hidden="true"></div>
            <p className="text-base">
              I'm in my last year studying <strong>computer science </strong> and <strong>biomedical engineering </strong>at Illinois Tech. Right now, I'm creating software to get out the vote 
              in Pennsylvania and Arizona with <Link href="https://www.new-voters.org" className="underline">New Voters</Link> and building <Link href="https://www.govgoose.com" className="underline">GovGoose</Link>, a RAG Model for searching state and local government sites.<br /><br />
              I've previously worked at the <Link href="https://www.chanzuckerberg.com" className="underline">Chan Zuckerberg Initiative</Link>, 
              <Link href="https://www.hhs.gov/ash/osm/innovationx/index.html" className="underline">U.S. Department of Health and Human Services</Link>, <Link href="https://kaplan.iit.edu" className="underline">Kaplan Institute</Link>, and Dom's Kitchen & Market <span className="italic">(Closed in 2024)</span>. I am a <strong>2022 Obama Chesky Voyager Scholar </strong>
              and 2024 Student Laureate for the <strong>Abraham Lincoln Civic Enagagement Award</strong>. <br /><br />
              My experience has spanned design, software engineering, and business development in government, healthcare, and biotechnology. <span className="italic">Available for Work Fall 2024</span>
            </p>
          </section>

          <hr className="border-t border-gray-300" />

          <section className="transition-all duration-1000 ease-out delay-500">
          <h2 className="text-2xl font-semibold mb-8">Projects and initiatives:</h2>
          <div className="space-y-6">
            {[
              { name: 'Youth Civic Hub', description: 'centralized civic information tool for NYC youth', partnerships: 'built in partnership with NYC Office of Public Engagement', url: 'https://www.youthcivichub.org/'  },
              { name: 'CELLxGENE Explorer', description: 'conducted a post-launch usability test of visualization tool', url: 'https://cellxgene.cziscience.com/e/61af564d-e5ea-4d34-a0f3-2668a00db376.cxg/' },
              { name: 'teen.vote', description: 'tool to run voter registration drives and engage young people in civics', views: '10k+ students engaged annually', url: 'https://www.teen.vote/pa' },
              { name: 'CancerX Data Sprint', description: 'proposed data sprint to promote interoperability of oncology data', url: 'https://cancerx.health/wp-content/uploads/2023/12/CancerX-Data-Sprint-I-New-Findings-Shared.pdf' },
            ].map((project) => (
              <Link href={project.url} key={project.name} className="block group hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <div className="flex flex-col sm:flex-row items-start">
                  <div className="font-semibold text-lg flex items-center w-full sm:w-56 shrink-0 mb-2 sm:mb-0">
                    {project.name}
                    <ArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex-grow">
                    <p>{project.description}</p>
                    {project.partnerships && <p className="text-gray-600 text-sm mt-1">{project.partnerships}</p>}
                    {project.views && <p className="text-gray-600 text-sm mt-1">{project.views}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

          <section className="transition-all duration-1000 ease-out delay-900">
            <h2 className="text-2xl font-semibold mb-5">Featured Press</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'NYC youth voter turnout is always low. Can this digital tool change that?', publication: 'The Gothamist', url: 'https://gothamist.com/news/nyc-youth-voter-turnout-is-always-low-can-this-digital-tool-change-that' },
                { title: 'Student Aims to Help Others Access Health Care Support Through Obama Foundation Scholarship', publication: 'Illinois Tech Today', url: 'https://www.iit.edu/news/drive-social-impact-student-aims-help-others-access-health-care-support-through-obama-foundation' },
                { title: 'Health IT Vendors to Support USCDI+ Cancer Data Elements', publication: 'Healthcare Innovation', url: 'https://www.hcinnovationgroup.com/interoperability-hie/standards/news/53098513/health-it-vendors-to-support-uscdi-cancer-data-elements' },
                { title: 'Thank You 2023 Civic Digital Fellows', publication: 'HHS', url: 'https://www.hhs.gov/blog/2023/09/06/thank-you-2023-civic-digital-fellows.html' },
              ].map((article, index) => (
                <ArticleCard key={article.title} title={article.title} publication={article.publication} index={index} url={article.url} />
              ))}
            </div>
          </section>

          <section className="transition-all duration-1000 ease-out delay-1100">
            <h2 className="text-2xl font-semibold mb-5">Get in Touch</h2>
            <p>
              Feel free to reach out to me at{' '}
              <a href="mailto:hello@ryanmanthy.com" className="text-blue-600 hover:underline">
                hello [at] ryanmanthy [dot] com
              </a>
            </p>
          </section>

          <section className="transition-all duration-1000 ease-out delay-1300">
            <h2 className="text-2xl font-semibold mb-5">Socials</h2>
            <div className="space-y-2">
              {[
                { platform: 'GitHub', username: 'ryanmanthy', url: 'https://github.com/ryanmanthy' },
                { platform: 'LinkedIn', username: 'ryanmanthy', url: 'https://linkedin.com/in/ryanmanthy' },
              ].map((social) => (
                <div key={social.platform} className="flex items-center">
                  <span className="w-24">{social.platform}</span>
                  <span className="flex-grow border-b border-gray-300 mx-2" aria-hidden="true"></span>
                  <Link href={social.url} className="hover:underline">
                    {social.username}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <footer className="mt-20 text-center text-gray-500 transition-all duration-1000 ease-out delay-1500">
        <p>&copy; Site created by Ryan Manthy.</p>
      </footer>
    </div>

  )
}