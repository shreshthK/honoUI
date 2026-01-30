import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Stats from './pages/Stats'
import './App.css'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen mesh-bg gradient-bg">
      {/* Navigation */}
      <nav className="relative z-20 max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-2xl gradient-text hover:opacity-80 transition-opacity">
            SNIP.IT
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`nav-link font-mono text-sm ${location.pathname === '/' ? 'active text-[var(--primary-purple)]' : 'text-[var(--text-secondary)]'}`}
            >
              Home
            </Link>
            <Link
              to="/stats"
              className={`nav-link font-mono text-sm ${location.pathname.startsWith('/stats') ? 'active text-[var(--primary-purple)]' : 'text-[var(--text-secondary)]'}`}
            >
              Statistics
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8">
        <p className="font-mono text-[var(--text-secondary)] text-sm">
          Built with <span className="text-[var(--primary-pink)]">&hearts;</span> and colorful gradients
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/stats/:code" element={<Stats />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
