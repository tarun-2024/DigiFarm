'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  Calendar,
  MapPin,
  IndianRupee,
  Package,
  Eye,
  Edit,
  XCircle,
  TrendingUp
} from 'lucide-react'
import { getBuyerDemands, deleteDemand } from '@/lib/api/buyerDemands'
import EmptyState from '@/components/buyer/EmptyState'

const STATUS_OPTIONS = [
  'All Status', 'Active', 'Matching', 'Partially Fulfilled', 
  'Fulfilled', 'Expired', 'Cancelled'
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'required_by', label: 'Required By (soonest)' }
]

export default function BuyerDemandsPage() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id

  const [demands, setDemands] = useState([])
  const [filteredDemands, setFilteredDemands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchDemands()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [demands, searchTerm, statusFilter, sortBy])

  const fetchDemands = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getBuyerDemands(buyerId)
      if (response.success) {
        setDemands(response.demands || [])
      } else {
        setError('Failed to fetch demands')
        // Mock data for development
        setDemands(getMockDemands())
      }
    } catch (err) {
      setError(err.message || 'Failed to load demands')
      // Mock data for development
      setDemands(getMockDemands())
    } finally {
      setLoading(false)
    }
  }

  const getMockDemands = () => {
    return [
      {
        id: 1,
        crop: 'Potato',
        quantity: 50,
        unit: 'Tonnes',
        quality_grade: 'A',
        min_price: 2600,
        max_price: 2750,
        required_by: '2026-09-10',
        state: 'West Bengal',
        district: 'Kolkata',
        status: 'Active',
        matches: 8,
        created_at: '2026-09-05T10:30:00Z'
      },
      {
        id: 2,
        crop: 'Rice',
        quantity: 30,
        unit: 'Tonnes',
        quality_grade: 'A+',
        min_price: 1800,
        max_price: 2000,
        required_by: '2026-09-15',
        state: 'West Bengal',
        district: 'Howrah',
        status: 'Matching',
        matches: 3,
        created_at: '2026-09-04T14:20:00Z'
      },
      {
        id: 3,
        crop: 'Onion',
        quantity: 20,
        unit: 'Tonnes',
        quality_grade: 'A',
        min_price: 2000,
        max_price: 2200,
        required_by: '2026-09-20',
        state: 'West Bengal',
        district: 'Nadia',
        status: 'Fulfilled',
        matches: 0,
        created_at: '2026-09-03T09:00:00Z'
      }
    ]
  }

  const applyFilters = () => {
    let result = [...demands]

    // Search
    if (searchTerm) {
      result = result.filter(demand => 
        demand.crop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.id?.toString().includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== 'All Status') {
      result = result.filter(demand => demand.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'required_by':
          return new Date(a.required_by) - new Date(b.required_by)
        default:
          return 0
      }
    })

    setFilteredDemands(result)
  }

  const handleDeleteDemand = async (demandId) => {
    if (!confirm('Are you sure you want to cancel this demand?')) return
    
    try {
      const response = await deleteDemand(buyerId, demandId)
      if (response.success) {
        setDemands(demands.filter(d => d.id !== demandId))
      }
    } catch (error) {
      console.error('Error deleting demand:', error)
      alert('Failed to cancel demand')
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-700',
      'Matching': 'bg-blue-100 text-blue-700',
      'Partially Fulfilled': 'bg-amber-100 text-amber-700',
      'Fulfilled': 'bg-emerald-100 text-emerald-700',
      'Expired': 'bg-gray-100 text-gray-600',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2d2d]">My Demands</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your procurement requirements and matching opportunities
          </p>
        </div>
        <Link 
          href={`/buyer/${buyerId}/demand/create`}
          className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <Plus size={20} />
          Post New Demand
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop or demand ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredDemands.length === 0 && demands.length === 0 ? (
        <EmptyState type="demands" buyerId={buyerId} />
      ) : filteredDemands.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No demands match your filters</p>
          <button 
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('All Status')
            }}
            className="mt-2 text-[#1a4d3e] font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDemands.map((demand) => (
            <div key={demand.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div>
                      <h3 className="font-bold text-[#2d2d2d] text-lg">{demand.crop}</h3>
                      <p className="text-xs text-gray-400 font-mono">Demand #{demand.id}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                      {demand.status || 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">{demand.quantity} {demand.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Grade</p>
                      <p className="font-medium">{demand.quality_grade || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price Range</p>
                      <p className="font-medium">
                        {demand.min_price && demand.max_price 
                          ? `₹${demand.min_price} - ₹${demand.max_price}`
                          : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Required By</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(demand.required_by)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} />
                      {demand.district}, {demand.state}
                    </span>
                    {demand.matches > 0 && (
                      <span className="flex items-center gap-1 text-[#2d7d46]">
                        <TrendingUp size={14} />
                        {demand.matches} matching lots
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                  <Link
                    href={`/buyer/${buyerId}/matches?demand=${demand.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                  >
                    <Eye size={14} />
                    View Matches
                  </Link>
                  {demand.status === 'Active' && (
                    <>
                      <Link
                        href={`/buyer/${buyerId}/demand/${demand.id}/edit`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteDemand(demand.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}