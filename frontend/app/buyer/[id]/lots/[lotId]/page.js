'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  IndianRupee, 
  MapPin, 
  Calendar,
  FileText,
  Tag,
  Users,
  Star,
  Truck,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { getLot } from '@/lib/api/buyerLots'

export default function LotDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id
  const lotId = params.lotId

  const [lot, setLot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLot()
  }, [lotId])

  const fetchLot = async () => {
    setLoading(true)
    try {
      const response = await getLot(lotId)
      if (response.success) {
        setLot(response.lot)
      } else {
        setError('Failed to fetch lot details')
        // Mock data for development
        setLot(getMockLot())
      }
    } catch (err) {
      setError(err.message || 'Failed to load lot details')
      // Mock data for development
      setLot(getMockLot())
    } finally {
      setLoading(false)
    }
  }

  const getMockLot = () => ({
    id: parseInt(lotId),
    farmer_id: 4,
    crop: 'Potato',
    variety: 'Jyoti',
    quantity: 50,
    unit: 'Tonnes',
    quality_grade: 'A',
    expected_price: 2750,
    minimum_price: 2600,
    state: 'West Bengal',
    district: 'Kolkata',
    village: 'Barasat',
    pickup_location: 'Barasat Farm, Kolkata',
    status: 'Available',
    created_at: '2026-09-05T10:30:00Z',
    available_from: '2026-09-06',
    expected_sale_date: '2026-09-20',
    packaging_type: 'Bags',
    description: 'Fresh potato harvest from our farm. Good quality, suitable for wholesale.',
    farmer_name: 'ABC Farmers Group',
    farmer_rating: 4.5,
    farmer_address: 'Barasat, Kolkata'
  })

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-700',
      'Draft': 'bg-gray-100 text-gray-600',
      'Offers Received': 'bg-blue-100 text-blue-700',
      'Accepted': 'bg-purple-100 text-purple-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !lot) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Lot not found'}</p>
          <Link 
            href={`/buyer/${buyerId}/lots`}
            className="mt-4 inline-block text-[#1a4d3e] font-medium hover:underline"
          >
            ← Back to Browse Lots
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href={`/buyer/${buyerId}/lots`}
          className="text-gray-500 hover:text-[#1a4d3e] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#2d2d2d]">{lot.crop}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lot.status)}`}>
              {lot.status || 'Available'}
            </span>
          </div>
          {lot.variety && (
            <p className="text-gray-500 text-sm mt-1">{lot.variety}</p>
          )}
          <p className="text-xs text-gray-400 font-mono mt-1">Lot ID: {lot.id}</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produce Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <Package size={20} className="text-[#2d7d46]" />
              Produce Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Crop</p>
                <p className="font-medium">{lot.crop}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Variety</p>
                <p className="font-medium">{lot.variety || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quantity</p>
                <p className="font-medium">{lot.quantity} {lot.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quality Grade</p>
                <p className="font-medium">{lot.quality_grade || 'Not Graded'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Packaging</p>
                <p className="font-medium">{lot.packaging_type || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <IndianRupee size={20} className="text-[#2d7d46]" />
              Price Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Expected Price</p>
                <p className="font-medium text-lg text-[#1a4d3e]">₹{lot.expected_price} / {lot.unit}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Minimum Price</p>
                <p className="font-medium">{lot.minimum_price ? `₹${lot.minimum_price} / ${lot.unit}` : 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Estimated Gross Value</p>
                <p className="font-medium">₹{(lot.quantity * lot.expected_price).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#2d7d46]" />
              Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Pickup Location</p>
                <p className="font-medium">{lot.pickup_location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">State</p>
                <p className="font-medium">{lot.state}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">District</p>
                <p className="font-medium">{lot.district || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Village</p>
                <p className="font-medium">{lot.village || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {lot.description && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#2d7d46]" />
                Description
              </h3>
              <p className="text-gray-600">{lot.description}</p>
            </div>
          )}

          {/* Farmer Info */}
          {lot.farmer_name && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#2d7d46]" />
                Supplier Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Farmer/FPO</p>
                  <p className="font-medium">{lot.farmer_name}</p>
                </div>
                {lot.farmer_rating && (
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="flex items-center gap-1">
                      <Star size={16} className="text-amber-500" />
                      <span className="font-medium">{lot.farmer_rating}/5</span>
                    </p>
                  </div>
                )}
                {lot.farmer_address && (
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm">{lot.farmer_address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#2d7d46]" />
              Important Dates
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Available From</p>
                <p className="font-medium">{formatDate(lot.available_from)}</p>
              </div>
              {lot.expected_sale_date && (
                <div>
                  <p className="text-xs text-gray-500">Expected Sale Date</p>
                  <p className="font-medium">{formatDate(lot.expected_sale_date)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500">Listed On</p>
                <p className="font-medium">{formatDate(lot.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4">Actions</h3>
            <div className="space-y-3">
              {lot.status === 'Available' && (
                <>
                  <button
                    onClick={() => router.push(`/buyer/${buyerId}/offers/create?lot=${lot.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <MessageCircle size={18} />
                    Make Offer
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#1a4d3e] text-[#1a4d3e] rounded-lg hover:bg-[#e8f5e9] transition-colors"
                  >
                    <Truck size={18} />
                    Contact Farmer
                  </button>
                </>
              )}
              {lot.status === 'Offers Received' && (
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <CheckCircle size={18} />
                  View Offers
                </button>
              )}
            </div>
          </div>

          {/* Match Score (if from matches) */}
          {lot.match_score && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#2d2d2d] mb-4">AI Match</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#2d7d46]">{lot.match_score}%</div>
                <p className="text-sm text-gray-500 mt-1">Match Score</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}