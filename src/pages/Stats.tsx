import { Link } from 'react-router-dom'

interface ShortenedUrl {
  id: string
  original: string
  short: string
  clicks: number
}

interface Stats {
  totalUrls: number
  totalClicks: number
  topUrls: ShortenedUrl[]
  clicksPerDay: { day: string; clicks: number }[]
}

// Mock data for demonstration
const stats: Stats = {
  totalUrls: 1247,
  totalClicks: 48392,
  topUrls: [
    { id: '1', original: 'https://github.com/anthropics/claude-code', short: 'snp.it/abc123', clicks: 8472 },
    { id: '2', original: 'https://docs.anthropic.com/claude', short: 'snp.it/xyz789', clicks: 6234 },
    { id: '3', original: 'https://react.dev/learn', short: 'snp.it/rct001', clicks: 4891 },
    { id: '4', original: 'https://tailwindcss.com/docs', short: 'snp.it/tw2024', clicks: 3456 },
    { id: '5', original: 'https://vitejs.dev/guide', short: 'snp.it/vte999', clicks: 2187 },
  ],
  clicksPerDay: [
    { day: 'Mon', clicks: 4200 },
    { day: 'Tue', clicks: 5800 },
    { day: 'Wed', clicks: 7200 },
    { day: 'Thu', clicks: 6100 },
    { day: 'Fri', clicks: 8900 },
    { day: 'Sat', clicks: 5400 },
    { day: 'Sun', clicks: 4800 },
  ]
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
  const maxClicks = Math.max(...stats.clicksPerDay.map(d => d.clicks))

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl gradient-text mb-4">
          Global Statistics
        </h1>
        <p className="text-[var(--text-secondary)] font-mono">
          Real-time insights into link performance
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          icon={<LinkIcon />}
          label="Total URLs Shortened"
          value={stats.totalUrls.toLocaleString()}
          color="pink"
        />
        <StatCard
          icon={<ClickIcon />}
          label="Total Clicks"
          value={stats.totalClicks.toLocaleString()}
          color="cyan"
        />
      </div>

      {/* Click Trends Chart */}
      <div className="card p-6 md:p-8 mb-10">
        <h2 className="font-display text-2xl md:text-3xl text-[var(--primary-purple)] mb-8">
          Weekly Click Trends
        </h2>
        <div className="flex items-end justify-between gap-3 md:gap-6 h-56 md:h-72">
          {stats.clicksPerDay.map((day, index) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-3 h-full">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full chart-bar relative group cursor-pointer"
                  style={{
                    height: `${(day.clicks / maxClicks) * 100}%`,
                    background: barColors[index],
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

      {/* Top URLs */}
      <div className="card p-6 md:p-8">
        <h2 className="font-display text-2xl md:text-3xl text-[var(--primary-orange)] mb-8 flex items-center gap-3">
          <TrophyIcon /> Top Performers
        </h2>
        <div className="space-y-4">
          {stats.topUrls.map((item, index) => (
            <div
              key={item.id}
              className="link-item bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-4">
                <span className={`font-display text-2xl ${getRankColor(index)}`}>
                  #{index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[var(--primary-purple)] text-sm md:text-base font-semibold">
                    {item.short}
                  </p>
                  <p className="font-mono text-[var(--text-secondary)] text-xs md:text-sm truncate max-w-xs md:max-w-md">
                    {item.original}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[var(--primary-pink)] ml-10 md:ml-0">
                <ClickIcon />
                <span className="text-lg md:text-xl font-bold">{item.clicks.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getRankColor(index: number): string {
  switch (index) {
    case 0: return 'text-yellow-500'
    case 1: return 'text-gray-400'
    case 2: return 'text-amber-600'
    default: return 'text-gray-300'
  }
}

// Stat Card Component
function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode
  label: string
  value: string
  color: 'pink' | 'cyan'
}) {
  const gradients = {
    pink: 'from-pink-50 to-purple-50 border-pink-200',
    cyan: 'from-cyan-50 to-blue-50 border-cyan-200',
  }
  const textColors = {
    pink: 'text-[var(--primary-pink)]',
    cyan: 'text-[var(--primary-cyan)]',
  }

  return (
    <div className={`stat-card card p-6 md:p-8 bg-gradient-to-br ${gradients[color]}`}>
      <div className="flex items-center gap-4 mb-4">
        <span className={`text-3xl ${textColors[color]}`}>{icon}</span>
        <span className="font-mono text-[var(--text-secondary)] text-sm tracking-wide">{label}</span>
      </div>
      <p className={`font-display text-4xl md:text-5xl ${textColors[color]}`}>
        {value}
      </p>
    </div>
  )
}

// Icons
function LinkIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}

function ClickIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
