import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="bg-surface border-b border-border sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-primary">MediChain</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex gap-4 lg:gap-6 items-center">
              <Link to="/login" className="text-text-light hover:text-text text-sm sm:text-base font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-bg">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-primary-dark transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-text hover:bg-bg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-border py-4 animate-in slide-in-from-top duration-200">
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="text-text-light hover:text-text text-base font-medium transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-primary text-white rounded-xl text-base font-semibold hover:bg-primary-dark transition-all shadow-soft mx-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text mb-6 sm:mb-8 leading-[1.1] tracking-tight">
            Protecting Lives Through <span className="text-primary">Authentic Medicines</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-text-light mb-10 sm:mb-14 leading-relaxed max-w-3xl mx-auto">
            Combat counterfeit pharmaceuticals with blockchain-verified drug authentication. 
            Instant verification from manufacturer to patient ensures genuine, safe medications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-semibold text-base hover:bg-primary-dark transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 active:translate-y-0 min-w-[180px]"
            >
              Get Started
            </Link>
            <Link 
              to="/verify" 
              className="inline-flex items-center justify-center px-8 py-4 bg-surface border-2 border-border text-text rounded-xl font-semibold text-base hover:border-primary hover:bg-bg/50 transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 active:translate-y-0 min-w-[180px]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Medicine
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 sm:mt-28 lg:mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Drug Batch Verification</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Every pharmaceutical batch gets a unique blockchain certificate ensuring authenticity from production to dispensation.
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-premium/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
              <svg className="w-7 h-7 text-premium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">QR Code Scanning</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Patients and pharmacists can instantly verify medicine authenticity by scanning QR codes with any smartphone.
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
              <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Counterfeit Prevention</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Immutable blockchain records and tamper-proof verification make counterfeit drugs instantly detectable at any point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}