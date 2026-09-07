'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Plus,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react'

import { getFarmerLots } from '@/lib/api/lots'
import LotCard from '@/components/lots/LotCard'
import EmptyState from '@/components/lots/EmptyState'

// ============================================================
// STATUS OPTIONS
// ============================================================

const STATUS_OPTIONS = [
  'All Status',
  'Draft',
  'Available',
  'Offers Received',
  'Accepted',
  'In Logistics',
  'Delivered',
  'Sold',
  'Completed',
  'Cancelled',
]

// ============================================================
// CROP OPTIONS
// ============================================================

const CROP_OPTIONS = [
  'All Crops',
  'Potato',
  'Rice',
  'Wheat',
  'Tomato',
  'Onion',
  'Maize',
  'Mustard',
  'Brinjal',
  'Cabbage',
  'Cauliflower',
]

// ============================================================
// SORT OPTIONS
// ============================================================

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest First',
  },
  {
    value: 'oldest',
    label: 'Oldest First',
  },
  {
    value: 'price_high',
    label: 'Highest Price',
  },
  {
    value: 'price_low',
    label: 'Lowest Price',
  },
  {
    value: 'quantity_high',
    label: 'Highest Quantity',
  },
  {
    value: 'quantity_low',
    label: 'Lowest Quantity',
  },
]

// ============================================================
// PAGE
// ============================================================

