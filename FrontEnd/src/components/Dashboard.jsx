import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Calendar, TrendingUp, Camera, X } from 'lucide-react'
import Navbar from './Navbar'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003'

const Dashboard = () => {
  const { currentUser, assignAvatar, loading } = useAuth()
  const [avatarError, setAvatarError] = React.useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false)
  const [isErpModalOpen, setIsErpModalOpen] = React.useState(false)
  const [selectedSourceType, setSelectedSourceType] = React.useState(null)
  const [selectedErpSystem, setSelectedErpSystem] = React.useState(null)
  const [selectedApiMethod, setSelectedApiMethod] = React.useState(null)
  const [apiFormData, setApiFormData] = React.useState({
    url: '',
    dbName: '',
    apiKey: '',
    secret: '',
    username: '',
    password: ''
  })
  const [connectionLoading, setConnectionLoading] = React.useState(false)
  const [connectionError, setConnectionError] = React.useState('')
  const [connectionData, setConnectionData] = React.useState(null)
  const [dashboardData, setDashboardData] = React.useState(null)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('netzeroConnectionData')
    if (stored) {
      try {
        setDashboardData(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse stored connection data', error)
        window.localStorage.removeItem('netzeroConnectionData')
      }
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (dashboardData) {
      window.localStorage.setItem('netzeroConnectionData', JSON.stringify(dashboardData))
    } else {
      window.localStorage.removeItem('netzeroConnectionData')
    }
  }, [dashboardData])

  const saveConnectionData = React.useCallback((updater) => {
    setConnectionData(prev => {
      const nextValue = typeof updater === 'function' ? updater(prev) : updater
      if (!nextValue) {
        setDashboardData(null)
        return nextValue
      }
      setDashboardData(nextValue)
      return nextValue
    })
  }, [])

  const userInitial = React.useMemo(() => {
    const source = currentUser?.displayName || currentUser?.email || ''
    return source.trim().charAt(0).toUpperCase() || 'U'
  }, [currentUser])

  const hasProfileImage = Boolean(currentUser?.photoURL) && !avatarError

  React.useEffect(() => {
    setAvatarError(false)
  }, [currentUser?.photoURL])

  const openConnectModal = () => {
    setSelectedSourceType(null)
    setSelectedErpSystem(null)
    setSelectedApiMethod(null)
    setApiFormData({ url: '', dbName: '', apiKey: '', secret: '', username: '', password: '' })
    setIsConnectModalOpen(true)
  }

  const closeConnectModal = () => {
    setIsConnectModalOpen(false)
    setSelectedSourceType(null)
    setSelectedErpSystem(null)
    setSelectedApiMethod(null)
    setApiFormData({ url: '', dbName: '', apiKey: '', secret: '', username: '', password: '' })
    setConnectionError('')
    setConnectionData(null)
    setConnectionLoading(false)
  }

  const handleSourceTypeSelect = (type) => {
    setSelectedSourceType(type)
    setSelectedErpSystem(null)
    setSelectedApiMethod(null)
    setApiFormData({ url: '', dbName: '', apiKey: '', secret: '', username: '', password: '' })
    setConnectionError('')
    setConnectionData(null)
  }

  const handleErpSystemSelect = (erpSystem) => {
    setSelectedErpSystem(erpSystem)
    setSelectedApiMethod(null)
    setApiFormData({ url: '', dbName: '', apiKey: '', secret: '', username: '', password: '' })
    setConnectionError('')
    setConnectionData(null)
  }

  const handleApiMethodSelect = (method) => {
    setSelectedApiMethod(method)
    setApiFormData({ url: '', dbName: '', apiKey: '', secret: '', username: '', password: '' })
    setConnectionError('')
    setConnectionData(null)
  }

  const handleApiFormChange = (field) => (e) => {
    setApiFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleApiConnect = async (e) => {
    e.preventDefault()
    setConnectionLoading(true)
    setConnectionError('')
    setConnectionData(null)

    try {
      // Handle Odoo connection specifically
      if (selectedErpSystem === 'ODOO') {
        if (!apiFormData.url || !apiFormData.dbName || !apiFormData.username || !apiFormData.password) {
          setConnectionError('Please fill in all required fields: URL, DB Name, Username, and Password.')
          setConnectionLoading(false)
          return
        }

        // Connect to Odoo
        const response = await fetch(`${API_BASE_URL}/api/odoo/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: apiFormData.url,
            dbName: apiFormData.dbName,
            username: apiFormData.username,
            password: apiFormData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to Odoo')
        }

        if (data.success) {
          const connectionPayload = {
            ...data,
            source: 'ODOO',
            connectedAt: new Date().toISOString(),
            connectionMeta: {
              url: apiFormData.url,
              dbName: apiFormData.dbName,
              username: apiFormData.username
            }
          }
          saveConnectionData(connectionPayload)
          
          // Fetch sales orders after successful connection
          try {
            const salesResponse = await fetch(`${API_BASE_URL}/api/odoo/sales-orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url: apiFormData.url,
                dbName: apiFormData.dbName,
                username: apiFormData.username,
                password: apiFormData.password,
                limit: 10,
                offset: 0,
              }),
            })

            const salesData = await salesResponse.json()
            if (salesData.success) {
              saveConnectionData(prev => {
                if (!prev) return prev
                return {
                  ...prev,
                  salesOrders: salesData.data,
                  salesCount: salesData.count
                }
              })
            }
          } catch (salesError) {
            console.error('Error fetching sales orders:', salesError)
            // Don't fail the connection if sales fetch fails
          }
        } else {
          throw new Error(data.error || 'Connection failed')
        }
      } else if (selectedErpSystem === 'ERPNEXT') {
        // Handle ERPNext - only username and password
        if (!apiFormData.url || !apiFormData.username || !apiFormData.password) {
          setConnectionError('Please fill in all required fields: Base URL, Username, and Password.')
          setConnectionLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/erpnext/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            baseUrl: apiFormData.url,
            username: apiFormData.username,
            password: apiFormData.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to ERPNext')
        }

        if (data.success) {
          const connectionPayload = {
            ...data,
            source: 'ERPNEXT',
            connectedAt: new Date().toISOString(),
            connectionMeta: {
              baseUrl: apiFormData.url,
              username: apiFormData.username
            }
          }
          saveConnectionData(connectionPayload)
          
          // Fetch sales orders and purchase orders after successful connection
          try {
            // Fetch sales orders
            const salesResponse = await fetch(`${API_BASE_URL}/api/erpnext/sales-orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                baseUrl: apiFormData.url,
                username: apiFormData.username,
                password: apiFormData.password,
                limit: 20,
                offset: 0,
              }),
            })

            const salesData = await salesResponse.json()
            
            // Fetch purchase orders
            const purchaseResponse = await fetch(`${API_BASE_URL}/api/erpnext/purchase-orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                baseUrl: apiFormData.url,
                username: apiFormData.username,
                password: apiFormData.password,
                limit: 20,
                offset: 0,
              }),
            })

            const purchaseData = await purchaseResponse.json()

            // Update connection data with fetched orders
            saveConnectionData(prev => {
              if (!prev) return prev
              return {
                ...prev,
                salesOrders: salesData.success ? salesData.data : [],
                salesCount: salesData.success ? salesData.count : 0,
                purchaseOrders: purchaseData.success ? purchaseData.data : [],
                purchaseCount: purchaseData.success ? purchaseData.count : 0,
                summary: {
                  totalSalesOrders: salesData.success ? salesData.count : 0,
                  totalPurchaseOrders: purchaseData.success ? purchaseData.count : 0,
                  totalItems: 0,
                  totalCustomers: 0,
                  totalSuppliers: 0,
                }
              }
            })
          } catch (fetchError) {
            console.error('Error fetching orders:', fetchError)
            // Don't fail the connection if fetch fails
          }
        } else {
          throw new Error(data.error || 'Connection failed')
        }
      } else {
        // Handle other ERP systems (NetZero ERP, etc.)
        let secret = ''
        
        if (selectedApiMethod === 'URL') {
          setConnectionError('This ERP system requires authentication. Please use Key-Secret or Username & Password.')
          setConnectionLoading(false)
          return
        } else if (selectedApiMethod === 'URL_SECRET') {
          if (!apiFormData.apiKey || !apiFormData.secret) {
            setConnectionError('Please fill in both API Key and Secret.')
            setConnectionLoading(false)
            return
          }
          secret = `${apiFormData.apiKey}:${apiFormData.secret}`
        } else if (selectedApiMethod === 'USER_PASS') {
          secret = `${apiFormData.username}:${apiFormData.password}`
        }

        if (!apiFormData.url || !secret) {
          setConnectionError('Please fill in all required fields.')
          setConnectionLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/erp/connect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: apiFormData.url,
            secret: secret,
            erpSystem: selectedErpSystem,
            connectionMethod: selectedApiMethod,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to ERP system')
        }

        if (data.success) {
          setConnectionData(data)
        } else {
          throw new Error(data.error || 'Connection failed')
        }
      }
    } catch (error) {
      console.error('Connection error:', error)
      
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        setConnectionError(
          'Cannot connect to backend server. Please ensure:\n' +
          '1. Backend server is running on http://localhost:5000\n' +
          '2. Run "npm start" in the BackEnd directory\n' +
          '3. Check browser console for CORS errors'
        )
      } else {
        setConnectionError(error.message || 'Failed to connect. Please check your credentials and try again.')
      }
    } finally {
      setConnectionLoading(false)
    }
  }

  const handleNetzeroErpClick = () => {
    setIsErpModalOpen(true)
  }

  const closeErpModal = () => {
    setIsErpModalOpen(false)
  }

  const formatNumber = (value) => {
    const num = Number(value || 0)
    if (Number.isNaN(num)) return '0'
    return num.toLocaleString()
  }

  const formatAmount = (value) => {
    const num = Number(value)
    if (Number.isNaN(num)) return '—'
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (value) => {
    if (!value) return 'N/A'
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return 'N/A'
    return parsed.toLocaleDateString()
  }

  const activeData = dashboardData
  const isOdooConnection = activeData?.source === 'ODOO'
  const isERPNextConnection = activeData?.source === 'ERPNEXT'
  const salesOrdersCount =
    activeData?.salesCount ??
    activeData?.summary?.totalSalesOrders ??
    activeData?.summary?.sales_order ??
    (activeData?.salesOrders?.length ?? 0)
  const purchaseOrdersCount =
    activeData?.purchaseCount ??
    activeData?.summary?.totalPurchaseOrders ??
    activeData?.summary?.purchase_order ??
    (activeData?.purchaseOrders?.length ?? 0)
  const inferredItemCountFromOdoo = activeData?.salesOrders
    ? activeData.salesOrders.reduce((total, order) => {
        const lines = Array.isArray(order.order_line) ? order.order_line.length : 0
        return total + lines
      }, 0)
    : 0
  const itemsCount =
    activeData?.summary?.totalItems ??
    activeData?.summary?.item ??
    inferredItemCountFromOdoo
  const recentSalesOrders = activeData?.salesOrders ? activeData.salesOrders.slice(0, 8) : []
  const recentPurchaseOrders = activeData?.purchaseOrders ? activeData.purchaseOrders.slice(0, 8) : []
  const connectedAtLabel = activeData?.connectedAt
    ? new Date(activeData.connectedAt).toLocaleString()
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No user logged in</div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-black"
      >
        <Navbar />
        <div className="container mx-auto px-6 pt-20">
          <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome to NetZero
            </h1>
            <p className="text-xl text-gray-400">
              Your carbon tracking dashboard
            </p>
          </motion.div>

          {dashboardData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400">Connected Source</p>
                  <h3 className="text-2xl font-semibold text-white mt-1">
                    {isOdooConnection ? 'Odoo' : isERPNextConnection ? 'ERPNext' : 'Data Source'}
                  </h3>
                  {dashboardData.authenticatedUser && (
                    <p className="text-gray-400 text-sm">
                      Authenticated as <span className="text-white">{dashboardData.authenticatedUser}</span>
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {connectedAtLabel && <p>Connected on {connectedAtLabel}</p>}
                  {dashboardData.connectionMeta?.url && (
                    <p className="truncate max-w-xs">Instance: {dashboardData.connectionMeta.url}</p>
                  )}
                </div>
              </div>

              {dashboardData.summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-gray-400 uppercase">Customers</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNumber(
                        dashboardData.summary.totalCustomers ?? dashboardData.summary.customer ?? 0
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-gray-400 uppercase">Suppliers</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNumber(
                        dashboardData.summary.totalSuppliers ?? dashboardData.summary.supplier ?? 0
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-gray-400 uppercase">Items</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {formatNumber(
                        dashboardData.summary.totalItems ?? dashboardData.summary.item ?? itemsCount
                      )}
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* Order Cards - Sales and Purchase Orders */}
          {(recentSalesOrders.length > 0 || recentPurchaseOrders.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mb-8"
            >
              {recentSalesOrders.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Sales Orders</h3>
                      <p className="text-sm text-gray-400">
                        Showing {recentSalesOrders.length} of {formatNumber(salesOrdersCount)} orders
                      </p>
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">
                      {isOdooConnection ? 'Odoo' : 'ERPNext'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentSalesOrders.map((order, idx) => {
                      // Handle ERPNext format (order_name, item_name, quantity, date)
                      const isERPNextFormat = order.order_name && order.item_name
                      const orderName = isERPNextFormat ? order.order_name : (order.name || `Order #${idx + 1}`)
                      const orderDate = isERPNextFormat ? order.date : (order.date_order || order.posting_date || order.transaction_date || order.date)
                      
                      return (
                        <div
                          key={`sales-${order.order_name || order.name || order.id || idx}`}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium text-sm truncate">{orderName}</p>
                            {!isERPNextFormat && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-200 capitalize ml-2">
                                {order.state || order.status || 'pending'}
                              </span>
                            )}
                          </div>
                          {isERPNextFormat && (
                            <div className="text-xs text-gray-400">
                              Item: <span className="text-white">{order.item_name}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Date</span>
                            <span>{formatDate(orderDate)}</span>
                          </div>
                          {isERPNextFormat ? (
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Quantity</span>
                              <span className="text-white font-semibold">{order.quantity || 0}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Amount</span>
                                <span className="text-white font-semibold">
                                  {order.amount_total != null ? `₹${formatAmount(order.amount_total)}` : '—'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Items</span>
                                <span className="text-white font-semibold">
                                  {Array.isArray(order.order_line) ? order.order_line.length : order.items?.length || 0}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {recentPurchaseOrders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Purchase Orders</h3>
                      <p className="text-sm text-gray-400">
                        Showing {recentPurchaseOrders.length} of {formatNumber(purchaseOrdersCount)} orders
                      </p>
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500">
                      {isOdooConnection ? 'Odoo' : 'ERPNext'}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentPurchaseOrders.map((order, idx) => {
                      // Handle ERPNext format (order_name, item_name, quantity, date)
                      const isERPNextFormat = order.order_name && order.item_name
                      const orderName = isERPNextFormat ? order.order_name : (order.name || `Order #${idx + 1}`)
                      const orderDate = isERPNextFormat ? order.date : (order.date_order || order.posting_date || order.transaction_date || order.date)
                      
                      return (
                        <div
                          key={`purchase-${order.order_name || order.name || order.id || idx}`}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium text-sm truncate">{orderName}</p>
                            {!isERPNextFormat && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-200 capitalize ml-2">
                                {order.state || order.status || 'pending'}
                              </span>
                            )}
                          </div>
                          {isERPNextFormat && (
                            <div className="text-xs text-gray-400">
                              Item: <span className="text-white">{order.item_name}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Date</span>
                            <span>{formatDate(orderDate)}</span>
                          </div>
                          {isERPNextFormat ? (
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Quantity</span>
                              <span className="text-white font-semibold">{order.quantity || 0}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Amount</span>
                                <span className="text-white font-semibold">
                                  {order.amount_total != null ? `₹${formatAmount(order.amount_total)}` : '—'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-400">
                                <span>Items</span>
                                <span className="text-white font-semibold">
                                  {Array.isArray(order.order_line) ? order.order_line.length : order.items?.length || 0}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10"
          >
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {hasProfileImage ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-white">
                      {userInitial}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {currentUser.displayName || 'User'}
                </h2>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
                </div>
                {hasProfileImage ? (
                  <div className="flex items-center gap-2 text-green-400 mt-2">
                    <Camera className="w-3 h-3" />
                    <span className="text-xs">Profile photo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400 mt-2">
                    <Camera className="w-3 h-3" />
                    <span className="text-xs">Initial placeholder avatar</span>
                    <button
                      onClick={() => assignAvatar()}
                      className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30 transition-colors"
                    >
                      Assign Default Avatar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumber(salesOrdersCount)}</p>
                  <p className="text-sm text-gray-400">Sales Orders Imported</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumber(purchaseOrdersCount)}</p>
                  <p className="text-sm text-gray-400">Purchase Orders Imported</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{formatNumber(itemsCount)}</p>
                  <p className="text-sm text-gray-400">Items Synced</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Getting Started</h3>
            <p className="text-gray-400 mb-6">
              Welcome to NetZero! Start tracking your carbon footprint by adding your first project or connecting your data sources.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={openConnectModal}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Connect Data Source
              </button>
              <button
                onClick={handleNetzeroErpClick}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Netzero-ERP
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors">
                View Tutorial
              </button>
            </div>
          </motion.div>
          </div>
        </div>
      </motion.div>

      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#111] border border-white/10 p-6">
            <button
              onClick={closeConnectModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!selectedSourceType && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Select a data source type
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Choose how you would like to bring project data into NetZero.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'API', label: 'API Integration' },
                    { key: 'SQL', label: 'SQL Database' },
                    { key: 'NOSQL', label: 'No-SQL Database' },
                    { key: 'IOT', label: 'IoT System' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSourceTypeSelect(option.key)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white hover:border-white/30 transition"
                    >
                      <span className="block text-sm font-medium text-white">
                        {option.label}
                      </span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {option.key === 'API'
                          ? 'Connect via REST/GraphQL endpoints.'
                          : option.key === 'SQL'
                          ? 'Sync from relational databases.'
                          : option.key === 'NOSQL'
                          ? 'Integrate document or key-value stores.'
                          : 'Collect telemetry from connected devices.'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSourceType && selectedSourceType !== 'API' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {selectedSourceType === 'SQL'
                        ? 'SQL Database'
                        : selectedSourceType === 'NOSQL'
                        ? 'No-SQL Database'
                        : 'IoT System'}{' '}
                      integration
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Support for this connector is coming soon. Stay tuned!
                    </p>
                  </div>
                  <button
                    onClick={() => handleSourceTypeSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {selectedSourceType === 'API' && !selectedErpSystem && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Select ERP System
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Choose the ERP system you want to connect with.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSourceTypeSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'NETZERO_ERP', label: 'NetZero ERP', description: 'Our integrated ERP solution for carbon tracking.' },
                    { key: 'ERPNEXT', label: 'ERPNext', description: 'Open-source ERP system with comprehensive business management.' },
                    { key: 'ODOO', label: 'Odoo', description: 'All-in-one business management software suite.' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleErpSystemSelect(option.key)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        selectedErpSystem === option.key
                          ? 'border-white/60 bg-white/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-200 hover:border-white/40'
                      }`}
                    >
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSourceType === 'API' && selectedErpSystem && selectedErpSystem !== 'ODOO' && selectedErpSystem !== 'ERPNEXT' && !selectedApiMethod && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Connection Method
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Choose how to authenticate with {selectedErpSystem === 'NETZERO_ERP' ? 'NetZero ERP' : 'ERPNext'}.
                    </p>
                  </div>
                  <button
                    onClick={() => handleErpSystemSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>

                <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-200 mb-4">
                  Selected ERP:{' '}
                  <span className="font-semibold text-white">
                    {selectedErpSystem === 'NETZERO_ERP' ? 'NetZero ERP' : 'ERPNext'}
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'URL', label: 'URL only', description: 'Public or pre-authorised endpoints.' },
                    { key: 'URL_SECRET', label: 'Key-Secret', description: 'Endpoints protected with API keys or tokens.' },
                    { key: 'USER_PASS', label: 'Username & Password', description: 'Basic auth or legacy service credentials.' },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleApiMethodSelect(option.key)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        selectedApiMethod === option.key
                          ? 'border-white/60 bg-white/10 text-white'
                          : 'border-white/10 bg-white/5 text-gray-200 hover:border-white/40'
                      }`}
                    >
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="block text-xs text-gray-400 mt-1">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedSourceType === 'API' && selectedErpSystem === 'ERPNEXT' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      ERPNext Connection Details
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Enter your ERPNext credentials to connect.
                    </p>
                  </div>
                  <button
                    onClick={() => handleErpSystemSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
                    Selected ERP:{' '}
                    <span className="font-semibold text-white">ERPNext</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  {connectionError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 whitespace-pre-line">
                      {connectionError}
                    </div>
                  )}

                  {connectionData && (
                    <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                      <div className="font-semibold text-white">Connection Successful!</div>
                      <div className="mt-1">Authenticated as: <span className="font-medium">{connectionData.authenticatedUser}</span></div>
                      <div className="mt-2 text-xs text-green-300">Data is being fetched and will appear on your dashboard shortly.</div>
                    </div>
                  )}

                  <form onSubmit={handleApiConnect} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        ERPNext Base URL <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={apiFormData.url}
                        onChange={handleApiFormChange('url')}
                        placeholder="https://your-erpnext-instance.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your ERPNext instance base URL (e.g., https://demo.erpnext.com)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Username (Email) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={apiFormData.username}
                        onChange={handleApiFormChange('username')}
                        placeholder="user@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        value={apiFormData.password}
                        onChange={handleApiFormChange('password')}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleErpSystemSelect(null)}
                        className="flex-1 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={connectionLoading}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectionLoading ? 'Connecting...' : 'Connect'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {selectedSourceType === 'API' && selectedErpSystem === 'ODOO' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Odoo Connection Details
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Enter your Odoo credentials to connect.
                    </p>
                  </div>
                  <button
                    onClick={() => handleErpSystemSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
                    Selected ERP:{' '}
                    <span className="font-semibold text-white">Odoo</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  {connectionError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 whitespace-pre-line">
                      {connectionError}
                    </div>
                  )}

                  {connectionData && (
                    <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                      <div className="font-semibold text-white">Connection Successful!</div>
                      <div className="mt-1">Authenticated as: <span className="font-medium">{connectionData.authenticatedUser}</span></div>
                      {connectionData.dbName && (
                        <div className="mt-1">Database: <span className="font-medium">{connectionData.dbName}</span></div>
                      )}
                      <div className="mt-2 text-xs text-green-300">Data is being fetched and will appear on your dashboard shortly.</div>
                    </div>
                  )}

                  <form onSubmit={handleApiConnect} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Odoo URL <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={apiFormData.url}
                        onChange={handleApiFormChange('url')}
                        placeholder="https://your-odoo-instance.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Your Odoo instance base URL (e.g., https://demo.odoo.com)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Database Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={apiFormData.dbName}
                        onChange={handleApiFormChange('dbName')}
                        placeholder="mycompany_db"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Found in Settings → General Settings → Database
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Username (Email) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={apiFormData.username}
                        onChange={handleApiFormChange('username')}
                        placeholder="user@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Password <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        value={apiFormData.password}
                        onChange={handleApiFormChange('password')}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleErpSystemSelect(null)}
                        className="flex-1 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={connectionLoading}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectionLoading ? 'Connecting...' : 'Connect'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}

            {selectedSourceType === 'API' && selectedErpSystem && selectedErpSystem !== 'ODOO' && selectedErpSystem !== 'ERPNEXT' && selectedApiMethod && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Connection Details
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Enter your connection credentials.
                    </p>
                  </div>
                  <button
                    onClick={() => handleApiMethodSelect(null)}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
                    ERP System:{' '}
                    <span className="font-semibold text-white">
                      {selectedErpSystem === 'NETZERO_ERP' ? 'NetZero ERP' : selectedErpSystem === 'ERPNEXT' ? 'ERPNext' : 'Odoo'}
                    </span>
                  </div>
                  <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                    Connection Method:{' '}
                    <span className="font-semibold text-white">
                      {selectedApiMethod === 'URL'
                        ? 'URL only'
                        : selectedApiMethod === 'URL_SECRET'
                        ? 'Key-Secret'
                        : 'Username & Password'}
                    </span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-white/10"
                >
                  {connectionError && (
                    <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 whitespace-pre-line">
                      {connectionError}
                    </div>
                  )}

                  {connectionData && (
                    <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200 space-y-3">
                      <div className="font-semibold text-white">Connection Successful!</div>
                      <div>Authenticated as: <span className="font-medium">{connectionData.authenticatedUser}</span></div>
                      {connectionData.dbName && (
                        <div>Database: <span className="font-medium">{connectionData.dbName}</span></div>
                      )}
                      <div className="mt-2 text-xs text-green-300">Data is being fetched and will appear on your dashboard shortly.</div>
                    </div>
                  )}

                    <form onSubmit={handleApiConnect} className="space-y-4">
                      {/* Odoo specific form fields */}
                      {selectedErpSystem === 'ODOO' && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                              Odoo URL <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="url"
                              value={apiFormData.url}
                              onChange={handleApiFormChange('url')}
                              placeholder="https://your-odoo-instance.com"
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Your Odoo instance base URL (e.g., https://demo.odoo.com)
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                              Database Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={apiFormData.dbName}
                              onChange={handleApiFormChange('dbName')}
                              placeholder="mycompany_db"
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Found in Settings → General Settings → Database
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                              Username (Email) <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="email"
                              value={apiFormData.username}
                              onChange={handleApiFormChange('username')}
                              placeholder="user@example.com"
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-gray-300">
                              Password <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="password"
                              value={apiFormData.password}
                              onChange={handleApiFormChange('password')}
                              placeholder="Enter your password"
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* Other ERP systems */}
                      {selectedErpSystem !== 'ODOO' && (
                        <>
                          {selectedApiMethod === 'URL' && (
                            <div className="space-y-2">
                              <label className="text-sm text-gray-300">
                                API URL <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="url"
                                value={apiFormData.url}
                                onChange={handleApiFormChange('url')}
                                placeholder="https://api.example.com/endpoint"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                required
                              />
                            </div>
                          )}

                          {selectedApiMethod === 'URL_SECRET' && (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-300">
                                  Base URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="url"
                                  value={apiFormData.url}
                                  onChange={handleApiFormChange('url')}
                                  placeholder="https://your-erpnext-instance.com"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Your ERPNext instance base URL (e.g., https://demo.erpnext.com)
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-300">
                                  API Key <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={apiFormData.apiKey}
                                  onChange={handleApiFormChange('apiKey')}
                                  placeholder="Enter your API key"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Found in User Settings → API Access section
                                </p>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-300">
                                  API Secret <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="password"
                                  value={apiFormData.secret}
                                  onChange={handleApiFormChange('secret')}
                                  placeholder="Enter your API secret"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Generated when you click "Generate Keys" in API Access section
                                </p>
                              </div>
                            </>
                          )}

                          {selectedApiMethod === 'USER_PASS' && (
                            <>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-300">
                                  Username <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={apiFormData.username}
                                  onChange={handleApiFormChange('username')}
                                  placeholder="Enter your username"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-gray-300">
                                  Password <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="password"
                                  value={apiFormData.password}
                                  onChange={handleApiFormChange('password')}
                                  placeholder="Enter your password"
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none"
                                  required
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleApiMethodSelect(null)}
                          className="flex-1 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={connectionLoading}
                          className="flex-1 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {connectionLoading ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                    </form>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {isErpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-2xl bg-[#111] border border-white/10 p-8"
          >
            <button
              onClick={closeErpModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  NetZero-ERP Integration
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our comprehensive Enterprise Resource Planning system is currently under development and will be available in an upcoming release. This integrated solution will enable seamless data synchronization, advanced analytics, and enhanced carbon footprint tracking capabilities.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates and early access notifications.
                </p>
              </div>

              <button
                onClick={closeErpModal}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default Dashboard
