import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ethers } from 'ethers'

export default function VerifyProduct() {
  const { productId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [verifying, setVerifying] = useState(false)

  async function fetchData() {
    if (!productId) {
      setLoading(false)
      return
    }
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}`)
      setData(data)
    } catch (e) {
      console.error('Error fetching product:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    fetchData() 
  }, [productId])

  async function verifyOwnership() {
    if (!window.ethereum) {
      alert('Please install MetaMask to verify ownership')
      return
    }

    setVerifying(true)
    setStatus('')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const abi = (await import('../contract/SupplyChainTracker.json')).default.abi
      const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, signer)
      const tx = await contract.verifyAsCustomer(Number(productId))
      await tx.wait()
      setStatus('success')
      fetchData()
    } catch (e) {
      setStatus('error')
      console.error('Verification error:', e)
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-light">Loading product information...</div>
      </div>
    )
  }

  if (!data || !data.onchain) {
    return (
      <div className="min-h-screen bg-bg">
        <nav className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl font-semibold text-primary">SupplyChain</Link>
              <Link to="/login" className="text-secondary hover:text-primary text-sm font-medium">Sign In</Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-text mb-4">Product Not Found</h1>
            <p className="text-text-light mb-6">The product ID you're looking for doesn't exist.</p>
            <Link to="/" className="text-primary hover:text-secondary font-medium">← Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  const { onchain, db, batch } = data
  const isAuthentic = onchain.isAuthentic && onchain.manufacturer !== '0x0000000000000000000000000000000000000000'

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="bg-surface border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-semibold text-primary hover:text-primary-dark transition-colors">SupplyChain</Link>
            <Link to="/login" className="text-text-light hover:text-text text-sm font-medium transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-text mb-2">Product Verification</h1>
          <p className="text-sm sm:text-base text-text-light">Verify the authenticity and trace the journey of this product</p>
        </div>

        {/* Verification Status */}
        <div className={`mb-6 p-4 rounded-xl border shadow-soft ${
          isAuthentic 
            ? 'bg-success/10 border-success/20' 
            : 'bg-error/10 border-error/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${isAuthentic ? 'text-success' : 'text-error'}`}>
              {isAuthentic ? '✓' : '✗'}
            </div>
            <div>
              <div className={`font-semibold ${isAuthentic ? 'text-success' : 'text-error'}`}>
                {isAuthentic ? 'Authentic Product' : 'Product Verification Failed'}
              </div>
              <div className="text-sm text-text-light mt-0.5">
                {isAuthentic 
                  ? 'This product has been verified on the blockchain'
                  : 'Unable to verify product authenticity'}
              </div>
            </div>
          </div>
        </div>

        {/* Product Information - PRIVATE MODE: Only show essential info */}
        <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 mb-6 shadow-soft">
          <h2 className="text-base sm:text-lg font-semibold text-text mb-4">Product Details</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-text-light mb-1">Product Name</div>
              <div className="text-text font-medium">{db?.name || 'N/A'}</div>
            </div>
            {db?.description && (
              <div>
                <div className="text-sm text-text-light mb-1">Description</div>
                <div className="text-text">{db.description}</div>
              </div>
            )}
            <div>
              <div className="text-sm text-text-light mb-1">Manufacture Date</div>
              <div className="text-text">{db?.manufactureDate ? new Date(db.manufactureDate).toLocaleDateString() : 'N/A'}</div>
            </div>
            {/* Show verification checkpoints count */}
            {onchain.history && onchain.history.length > 0 && (
              <div>
                <div className="text-sm text-text-light mb-1">Verification</div>
                <div className="text-text">
                  ✅ Authentic - Verified through {onchain.history.length + 1} checkpoints
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Verify Ownership Button */}
        {!onchain.verifiedByCustomer && (
          <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 shadow-soft">
            <h2 className="text-base sm:text-lg font-semibold text-text mb-4">Verify Ownership</h2>
            <p className="text-sm text-text-light mb-4">
              Connect your wallet to permanently verify this product. Once verified, the product cannot be transferred.
            </p>
            <button
              onClick={verifyOwnership}
              disabled={verifying}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify as Customer'
              )}
            </button>
            {status === 'success' && (
              <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg shadow-soft">
                <p className="text-sm text-success font-medium">Product verified successfully!</p>
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg shadow-soft">
                <p className="text-sm text-error font-medium">Verification failed. Product may already be verified.</p>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
            <Link to="/" className="text-accent hover:text-primary font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
