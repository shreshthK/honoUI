import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

interface LinkStats {
  code: string
  originalUrl: string
  createdAt: string
  expiresAt: string | null
  clickCount: number
}

interface ClickEvent {
  id: string
  linkId: string
  clickedAt: string
  userAgent: string | null
  referer: string | null
  ipHash: string | null
}

interface EventsResponse {
  code: string
  events: ClickEvent[]
}

interface DayClicks {
  day: string
  date: string
  clicks: number
}

const barColors = [
  'linear-gradient(to top, #fce7f3, #ec4899)',
  'linear-gradient(to top, #e0e7ff, #8b5cf6)',
  'linear-gradient(to top, #cffafe, #06b6d4)',
  'linear-gradient(to top, #fef3c7, #f59e0b)',
  'linear-gradient(to top, #fce7f3, #ec4899)',
  'linear-gradient(to top, #d1fae5, #10b981)',
  'linear-gradient(to top, #ffedd5, #f97316)',
]

export default function StatsPage() {
  const { code: urlCode } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [inputCode, setInputCode] = useState(urlCode || '')
  const [linkStats, setLinkStats] = useState<LinkStats | null>(null)
  const [events, setEvents] = useState<ClickEvent[]>([])
  const [clicksPerDay, setClicksPerDay] = useState<DayClicks[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (urlCode) {
      setInputCode(urlCode)
      fetchStats(urlCode)
    }
  }, [urlCode])

  const fetchStats = async (code: string) => {
    setIsLoading(true)
    setError(null)
    setLinkStats(null)
    setEvents([])
    setClicksPerDay([])

    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const [statsResponse, eventsResponse] = await Promise.all([
        fetch(`${apiUrl}/api/links/${code}`),
        fetch(`${apiUrl}/api/links/${code}/events`),
      ])

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json()
        throw new Error(errorData.error || 'Link not found')
      }

      const stats: LinkStats = await statsResponse.json()
      setLinkStats(stats)

      if (eventsResponse.ok) {
        const eventsData: EventsResponse = await eventsResponse.json()
        setEvents(eventsData.events)
        setClicksPerDay(aggregateClicksByDay(eventsData.events))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const aggregateClicksByDay = (events: ClickEvent[]): DayClicks[] => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const clicksByDate: Record<string, number> = {}

    events.forEach((event) => {
      const date = new Date(event.clickedAt).toISOString().split('T')[0]
      clicksByDate[date] = (clicksByDate[date] || 0) + 1
    })

    const sortedDates = Object.keys(clicksByDate).sort()
    const last7Days = sortedDates.slice(-7)

    return last7Days.map((date) => {
      const d = new Date(date)
      return {
        day: dayNames[d.getDay()],
        date,
        clicks: clicksByDate[date],
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    navigate(`/stats/${inputCode.trim()}`)
  }

  const maxClicks = clicksPerDay.length > 0
    ? Math.max(...clicksPerDay.map((d) => d.clicks))
    : 0

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl gradient-text mb-4">
          Link Statistics
        </h1>
        <p className="text-[var(--text-secondary)] font-mono">
          View detailed analytics for your shortened links
        </p>
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[var(--primary-purple)] hover:text-[var(--primary-pink)] font-mono mb-8 transition-colors"
      >
        <ArrowLeftIcon />
        Back to Shortener
      </Link>

      {/* Search Form */}
      <div className="card p-6 md:p-8 mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[var(--primary-purple)] font-mono text-sm mb-2 font-semibold">
              ENTER LINK CODE
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g., abc123"
              className="input-field w-full px-5 py-4 text-[var(--text-primary)] font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-8 py-4 rounded-xl font-mono self-end disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Look Up'}
          </button>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="card p-6 mb-10 bg-red-50 border-red-200">
          <p className="text-red-600 font-mono text-center">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="card p-12 text-center">
          <div className="inline-block animate-spin text-[var(--primary-purple)]">
            <SpinnerIcon />
          </div>
          <p className="mt-4 text-[var(--text-secondary)] font-mono">Loading statistics...</p>
        </div>
      )}

      {/* Stats Display */}
      {linkStats && !isLoading && (
        <>
          {/* Link Info Card */}
          <div className="card p-6 md:p-8 mb-10">
            <h2 className="font-display text-2xl text-[var(--primary-purple)] mb-6">
              Link Details
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-mono text-sm text-[var(--text-secondary)]">Short URL</span>
                <p className="font-mono text-lg text-[var(--primary-pink)] font-semibold">
                  /{linkStats.code}
                </p>
              </div>
              <div>
                <span className="font-mono text-sm text-[var(--text-secondary)]">Original URL</span>
                <p className="font-mono text-base text-[var(--text-primary)] break-all">
                  {linkStats.originalUrl}
                </p>
              </div>
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">Created</span>
                  <p className="font-mono text-base text-[var(--text-primary)]">
                    {new Date(linkStats.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {linkStats.expiresAt && (
                  <div>
                    <span className="font-mono text-sm text-[var(--text-secondary)]">Expires</span>
                    <p className="font-mono text-base text-[var(--text-primary)]">
                      {new Date(linkStats.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card p-6 md:p-8 mb-10 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl text-[var(--primary-cyan)]">
                <ClickIcon />
              </span>
              <span className="font-mono text-[var(--text-secondary)] text-sm tracking-wide">
                Total Clicks
              </span>
            </div>
            <p className="font-display text-5xl md:text-6xl text-[var(--primary-cyan)]">
              {linkStats.clickCount.toLocaleString()}
            </p>
          </div>

          {/* Click Trends Chart */}
          {clicksPerDay.length > 0 && (
            <div className="card p-6 md:p-8 mb-10">
              <h2 className="font-display text-2xl md:text-3xl text-[var(--primary-purple)] mb-8">
                Click Trends
              </h2>
              <div className="flex items-end justify-between gap-3 md:gap-6 h-56 md:h-72">
                {clicksPerDay.map((day, index) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-3 h-full">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full chart-bar relative group cursor-pointer rounded-t-lg"
                        style={{
                          height: `${maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0}%`,
                          minHeight: day.clicks > 0 ? '8px' : '0',
                          background: barColors[index % barColors.length],
                          boxShadow: '0 4px 15px -3px rgba(0,0,0,0.1)',
                        }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-gray-100">
                          {day.clicks.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-[var(--text-secondary)]">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Events */}
          {events.length > 0 && (
            <div className="card p-6 md:p-8">
              <h2 className="font-display text-2xl md:text-3xl text-[var(--primary-orange)] mb-8">
                Recent Clicks
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.slice(0, 20).map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-2"
                  >
                    <div className="font-mono text-sm text-[var(--text-primary)]">
                      {new Date(event.clickedAt).toLocaleString()}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-[var(--text-secondary)]">
                      {event.referer && (
                        <span className="truncate max-w-xs" title={event.referer}>
                          From: {event.referer}
                        </span>
                      )}
                      {event.userAgent && (
                        <span className="truncate max-w-xs" title={event.userAgent}>
                          {parseUserAgent(event.userAgent)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State for Events */}
          {events.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-[var(--text-secondary)] font-mono">
                No click events recorded yet. Share your link to start tracking!
              </p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!linkStats && !isLoading && !error && !urlCode && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-6">
            <ChartIcon />
          </div>
          <p className="text-[var(--text-secondary)] font-mono">
            Enter a link code above to view its statistics
          </p>
        </div>
      )}
    </div>
  )
}

function parseUserAgent(ua: string): string {
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Edge')) return 'Edge'
  return 'Browser'
}

// Icons
function ClickIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
