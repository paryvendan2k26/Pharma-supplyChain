import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    password: '',
    walletAddress: '',
    role: 'manufacturer'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/register', formData)
      
      localStorage.setItem('token', data.token)
      
      // Redirect based on role
      const roleMap = {
        manufacturer: '/manufacturer',
        distributor: '/distributor',
        warehouse: '/warehouse',
        retailer: '/retailer'
      }
      
      navigate(roleMap[formData.role] || '/manufacturer')
    } catch (e) {
      setError(e?.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-surface rounded-2xl shadow-soft-lg border border-border p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
            <p className="text-base text-text-light">Join the supply chain network</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border-l-4 border-error rounded-lg">
              <p className="text-sm font-medium text-error">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-text mb-1.5">
                Company Name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                placeholder="Acme Corporation (optional)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
                Password <span className="text-error">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="walletAddress" className="block text-sm font-medium text-text mb-1.5">
                Wallet Address <span className="text-error">*</span>
              </label>
              <input
                id="walletAddress"
                name="walletAddress"
                type="text"
                required
                value={formData.walletAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface text-text placeholder-text-light font-mono text-sm"
                placeholder="0x..."
              />
              <p className="mt-1 text-xs text-text-light">Your Ethereum wallet address for blockchain transactions</p>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-text mb-1.5">
                Role <span className="text-error">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
              >
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="warehouse">Warehouse</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-light">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-primary font-semibold transition-colors underline-offset-2 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-text-light hover:text-text transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
