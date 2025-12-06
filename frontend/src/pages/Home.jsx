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
            <div className="text-xl sm:text-2xl font-bold text-primary">SupplyChain</div>
            
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
            Blockchain-Powered Supply Chain Transparency
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-text-light mb-10 sm:mb-14 leading-relaxed max-w-3xl mx-auto">
            Track products from manufacturer to customer with immutable blockchain records, 
            batch-level NFTs, and zero-knowledge proof verification.
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
              Verify Product
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 sm:mt-28 lg:mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Batch NFT Minting</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Create batches of products and mint ERC-721 NFTs for immutable ownership records.
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-premium/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-premium/20 transition-colors">
              <svg className="w-7 h-7 text-premium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Zero-Knowledge Proofs</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Verify product authenticity with privacy-preserving ZK proofs without revealing sensitive data.
            </p>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success/20 transition-colors">
              <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text mb-4">Complete Traceability</h3>
            <p className="text-text-light leading-relaxed text-[15px]">
              Track every transfer and location change through the entire supply chain journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}