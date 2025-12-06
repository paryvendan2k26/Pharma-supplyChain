import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Layout({ children }) {
  const [user, setUser] = useState(null)
  const [openMobile, setOpenMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [token, navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function getDashboardPath(userRole) {
    const roleMap = { manufacturer: '/manufacturer', distributor: '/distributor', warehouse: '/warehouse', retailer: '/retailer' }
    return roleMap[userRole] || '/manufacturer'
  }

  if (!token) return null

  return (
    <div className="min-h-screen bg-bg">
      <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={user ? getDashboardPath(user.role) : '/'} className="text-lg sm:text-xl font-semibold text-primary">SupplyChain</Link>

            <div className="hidden md:flex items-center gap-6">
              {user && (
                <>
                  <Link to={getDashboardPath(user.role)} className="text-text-light hover:text-text">Dashboard</Link>
                  <Link to="/verify" className="text-text-light hover:text-text">Verify Product</Link>

                  <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="text-right hidden lg:block">
                      <div className="text-sm font-medium text-text">{user.name || 'User'}</div>
                      <div className="text-xs text-text-light capitalize">{user.role}</div>
                    </div>

                    <button onClick={handleLogout}
                      className="px-4 py-2 text-sm font-semibold text-text-light hover:text-text hover:bg-bg rounded-xl transition border-2 border-border hover:border-primary/40">
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {user && (
              <button onClick={() => setOpenMobile(v => !v)} className="md:hidden p-2 rounded-lg text-text hover:bg-bg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {openMobile ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>

          {user && openMobile && (
            <div className="md:hidden border-t border-border py-4 animate-in slide-in-from-top duration-200">
              <div className="flex flex-col gap-3">
                <Link to={getDashboardPath(user.role)} onClick={() => setOpenMobile(false)} className="px-2 py-2">Dashboard</Link>
                <Link to="/verify" onClick={() => setOpenMobile(false)} className="px-2 py-2">Verify Product</Link>

                <div className="border-t border-border pt-4 mt-2">
                  <div className="px-2 py-2 mb-3">
                    <div className="text-sm font-medium text-text">{user.name || 'User'}</div>
                    <div className="text-xs text-text-light capitalize">{user.role}</div>
                  </div>
                  <button onClick={() => { handleLogout(); setOpenMobile(false) }}
                    className="w-full text-left px-2 py-2 text-sm text-text-light hover:text-text hover:bg-bg rounded-lg">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-surface rounded w-48 mb-4" />
            <div className="h-40 bg-surface rounded" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
