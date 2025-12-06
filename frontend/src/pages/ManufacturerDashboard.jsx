import { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import PartnershipManager from '../components/PartnershipManager'

export default function ManufacturerDashboard() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [products, setProducts] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('single')
  const [batchProducts, setBatchProducts] = useState([{ name: '', description: '', manufactureDate: '' }])
  const [batchMetadataURI, setBatchMetadataURI] = useState('')
  const [batchQuantity, setBatchQuantity] = useState(1)
  const [batchLoading, setBatchLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [transferBatchData, setTransferBatchData] = useState({
    batchId: '',
    toAddress: '',
    location: ''
  })
  const [transferBatchLoading, setTransferBatchLoading] = useState(false)
  const token = localStorage.getItem('token')

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

  useEffect(() => { 
    fetchProducts()
    fetchBatches()
  }, [])

  async function createProduct(e) {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/products', {
        name, description, manufactureDate: date, quantity: parseInt(quantity) || 1
      }, { headers: { Authorization: 'Bearer ' + token } })
      setName(''); setDescription(''); setDate(''); setQuantity(1)
      if (data.products && Array.isArray(data.products)) {
        setProducts([...data.products, ...products])
        setSuccess(`Successfully created ${data.count} product(s)!`)
      } else {
        setProducts([data, ...products])
        setSuccess('Product created successfully!')
      }
      setTimeout(() => setSuccess(''), 5000)
      fetchProducts()
    } catch (e) {
      alert('Failed to create: ' + (e.response?.data?.error || e.message))
    } finally {
      setLoading(false)
    }
  }

  function addBatchProduct() {
    setBatchProducts([...batchProducts, { name: '', description: '', manufactureDate: '' }])
  }

  function removeBatchProduct(index) {
    if (batchProducts.length > 1) {
      setBatchProducts(batchProducts.filter((_, i) => i !== index))
    }
  }

  function updateBatchProduct(index, field, value) {
    const updated = [...batchProducts]
    updated[index][field] = value
    setBatchProducts(updated)
  }

  async function createBatch(e) {
    e.preventDefault()
    setBatchLoading(true)
    setSuccess('')
    
    const validProducts = batchProducts.filter(p => p.name.trim() !== '')
    if (validProducts.length === 0) {
      alert('Please add at least one product with a name')
      setBatchLoading(false)
      return
    }

    const quantity = parseInt(batchQuantity) || 1
    const useQuantity = quantity > 1

    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/products/batch', {
        metadataURI: batchMetadataURI || `ipfs://batch-${Date.now()}`,
        products: validProducts.map(p => ({
          name: p.name,
          description: p.description || '',
          manufactureDate: p.manufactureDate || new Date().toISOString().slice(0, 10)
        })),
        quantity: useQuantity ? quantity : undefined
      }, { headers: { Authorization: 'Bearer ' + token } })
      
      setBatchProducts([{ name: '', description: '', manufactureDate: '' }])
      setBatchMetadataURI('')
      setBatchQuantity(1)
      setSuccess(`Batch created successfully! NFT Token ID: ${data.nftTokenId}${useQuantity ? ` (${quantity} products)` : ''}`)
      setTimeout(() => setSuccess(''), 5000)
      fetchProducts()
      fetchBatches()
    } catch (e) {
      alert('Failed to create batch: ' + (e.response?.data?.error || e.message))
    } finally {
      setBatchLoading(false)
    }
  }

  async function generateZKProof(productId, batchId) {
    if (!confirm('Generate ZK proof for this product? This will prove it belongs to the batch without revealing sensitive details.')) {
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products/${productId}/zk-proof`, {}, { 
        headers: { Authorization: 'Bearer ' + token } 
      })
      alert(`ZK Proof generated successfully!\nProduct ID: ${productId}\nBatch ID: ${batchId}`)
      fetchProducts()
    } catch (e) {
      alert('Failed to generate ZK proof: ' + (e.response?.data?.error || e.message))
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
    setSuccess('')
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/batch/${transferBatchData.batchId}/transfer`,
        { 
          toAddress: transferBatchData.toAddress, 
          location: transferBatchData.location
        },
        { headers: { Authorization: 'Bearer ' + token } }
      )
      setSuccess(data.message || 'Batch transferred successfully!')
      setTransferBatchData({ batchId: '', toAddress: '', location: '' })
      setTimeout(() => setSuccess(''), 10000)
      fetchProducts()
      fetchBatches()
    } catch (e) {
      alert('Batch transfer failed: ' + (e.response?.data?.error || e.message))
    } finally {
      setTransferBatchLoading(false)
    }
  }

  function printQRCode(product) {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${product.name}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: Arial, sans-serif; }
              .qr-container { text-align: center; page-break-inside: avoid; margin-bottom: 2cm; }
              .qr-code { max-width: 300px; margin: 0 auto; }
              .product-name { font-size: 18px; font-weight: bold; margin: 10px 0; }
              .product-id { font-size: 12px; color: #666; margin: 5px 0; }
            }
            body { padding: 20px; }
            .qr-container { text-align: center; margin-bottom: 30px; }
            .qr-code { max-width: 300px; margin: 0 auto; }
            .product-name { font-size: 18px; font-weight: bold; margin: 10px 0; }
            .product-id { font-size: 12px; color: #666; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="product-name">${product.name}</div>
            <div class="product-id">${product.uniqueProductId || product.blockchainId}</div>
            <img src="${product.qrCodeUrl}" alt="QR Code" class="qr-code" />
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  async function printBatchQRCodes(batch) {
    try {
      // Fetch products for this batch
      const batchProducts = products.filter(p => p.batchBlockchainId === batch.batchId)
      if (batchProducts.length === 0) {
        alert('No products found in this batch')
        return
      }

      const printWindow = window.open('', '_blank')
      const qrGrid = batchProducts.map(p => `
        <div class="qr-item">
          <div class="product-name">${p.name}</div>
          <div class="product-id">${p.uniqueProductId || p.blockchainId}</div>
          ${p.productNumberInBatch ? `<div class="product-number">Product #${p.productNumberInBatch} of Batch #${batch.manufacturerBatchNumber || batch.batchId}</div>` : ''}
          <img src="${p.qrCodeUrl}" alt="QR Code" class="qr-code" />
        </div>
      `).join('')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Batch QR Codes - Batch #${batch.manufacturerBatchNumber || batch.batchId}</title>
            <style>
              @media print {
                @page { margin: 1cm; }
                body { font-family: Arial, sans-serif; }
                .qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1cm; }
                .qr-item { text-align: center; page-break-inside: avoid; border: 1px solid #ddd; padding: 10px; }
                .qr-code { max-width: 200px; height: auto; margin: 10px auto; }
                .product-name { font-size: 14px; font-weight: bold; margin: 5px 0; }
                .product-id { font-size: 10px; color: #666; margin: 3px 0; }
                .product-number { font-size: 10px; color: #888; margin: 3px 0; }
              }
              body { padding: 20px; }
              .qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
              .qr-item { text-align: center; border: 1px solid #ddd; padding: 15px; }
              .qr-code { max-width: 200px; height: auto; margin: 10px auto; }
              .product-name { font-size: 14px; font-weight: bold; margin: 5px 0; }
              .product-id { font-size: 10px; color: #666; margin: 3px 0; }
              .product-number { font-size: 10px; color: #888; margin: 3px 0; }
            </style>
          </head>
          <body>
            <h2 style="text-align: center; margin-bottom: 20px;">Batch #${batch.manufacturerBatchNumber || batch.batchId}${batch.manufacturer?.companyName ? ` by ${batch.manufacturer.companyName}` : ''}</h2>
            <div class="qr-grid">
              ${qrGrid}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    } catch (e) {
      alert('Failed to print batch QR codes: ' + e.message)
    }
  }

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-text mb-2">Manufacturer Dashboard</h1>
          <p className="text-sm sm:text-base text-text-light">Create products and batches, manage your inventory</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-5 bg-success/10 border-l-4 border-success rounded-xl shadow-soft fade-in">
            <p className="text-sm text-success font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto -mx-4 sm:mx-0">
          <nav className="flex gap-1 px-4 sm:px-0 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'single'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              Single Product
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'batch'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-light hover:text-text'
              }`}
            >
              Create Batch (NFT)
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

        {/* Single Product Form */}
        {activeTab === 'single' && (
          <>
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-6">Create New Product</h2>
              <form onSubmit={createProduct} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Product Name</label>
                    <input 
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                      placeholder="Enter product name"
                      value={name} 
                      onChange={e=>setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Description</label>
                    <input 
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text placeholder-text-light/60 transition-all text-[15px]"
                      placeholder="Product description"
                      value={description} 
                      onChange={e=>setDescription(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Manufacture Date</label>
                    <input 
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                      type="date" 
                      value={date} 
                      onChange={e=>setDate(e.target.value)} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Quantity</label>
                    <input 
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                      type="number" 
                      min="1" 
                      max="100"
                      value={quantity} 
                      onChange={e=>setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} 
                      required
                    />
                  </div>
                </div>
                <button 
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    `Create ${quantity} Product(s)`
                  )}
                </button>
              </form>
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
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">ZK Proof</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">QR Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-surface">
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-4 sm:px-6 py-8 text-center text-text-light">
                              No products yet. Create your first product above.
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
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                {p.zkProofGenerated ? (
                                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                    ✓ Generated
                                  </span>
                                ) : p.batchBlockchainId ? (
                                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                                    Required
                                  </span>
                                ) : (
                                  <span className="text-text-light text-xs sm:text-sm">—</span>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                {p.qrCodeUrl ? (
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                    <img src={p.qrCodeUrl} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" alt="QR Code" />
                                    <button
                                      onClick={() => printQRCode(p)}
                                      className="text-xs sm:text-sm text-accent hover:text-primary font-medium px-2 sm:px-3 py-1 sm:py-1.5 border border-border rounded-lg hover:bg-bg transition-all shadow-soft"
                                    >
                                      Print QR
                                    </button>
                                  </div>
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

        {/* Batch Creation Form */}
        {activeTab === 'batch' && (
          <>
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-soft">
              <h2 className="text-lg sm:text-xl font-bold text-text mb-6">Create Batch with NFT</h2>
              <form onSubmit={createBatch} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Batch Metadata URI (Optional)</label>
                    <input
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text font-mono text-sm transition-all"
                      placeholder="ipfs://... or https://..."
                      value={batchMetadataURI}
                      onChange={e => setBatchMetadataURI(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-text-light">Leave empty for auto-generated URI</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Quantity (Optional)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface text-text transition-all text-[15px]"
                      placeholder="1"
                      value={batchQuantity}
                      onChange={e => setBatchQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    />
                    <p className="mt-2 text-xs text-text-light">Create N products with same details from first product</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-text">Products in Batch</label>
                    <button
                      type="button"
                      onClick={addBatchProduct}
                      className="px-5 py-2.5 text-sm font-semibold text-accent hover:text-primary border-2 border-border rounded-xl hover:bg-bg transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      + Add Product
                    </button>
                  </div>

                  <div className="space-y-3">
                    {batchProducts.map((product, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg bg-bg shadow-soft">
                        <div className="grid md:grid-cols-4 gap-3">
                          <div>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface text-text text-sm transition-all"
                              placeholder="Product name *"
                              value={product.name}
                              onChange={e => updateBatchProduct(index, 'name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface text-text text-sm transition-all"
                              placeholder="Description"
                              value={product.description}
                              onChange={e => updateBatchProduct(index, 'description', e.target.value)}
                            />
                          </div>
                          <div>
                            <input
                              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface text-text text-sm transition-all"
                              type="date"
                              placeholder="Manufacture Date"
                              value={product.manufactureDate}
                              onChange={e => updateBatchProduct(index, 'manufactureDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => removeBatchProduct(index)}
                              className="w-full px-4 py-2.5 text-sm font-semibold text-error hover:bg-error/10 border-2 border-error/30 rounded-xl transition-all disabled:opacity-50 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
                              disabled={batchProducts.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-soft-lg"
                  disabled={batchLoading}
                >
                  {batchLoading ? 'Creating Batch & Minting NFT...' : 'Create Batch & Mint NFT'}
                </button>
                <p className="text-xs text-text-light text-center">
                  This will create all products in a batch and mint an ERC-721 NFT for the batch
                </p>
              </form>
            </div>

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

            {/* Batches Table */}
            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-soft">
              <div className="px-4 sm:px-6 py-4 border-b border-border bg-bg/50">
                <h2 className="text-base sm:text-lg font-semibold text-text">Your Batches</h2>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-bg">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Batch Number</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">NFT Token ID</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Quantity</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Products</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-surface">
                        {batches.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-4 sm:px-6 py-8 text-center text-text-light">
                              No batches yet. Create your first batch above.
                            </td>
                          </tr>
                        ) : (
                          batches.map(batch => (
                            <tr key={batch._id} className="hover:bg-bg transition-colors">
                              <td className="px-3 sm:px-6 py-4 text-sm text-text font-semibold">
                                <div>Batch #{batch.manufacturerBatchNumber || batch.batchId}</div>
                                {batch.manufacturer?.companyName && (
                                  <div className="text-xs text-text-light mt-1">by {batch.manufacturer.companyName}</div>
                                )}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg text-secondary border border-border">
                                  NFT #{batch.nftTokenId}
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-text font-semibold">{batch.quantity || batch.products?.length || 0}</td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-text">{batch.products?.length || 0} products</td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => printBatchQRCodes(batch)}
                              className="text-xs sm:text-sm text-accent hover:text-primary font-semibold px-4 py-2 border-2 border-border rounded-xl hover:bg-bg transition-all shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              Print All QR Codes
                            </button>
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-text-light">
                                {new Date(batch.createdAt).toLocaleDateString()}
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

        {/* Partnerships Tab */}
        {activeTab === 'partnerships' && (
          <PartnershipManager />
        )}
      </div>
    </Layout>
  )
}
