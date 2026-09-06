'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  TrendingUp,
  Package,
  IndianRupee,
  MapPin,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Filter
} from 'lucide-react'
import { getMatchedLots } from '@/lib/api/buyerLots'

export default function BuyerMatchesPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const buyerId = params.id
  const demandId = searchParams.get('demand')

  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMatches()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [matches, filter])

  const fetchMatches = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getMatchedLots(buyerId)
      if (response.success) {
        setMatches(response.matches || [])
      } else {
        setError('Failed to fetch matches')
        setMatches(getMockMatches())
      }
    } catch (err) {
      setError(err.message || 'Failed to load matches')
      setMatches(getMockMatches())
    } finally {
      setLoading(false)
    }
  }

  const getMockMatches = () => {
    return [
      {
        id: 1,
        lot_id: 101,
        demand_id: 1,
        match_score: 94,
        crop: 'Potato',
        variety: 'Jyoti',
        quantity: 50,
        unit: 'Tonnes',
        quality_grade: 'A',
        expected_price: 2650,
        min_price: 2600,
        max_price: 2750,
        state: 'West Bengal',
        district: 'Kolkata',
        distance: '12 km',
        farmer_name: 'ABC Farmers Group',
        farmer_rating: 4.5,
        match_explanation: [
          '✓ Crop matches',
          '✓ Grade matches',
          '✓ Quantity available',
          '✓ Price within budget',
          '✓ Nearby location'
        ],
        status: 'Available'
      },
      {
        id: 2,
        lot_id: 102,
        demand_id: 1,
        match_score: 87,
        crop: 'Potato',
        variety: 'Kufri Chandramukhi',
        quantity: 40,
        unit: 'Tonnes',
        quality_grade: 'A',
        expected_price: 2700,
        min_price: 2600,
        max_price: 2750,
        state: 'West Bengal',
        district: 'Howrah',
        distance: '25 km',
        farmer_name: 'Howrah Farmers Co-op',
        farmer_rating: 4.2,
        match_explanation: [
          '✓ Crop matches',
          '✓ Grade matches',
          '✓ Price within budget',
          '⚠ Slightly further away'
        ],
        status: 'Available'
      },
      {
        id: 3,
        lot_id: 103,
        demand_id: 2,
        match_score: 82,
        crop: 'Rice',
        variety: 'Basmati',
        quantity: 30,
        unit: 'Tonnes',
        quality_grade: 'A+',
        expected_price: 1950,
        min_price: 1800,
        max_price: 2000,
        state: 'West Bengal',
        district: 'Nadia',
        distance: '35 km',
        farmer_name: 'Nadia Rice Growers',
        farmer_rating: 4.0,
        match_explanation: [
          '✓ Crop matches',
          '✓ Grade matches',
          '✓ Quantity available',
          '✓ Price within budget'
        ],
        status: 'Available'
      }
    ]
  }

  const applyFilters = () => {
    let result = [...matches]
    
    if (filter === 'high') {
      result = result.filter(m => m.match_score >= 90)
    } else if (filter === 'medium') {
      result = result.filter(m => m.match_score >= 80 && m.match_score < 90)
    } else if (filter === 'low') {
      result = result.filter(m => m.match_score < 80)
    }
    
    setFilteredMatches(result)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-amber-100'
    return 'bg-red-100'
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-[#2d2d2d]">AI Matches</h1>
          <p className="text-gray-500 text-sm mt-1">
            {matches.length} lots matched to your procurement requirements
          </p>
        </div>
        <Link 
          href={`/buyer/${buyerId}/demand/create`}
          className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <Package size={20} />
          Post Demand
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'all' 
              ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          All ({matches.length})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'high' 
              ? 'border-green-600 bg-green-50 text-green-600' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          High Score (90%+)
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filter === 'medium' 
              ? 'border-blue-600 bg-blue-50 text-blue-600' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          Medium (80-89%)
        </button>
      </div>

      {/* Results */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">No Matches Found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any lots matching your requirements.
          </p>
          <Link 
            href={`/buyer/${buyerId}/demand/create`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Package size={20} />
            Post a Demand
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Match Score */}
                <div className="flex-shrink-0 text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBg(match.match_score)} ${getScoreColor(match.match_score)}`}>
                    {match.match_score}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Match</p>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#2d2d2d] text-lg">{match.crop}</h3>
                      {match.variety && (
                        <p className="text-sm text-gray-500">{match.variety}</p>
                      )}
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {match.status || 'Available'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="font-medium">{match.quantity} {match.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Grade</p>
                      <p className="font-medium">{match.quality_grade || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium text-[#1a4d3e]">₹{match.expected_price} / {match.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Distance</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {match.distance || `${Math.floor(Math.random() * 50 + 5)} km`}
                      </p>
                    </div>
                  </div>

                  {/* Farmer Info */}
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users size={14} />
                      {match.farmer_name || 'Farmer/FPO'}
                    </span>
                    {match.farmer_rating && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star size={14} />
                        {match.farmer_rating}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} />
                      {match.district}, {match.state}
                    </span>
                  </div>

                  {/* Match Explanation */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.match_explanation?.map((item, idx) => (
                      <span key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                        {item.startsWith('✓') ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <span className="text-amber-500">⚠</span>
                        )}
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <Link
                    href={`/buyer/${buyerId}/lots/${match.lot_id}`}
                    className="flex items-center gap-1 px-4 py-2 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    View Lot
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}