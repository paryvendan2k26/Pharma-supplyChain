import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import PartnershipManager from '../components/PartnershipManager'
import ProductsBySender from '../components/ProductsBySender'

export default function RetailerDashboard() {
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('inventory')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchProducts()
  }, [])

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

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text mb-2">Retailer Dashboard</h1>
          <p className="text-sm sm:text-base text-text-light">View inventory and manage product sales</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto -mx-4 sm:mx-0">
          <nav className="flex gap-1 px-4 sm:px-0 min-w-max sm:min-w-0">
            <button onClick={() => setActiveTab('inventory')} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'inventory' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}>
              All Products
            </button>
            <button onClick={() => setActiveTab('by-sender')} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'by-sender' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}>
              By Sender
            </button>
            <button onClick={() => setActiveTab('partnerships')} className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'partnerships' ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text'}`}>
              Partnerships
            </button>
          </nav>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="text-3xl sm:text-4xl font-bold text-text mb-2">{products.length}</div>
            <div className="text-sm font-medium text-text-light">Total Products</div>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft hover:shadow-soft-lg transition-all">
            <div className="text-3xl sm:text-4xl font-bold text-text mb-2">
              {products.filter(p => p.batchBlockchainId).length}
            </div>
            <div className="text-sm font-medium text-text-light">Batched Products</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-soft">
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-bg/50">
            <h2 className="text-base sm:text-lg font-semibold text-text">Product Inventory</h2>
            <p className="text-xs sm:text-sm text-text-light mt-1">QR codes are only visible to manufacturers</p>
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
                          No products in inventory yet.
                        </td>
                      </tr>
                    ) : (
                      products.map(p => (
                        <tr key={p._id} className="hover:bg-bg transition-colors">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-mono text-text">{p.uniqueProductId || p.blockchainId}</td>
                          <td className="px-3 sm:px-6 py-4 text-sm text-text">
                            <div className="font-medium">{p.name}</div>
                            {p.productNumberInBatch && p.batchBlockchainId && (
                              <div className="text-xs text-text-light mt-1">
                                Product #{p.productNumberInBatch} of Batch #{p.batchBlockchainId}
                              </div>
                            )}
                          </td>
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

