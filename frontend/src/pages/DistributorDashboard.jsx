import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import PartnershipManager from '../components/PartnershipManager'
import ProductsBySender from '../components/ProductsBySender'

export default function DistributorDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('transfer')
  const [transferData, setTransferData] = useState({
    productId: '',
    toAddress: '',
    location: '',
    quantity: 1
  })
  const [transferResult, setTransferResult] = useState(null)
  const [batches, setBatches] = useState([])
  const [transferBatchData, setTransferBatchData] = useState({
    batchId: '',
    toAddress: '',
    location: ''
  })
  const [transferBatchLoading, setTransferBatchLoading] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchProducts()
    fetchBatches()
  }, [])

  async function fetchBatches() {
    if (!token) return
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/products/batch/list', { 
        headers: { Authorization: 'Bearer ' + token } 
      })
      setBatches(data)
    } catch (e) {
      console.error('Error fetching batches:', e)
    }
  }

  async function fetchProducts() {
    if (!token) return
    try {
      const { data } = await axios.get(import.meta.env.VITE_API_URL + '/api/products', { 
        headers: { Authorization: 'Bearer ' + token } 
      })
      setProducts(data)
    } catch (e) {
      console.error('Error fetching products:', e)
    }
  }

  async function handleTransfer(e) {
    e.preventDefault()
    if (!transferData.productId || !transferData.toAddress) {
      alert('Please fill in product ID and recipient address')
      return
    }

    setLoading(true)
    setTransferResult(null)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${transferData.productId}/transfer`,
        { 
          toAddress: transferData.toAddress, 
          location: transferData.location,
          quantity: parseInt(transferData.quantity) || 1
        },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setTransferResult(data)
      setTransferData({ productId: '', toAddress: '', location: '', quantity: 1 })
      setTimeout(() => setTransferResult(null), 10000)
      fetchProducts()
    } catch (e) {
      alert('Transfer failed: ' + (e.response?.data?.error || e.message))
    } finally {
      setLoading(false)
    }
  }

  async function handleBatchTransfer(e) {
    e.preventDefault()
    if (!transferBatchData.batchId || !transferBatchData.toAddress) {
      alert('Please fill in batch ID and recipient address')
      return
    }

    if (!confirm(`Transfer entire batch ${transferBatchData.batchId}? This will transfer all products in the batch.`)) {
      return
    }

    setTransferBatchLoading(true)
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/batch/${transferBatchData.batchId}/transfer`,
        { 
          toAddress: transferBatchData.toAddress, 
          location: transferBatchData.location
        },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      alert(data.message || 'Batch transferred successfully!')
      setTransferBatchData({ batchId: '', toAddress: '', location: '' })
      fetchProducts()
      fetchBatches()
    } catch (e) {
      alert('Batch transfer failed: ' + (e.response?.data?.error || e.message))
    } finally {
      setTransferBatchLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text mb-2">Distributor Dashboard</h1>
          <p className="text-sm sm:text-base text-text-light">Manage product distribution and transfers</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto -mx-4 sm:mx-0">
          <nav className="flex gap-1 px-4 sm:px-0 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'transfer'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              Transfer
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('by-sender')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'by-sender'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              By Sender
            </button>
            <button
              onClick={() => setActiveTab('partnerships')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'partnerships'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              Partnerships
            </button>
          </nav>
        </div>

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <>
        {/* Batch Transfer Form */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
          <h2 className="text-lg sm:text-xl font-bold text-text mb-6">Transfer Entire Batch</h2>
          <form onSubmit={handleBatchTransfer} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Batch ID</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text font-mono text-sm transition-all"
                  placeholder="Batch ID"
                  value={transferBatchData.batchId}
                  onChange={e => setTransferBatchData({...transferBatchData, batchId: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Recipient Address</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text font-mono text-sm transition-all"
                  placeholder="0x..."
                  value={transferBatchData.toAddress}
                  onChange={e => setTransferBatchData({...transferBatchData, toAddress: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Location (Optional)</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                  placeholder="Destination location"
                  value={transferBatchData.location}
                  onChange={e => setTransferBatchData({...transferBatchData, location: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={transferBatchLoading}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {transferBatchLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Transferring Batch...
                </span>
              ) : (
                'Transfer Entire Batch'
              )}
            </button>
            <p className="text-xs text-text-light">
              This will transfer all products in the batch to the recipient address
            </p>
          </form>
        </div>

        {/* Transfer Form */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
          <h2 className="text-lg sm:text-xl font-bold text-text mb-6">Transfer Product</h2>
          <form onSubmit={handleTransfer} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Product ID</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text font-mono text-sm transition-all"
                  placeholder="Product blockchain ID"
                  value={transferData.productId}
                  onChange={e => setTransferData({...transferData, productId: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Recipient Address</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text font-mono text-sm transition-all"
                  placeholder="0x..."
                  value={transferData.toAddress}
                  onChange={e => setTransferData({...transferData, toAddress: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                  placeholder="1"
                  value={transferData.quantity}
                  onChange={e => setTransferData({...transferData, quantity: Math.max(1, Math.min(50, parseInt(e.target.value) || 1))})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-2">Location (Optional)</label>
                <input
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                  placeholder="Destination location"
                  value={transferData.location}
                  onChange={e => setTransferData({...transferData, location: e.target.value})}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Transferring...
                </span>
              ) : (
                `Transfer ${transferData.quantity} Product(s)`
              )}
            </button>
          </form>
          
          {/* Transfer Result with Manufacturer Info */}
          {transferResult && (
            <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg shadow-soft">
              <p className="text-sm font-medium text-success mb-2">{transferResult.message}</p>
              {transferResult.manufacturer && (
                <div className="text-sm text-text-light">
                  <div className="font-medium text-text mt-2">Manufacturer Details:</div>
                  <div>Name: {transferResult.manufacturer.name || 'N/A'}</div>
                  {transferResult.manufacturer.companyName && (
                    <div>Company: {transferResult.manufacturer.companyName}</div>
                  )}
                  <div className="font-mono text-xs mt-1">Address: {transferResult.manufacturer.address}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-soft">
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-bg/50">
            <h2 className="text-base sm:text-lg font-semibold text-text">Your Products</h2>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-bg">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ID</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Batch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 sm:px-6 py-8 text-center text-text-light">
                          No products in your inventory yet.
                        </td>
                      </tr>
                    ) : (
                      products.map(p => (
                        <tr key={p._id} className="hover:bg-bg transition-colors">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-text">{p.uniqueProductId || p.blockchainId}</td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-text">{p.name}</td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            {p.batchBlockchainId ? (
                              <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg text-secondary border border-border">
                                Batch #{p.batchBlockchainId}
                              </span>
                            ) : (
                              <span className="text-text-light text-xs sm:text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-soft">
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-bg/50">
              <h2 className="text-base sm:text-lg font-semibold text-text">All Products</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-bg">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ID</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Batch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 sm:px-6 py-8 text-center text-text-light">
                            No products in your inventory yet.
                          </td>
                        </tr>
                      ) : (
                        products.map(p => (
                          <tr key={p._id} className="hover:bg-bg transition-colors">
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-text">{p.uniqueProductId || p.blockchainId}</td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-text">{p.name}</td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              {p.batchBlockchainId ? (
                                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg text-secondary border border-border">
                                  Batch #{p.batchBlockchainId}
                                </span>
                              ) : (
                                <span className="text-text-light text-xs sm:text-sm">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* By Sender Tab */}
        {activeTab === 'by-sender' && (
          <ProductsBySender />
        )}

        {/* Partnerships Tab */}
        {activeTab === 'partnerships' && (
          <PartnershipManager />
        )}
      </div>
    </Layout>
  )
}

