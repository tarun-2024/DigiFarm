'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Home,
  Building2,
  Package,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Loader2,
  ShoppingBag,
  Plus
} from 'lucide-react'
import { getBuyer, updateBuyer } from '@/lib/api/buyer'
import { getBuyerDemands } from '@/lib/api/buyerDemands'
import ProfileHeader from '@/components/profile/ProfileHeader'
import InfoCard from '@/components/profile/InfoCard'
import ProfileField from '@/components/profile/ProfileField'

const BUYER_TYPE_OPTIONS = ['Individual Buyer', 'Trader', 'Wholesaler', 'Retailer', 'Processor', 'FPO', 'Restaurant / Institution']
const STATE_OPTIONS = [
  'West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Uttar Pradesh',
  'Maharashtra', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'
]

export default function BuyerProfilePage() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id

  const [buyer, setBuyer] = useState(null)
  const [demands, setDemands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    fetchData()
  }, [buyerId])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch buyer profile
      const buyerResponse = await getBuyer(buyerId)
      if (buyerResponse.success) {
        setBuyer(buyerResponse.buyer)
        setEditData(buyerResponse.buyer)
      } else {
        setError('Failed to load profile')
        setLoading(false)
        return
      }

      // Fetch buyer demands
      try {
        const demandsResponse = await getBuyerDemands(buyerId)
        if (demandsResponse.success) {
          setDemands(demandsResponse.demands || [])
        }
      } catch (e) {
        console.error('Failed to fetch demands:', e)
      }
    } catch (err) {
      setError(err.message || 'Unable to load your profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = () => {
    if (isEditing) {
      setEditData(buyer)
      setSaveError('')
    }
    setIsEditing(!isEditing)
  }

  const handleFieldChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    setSaveError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      const updateData = {
        name: editData.name,
        email: editData.email,
        buyer_type: editData.buyer_type,
        state: editData.state,
        district: editData.district,
        village: editData.village,
        address: editData.address,
      }

      const response = await updateBuyer(buyerId, updateData)

      if (response.success) {
        const updatedBuyer = response.buyer || editData
        setBuyer(updatedBuyer)
        setEditData(updatedBuyer)
        setSaveSuccess(true)
        setIsEditing(false)

        // Update localStorage
        try {
          const stored = localStorage.getItem('digifarm_user')
          if (stored) {
            const user = JSON.parse(stored)
            const updatedUser = {
              ...user,
              name: updatedBuyer.name,
              email: updatedBuyer.email,
              buyer_type: updatedBuyer.buyer_type,
              state: updatedBuyer.state,
              district: updatedBuyer.district,
              village: updatedBuyer.village,
            }
            localStorage.setItem('digifarm_user', JSON.stringify(updatedUser))
          }
          const storedBuyer = localStorage.getItem('digifarm_buyer')
          if (storedBuyer) {
            const buyerData = JSON.parse(storedBuyer)
            localStorage.setItem('digifarm_buyer', JSON.stringify({
              ...buyerData,
              ...updatedBuyer
            }))
          }
        } catch (e) {
          console.error('Failed to update localStorage:', e)
        }

        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        setSaveError(response.message || 'Failed to update profile')
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not available'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
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
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">Unable to Load Profile</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!buyer) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <AlertCircle size={40} className="text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">Profile Not Found</h3>
          <p className="text-gray-600">We couldn't find your profile information.</p>
        </div>
      </div>
    )
  }

  const location = buyer.district && buyer.state 
    ? `${buyer.district}, ${buyer.state}`
    : buyer.state || 'Location not set'

  // Demand statistics
  const totalDemands = demands.length
  const activeDemands = demands.filter(d => d.status === 'Active' || d.status === 'Matching').length
  const fulfilledDemands = demands.filter(d => d.status === 'Fulfilled' || d.status === 'Partially Fulfilled').length
  const totalQuantity = demands.reduce((sum, d) => sum + (d.quantity || 0), 0)

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">Profile updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{saveError}</p>
        </div>
      )}

      {/* Profile Header */}
      <ProfileHeader
        name={buyer.name}
        role="Buyer"
        mobile={buyer.mobile}
        email={buyer.email}
        location={location}
        status={buyer.status || 'Active'}
        buyerType={buyer.buyer_type}
        onEdit={handleEditClick}
        isEditing={isEditing}
        avatar={buyer.name?.[0] || 'B'}
      />

      {/* Edit/Save Buttons when editing */}
      {isEditing && (
        <div className="mt-4 flex gap-3 justify-end">
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Business Information */}
        <InfoCard title="Business Information" icon={Building2}>
          <ProfileField
            label="Business / Buyer Name"
            value={editData.name}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('name', v)}
            icon={User}
            required
          />
          <ProfileField
            label="Buyer Type"
            value={editData.buyer_type}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('buyer_type', v)}
            icon={Building2}
            options={BUYER_TYPE_OPTIONS}
            required
          />
          <ProfileField
            label="Mobile Number"
            value={editData.mobile}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('mobile', v)}
            icon={Phone}
            required
            disabled={true}
          />
          <ProfileField
            label="Email"
            value={editData.email}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('email', v)}
            icon={Mail}
            type="email"
          />
          <ProfileField
            label="State"
            value={editData.state}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('state', v)}
            icon={MapPin}
            options={STATE_OPTIONS}
            required
          />
          <ProfileField
            label="District"
            value={editData.district}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('district', v)}
            icon={MapPin}
            required
          />
          <ProfileField
            label="Village / City"
            value={editData.village}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('village', v)}
            icon={Home}
            required
          />
          <ProfileField
            label="Business Address"
            value={editData.address}
            isEditing={isEditing}
            onChange={(v) => handleFieldChange('address', v)}
            icon={Building2}
          />
        </InfoCard>

        {/* Account Information */}
        <InfoCard title="Account Information" icon={Calendar}>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Buyer ID</label>
            <p className="text-[#2d2d2d] font-mono text-sm">{buyer.id || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Account Status</label>
            <p className="flex items-center gap-2">
              <span className="text-[#2d7d46] font-medium">{buyer.status || 'Active'}</span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle size={14} />
                Verified
              </span>
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Joined On</label>
            <p className="text-[#2d2d2d]">{formatDate(buyer.created_at)}</p>
          </div>
          {buyer.updated_at && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
              <p className="text-[#2d2d2d] text-sm">{formatDate(buyer.updated_at)}</p>
            </div>
          )}
        </InfoCard>
      </div>

      {/* Demand Summary */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <InfoCard title="Demand Summary" icon={ShoppingBag}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Total Demands</label>
              <p className="text-2xl font-bold text-[#1a4d3e]">{totalDemands}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Active Demands</label>
              <p className="text-2xl font-bold text-[#2d7d46]">{activeDemands}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fulfilled</label>
              <p className="text-2xl font-bold text-gray-600">{fulfilledDemands}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Total Quantity</label>
              <p className="text-2xl font-bold text-[#1a4d3e]">{totalQuantity} T</p>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Quick Actions" icon={TrendingUp}>
          <div className="space-y-3">
            <Link
              href={`/buyer/${buyerId}/demand/create`}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors w-full justify-center"
            >
              <Plus size={18} />
              Post New Demand
            </Link>
            <Link
              href={`/buyer/${buyerId}/lots`}
              className="flex items-center gap-2 px-4 py-2 border border-[#1a4d3e] text-[#1a4d3e] rounded-lg hover:bg-[#e8f5e9] transition-colors w-full justify-center"
            >
              <Package size={18} />
              Browse Lots
            </Link>
            <Link
              href={`/buyer/${buyerId}/matches`}
              className="flex items-center gap-2 px-4 py-2 border border-[#2d7d46] text-[#2d7d46] rounded-lg hover:bg-[#e8f5e9] transition-colors w-full justify-center"
            >
              <TrendingUp size={18} />
              View AI Matches
            </Link>
          </div>
        </InfoCard>
      </div>

      {/* Recent Demands */}
      {demands.length > 0 && (
        <div className="mt-6">
          <InfoCard title="Recent Demands" icon={Package}>
            <div className="space-y-3">
              {demands.slice(0, 5).map((demand) => (
                <div key={demand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#2d2d2d]">{demand.crop}</p>
                    <p className="text-sm text-gray-500">{demand.quantity} {demand.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {demand.matches > 0 && (
                      <span className="text-xs text-[#2d7d46] font-medium">
                        {demand.matches} matches
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                      {demand.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {demands.length > 5 && (
              <div className="mt-3 text-center">
                <Link
                  href={`/buyer/${buyerId}/demands`}
                  className="text-[#2d7d46] font-medium hover:underline text-sm"
                >
                  View All Demands →
                </Link>
              </div>
            )}
          </InfoCard>
        </div>
      )}
    </div>
  )
}