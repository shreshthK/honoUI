import { useState } from 'react'
import { Link } from 'react-router-dom'

interface ShortenedUrl {
  code: string
  shortUrl: string
  originalUrl: string
  expiresAt: string | null
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    setShortenedUrl(null)
    setShowSuccess(false)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to shorten URL')
      }

      const data: ShortenedUrl = await response.json()
      setShortenedUrl(data)
      setShowSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      await navigator.clipboard.writeText(shortenedUrl.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-block floating mb-6">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl gradient-text">
            SNIP.IT
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] text-lg md:text-xl font-mono">
          Make your links short & sweet
        </p>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-300 shape-blob opacity-30 blur-2xl" />
      <div className="absolute top-40 right-10 w-40 h-40 bg-gradient-to-br from-cyan-300 to-blue-300 shape-blob opacity-30 blur-2xl" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-orange-300 to-yellow-300 shape-blob opacity-30 blur-2xl" style={{ animationDelay: '-4s' }} />

      {/* URL Shortener Card */}
      <div className="card p-8 md:p-12 max-w-2xl mx-auto relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[var(--primary-purple)] font-mono text-sm mb-3 font-semibold tracking-wide">
              PASTE YOUR LONG URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-super-long-url-goes-here.com/..."
                className="input-field w-full px-5 py-4 text-[var(--text-primary)] font-mono text-base placeholder-gray-400"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary-purple)] opacity-50">
                <LinkIcon />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary font-display text-xl md:text-2xl py-4 md:py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <Spinner /> Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <ScissorsIcon /> Snip It!
              </span>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-8 bg-red-50 border-2 border-red-300 rounded-2xl p-5 text-red-600 font-mono">
            {error}
          </div>
        )}

        {/* Result */}
        {shortenedUrl && (
          <div className={`mt-8 ${showSuccess ? 'success-bounce' : ''}`}>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-[var(--primary-purple)] rounded-2xl p-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--primary-green)] text-2xl">
                    <CheckIcon />
                  </span>
                  <span className="font-mono text-lg md:text-xl text-[var(--text-primary)]">
                    <span className="text-[var(--primary-pink)] font-bold">{shortenedUrl.shortUrl}</span>
                  </span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="copy-btn flex items-center gap-2 bg-white hover:bg-gray-50 px-5 py-3 rounded-xl font-mono text-sm border border-gray-200"
                >
                  {copied ? (
                    <>
                      <CheckIcon /> Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <Link
                  to={`/stats/${shortenedUrl.code}`}
                  className="inline-flex items-center gap-2 text-[var(--primary-purple)] hover:text-[var(--primary-pink)] font-mono text-sm transition-colors"
                >
                  <ChartIcon />
                  View Stats for this link
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats CTA */}
      <div className="text-center mt-12">
        <Link
          to="/stats"
          className="inline-flex items-center gap-2 text-[var(--primary-purple)] hover:text-[var(--primary-pink)] font-mono transition-colors"
        >
          <ChartIcon />
          Look Up Link Statistics
          <ArrowRightIcon />
        </Link>
      </div>
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

function ScissorsIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}