export default function MyLotsPage() {
  const params = useParams()
  const router = useRouter()

  const farmerId = params.id

  // ============================================================
  // STATE
  // ============================================================

  const [lots, setLots] = useState([])
  const [filteredLots, setFilteredLots] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [cropFilter, setCropFilter] = useState('All Crops')
  const [sortBy, setSortBy] = useState('newest')

  const [showFilters, setShowFilters] = useState(false)

  // ============================================================
  // FETCH LOTS
  // ============================================================

  useEffect(() => {
    fetchLots()
  }, [farmerId])

  // ============================================================
  // APPLY FILTERS WHENEVER FILTER STATE CHANGES
  // ============================================================

  useEffect(() => {
    applyFilters()
  }, [
    lots,
    searchTerm,
    statusFilter,
    cropFilter,
    sortBy,
  ])

  // ============================================================
  // FETCH FUNCTION
  // ============================================================

  const fetchLots = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await getFarmerLots(farmerId)

      console.log('API RESPONSE:', response)

      if (response.success) {
        console.log('LOTS FROM API:', response.lots)

        setLots(response.lots || [])
      } else {
        setError('Failed to fetch lots')
        setLots([])
      }
    } catch (err) {
      console.error('Error fetching lots:', err)

      setError(err.message || 'Failed to load lots')

      // Mock data for development
      setLots(getMockLots())
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // MOCK DATA
  // ============================================================

  const getMockLots = () => {
    return [
      {
        id: 'LOT-001',
        crop: 'Wheat',
        variety: 'HD-2967',
        quantity: 40,
        unit: 'quintal',
        quality_grade: 'Grade A',
        expected_price: 2600,
        minimum_price: 2500,
        pickup_location: 'Burdwan',
        state: 'West Bengal',
        district: 'Burdwan',
        village: 'Example Village',
        status: 'Available',
        created_at: '2026-09-05T10:30:00Z',
        available_from: '2026-09-10',
        expected_sale_date: '2026-09-20',
        description: 'Good quality wheat ready for sale',
        packaging_type: 'Bags',
      },

      {
        id: 'LOT-002',
        crop: 'Potato',
        variety: 'Kufri Jyoti',
        quantity: 25,
        unit: 'quintal',
        quality_grade: 'Grade A',
        expected_price: 2650,
        minimum_price: 2600,
        pickup_location: 'Burdwan',
        state: 'West Bengal',
        district: 'Burdwan',
        village: 'Example Village',
        status: 'Offers Received',
        created_at: '2026-09-04T14:20:00Z',
        available_from: '2026-09-08',
        expected_sale_date: '2026-09-18',
        description: 'Fresh potato harvest',
        packaging_type: 'Crates',
      },

      {
        id: 'LOT-003',
        crop: 'Rice',
        variety: 'Basmati',
        quantity: 15,
        unit: 'tonnes',
        quality_grade: 'Grade A',
        expected_price: 1800,
        minimum_price: 1700,
        pickup_location: 'Burdwan',
        state: 'West Bengal',
        district: 'Burdwan',
        village: 'Example Village',
        status: 'Sold',
        created_at: '2026-08-28T09:00:00Z',
        available_from: '2026-09-01',
        expected_sale_date: '2026-09-10',
        description: 'Premium Basmati rice',
        packaging_type: 'Bags',
      },
    ]
  }

  // ============================================================
  // FILTER + SORT
  // ============================================================

  const applyFilters = () => {
    let result = [...lots]

    // ----------------------------------------------------------
    // SEARCH FILTER
    // ----------------------------------------------------------

    if (searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase()

      result = result.filter((lot) => {
        const crop = String(lot.crop || '').toLowerCase()
        const id = String(lot.id || '').toLowerCase()
        const variety = String(lot.variety || '').toLowerCase()

        return (
          crop.includes(search) ||
          id.includes(search) ||
          variety.includes(search)
        )
      })
    }

    // ----------------------------------------------------------
    // STATUS FILTER
    // Case-insensitive
    // ----------------------------------------------------------

    if (statusFilter !== 'All Status') {
      result = result.filter((lot) => {
        return (
          String(lot.status || '').toLowerCase() ===
          statusFilter.toLowerCase()
        )
      })
    }

    // ----------------------------------------------------------
    // CROP FILTER
    // Case-insensitive
    // ----------------------------------------------------------

    if (cropFilter !== 'All Crops') {
      result = result.filter((lot) => {
        return (
          String(lot.crop || '').toLowerCase() ===
          cropFilter.toLowerCase()
        )
      })
    }

    // ----------------------------------------------------------
    // SORT
    // ----------------------------------------------------------

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
          )

        case 'oldest':
          return (
            new Date(a.created_at || 0) -
            new Date(b.created_at || 0)
          )

        case 'price_high':
          return (
            Number(b.expected_price || 0) -
            Number(a.expected_price || 0)
          )

        case 'price_low':
          return (
            Number(a.expected_price || 0) -
            Number(b.expected_price || 0)
          )

        case 'quantity_high':
          return (
            Number(b.quantity || 0) -
            Number(a.quantity || 0)
          )

        case 'quantity_low':
          return (
            Number(a.quantity || 0) -
            Number(b.quantity || 0)
          )

        default:
          return 0
      }
    })

    setFilteredLots(result)
  }

  // ============================================================
  // STATISTICS
  // ============================================================

  const getStats = () => {
    const total = lots.length

    const available = lots.filter(
      (lot) =>
        String(lot.status || '').toLowerCase() ===
        'available'
    ).length

    const offersReceived = lots.filter(
      (lot) =>
        String(lot.status || '').toLowerCase() ===
        'offers received'
    ).length

    const sold = lots.filter((lot) => {
      const status = String(
        lot.status || ''
      ).toLowerCase()

      return (
        status === 'sold' ||
        status === 'completed'
      )
    }).length

    return {
      total,
      available,
      offersReceived,
      sold,
    }
  }

  const stats = getStats()

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All Status')
    setCropFilter('All Crops')
    setSortBy('newest')
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">

          <div className="h-8 w-48 bg-gray-200 rounded"></div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded"
              ></div>
            ))}
          </div>

          <div className="h-12 bg-gray-200 rounded"></div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-200 rounded"
              ></div>
            ))}
          </div>

        </div>
      </div>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && lots.length === 0) {
    return (
      <div className="p-6">

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

          <p className="text-red-600">
            {error}
          </p>

          <button
            onClick={fetchLots}
            className="mt-4 text-[#1a4d3e] font-medium hover:underline"
          >
            Try Again
          </button>

        </div>

      </div>
    )
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="p-6 lg:p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>

          <h1 className="text-2xl font-bold text-[#2d2d2d]">
            My Lots
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage your produce lots and track their selling status
          </p>

        </div>

        <Link
          href={`/farmer/${farmerId}/lots/create`}
          className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <Plus size={20} />
          Create Lot
        </Link>

      </div>

      {/* ======================================================
          STATS
      ====================================================== */}

      {lots.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatCard
            title="Total Lots"
            value={stats.total}
            icon={Package}
          />

          <StatCard
            title="Available"
            value={stats.available}
            icon={Package}
          />

          <StatCard
            title="Offers Received"
            value={stats.offersReceived}
            icon={Package}
          />

          <StatCard
            title="Sold"
            value={stats.sold}
            icon={Package}
          />

        </div>
      )}

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

        <div className="flex flex-col md:flex-row md:items-center gap-4">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by crop or lot ID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            />

          </div>

          {/* FILTER BUTTON */}

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >

            <Filter size={18} />

            Filters

            <ChevronDown
              size={16}
              className={`transition-transform ${
                showFilters
                  ? 'rotate-180'
                  : ''
              }`}
            />

          </button>

        </div>

        {/* FILTER OPTIONS */}

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >

              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}

            </select>

            {/* CROP */}

            <select
              value={cropFilter}
              onChange={(e) =>
                setCropFilter(e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >

              {CROP_OPTIONS.map((crop) => (
                <option
                  key={crop}
                  value={crop}
                >
                  {crop}
                </option>
              ))}

            </select>

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >

              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}

            </select>

          </div>
        )}

      </div>

      {/* ======================================================
          RESULT COUNT
      ====================================================== */}

      <div className="mb-4">

        <p className="text-sm text-gray-500">

          Showing{' '}

          <span className="font-semibold text-gray-700">
            {filteredLots.length}
          </span>

          {' '}of{' '}

          <span className="font-semibold text-gray-700">
            {lots.length}
          </span>

          {' '}lots

        </p>

      </div>

      {/* ======================================================
          LOTS LIST
      ====================================================== */}

      {filteredLots.length === 0 &&
      lots.length === 0 ? (

        <EmptyState
          farmerId={farmerId}
        />

      ) : filteredLots.length === 0 ? (

        <div className="bg-white rounded-xl shadow-sm p-8 text-center">

          <p className="text-gray-500">
            No lots match your filters
          </p>

          <button
            onClick={clearFilters}
            className="mt-2 text-[#1a4d3e] font-medium hover:underline"
          >
            Clear filters
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredLots.map((lot) => (

            <LotCard
              key={lot.id}
              lot={lot}
              farmerId={farmerId}
            />

          ))}

        </div>

      )}

    </div>
  )
}


// ============================================================
// FALLBACK STAT CARD
// ============================================================

function StatCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <p className="text-2xl font-bold text-[#2d2d2d] mt-1">
            {value}
          </p>

        </div>

        {Icon && (
          <div className="p-3 rounded-lg bg-[#1a4d3e] text-white">
            <Icon size={20} />
          </div>
        )}

      </div>

    </div>
  )
}