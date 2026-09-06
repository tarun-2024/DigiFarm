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
  Edit,
  MessageCircle,
  TrendingUp
} from 'lucide-react'
import { getLot } from '@/lib/api/lots'

const STATUS_COLORS = {
  'Available': 'bg-green-100 text-green-700',
  'Draft': 'bg-gray-100 text-gray-600',
  'Offers Received': 'bg-blue-100 text-blue-700',
  'Accepted': 'bg-purple-100 text-purple-700',
  'In Logistics': 'bg-amber-100 text-amber-700',
  'Delivered': 'bg-blue-100 text-blue-700',
  'Sold': 'bg-emerald-100 text-emerald-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700'
}

export default function LotDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const farmerId = params.id
  const lotId = params.lotId

  const [lot, setLot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLot()
  }, [farmerId, lotId])

  const fetchLot = async () => {
    setLoading(true)
    try {
      const response = await getLot(farmerId, lotId)
      if (response.success) {
        setLot(response.lot)
      } else {
        setError('Failed to fetch lot details')
      }
    } catch (err) {
      setError(err.message || 'Failed to load lot details')
      // Mock data for development
      setLot({
        id: lotId,
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
        packaging_type: 'Bags'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !lot) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error || 'Lot not found'}</p>
          <Link 
            href={`/farmer/${farmerId}/lots`}
            className="mt-4 inline-block text-[#1a4d3e] font-medium hover:underline"
          >
            ← Back to My Lots
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
          href={`/farmer/${farmerId}/lots`}
          className="text-gray-500 hover:text-[#1a4d3e] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#2d2d2d]">{lot.crop}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lot.status)}`}>
              {lot.status || 'Draft'}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-mono mt-1">ID: {lot.id}</p>
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
                <p className="font-medium">₹{lot.expected_price} / {lot.unit}</p>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#2d7d46]" />
              Dates
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="font-medium">{formatDate(lot.created_at)}</p>
              </div>
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
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-[#2d2d2d] mb-4">Actions</h3>
            <div className="space-y-2">
              {lot.status === 'Draft' || lot.status === 'Available' ? (
                <Link
                  href={`/farmer/${farmerId}/lots/${lot.id}/edit`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Edit size={18} />
                  Edit Lot
                </Link>
              ) : null}
              
              {lot.status === 'Available' ? (
                <Link
                  href={`/farmer/${farmerId}/matches?lot=${lot.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2d7d46] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <TrendingUp size={18} />
                  View Matches
                </Link>
              ) : null}
              
              {lot.status === 'Offers Received' ? (
                <Link
                  href={`/farmer/${farmerId}/offers?lot=${lot.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <MessageCircle size={18} />
                  View Offers
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}