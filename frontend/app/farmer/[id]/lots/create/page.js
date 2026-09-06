'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { createLot } from '@/lib/api/lots'
import CreateLotForm from '@/components/lots/CreateLotForm'
import LotSummary from '@/components/lots/LotSummary'

export default function CreateLotPage() {
  const params = useParams()
  const router = useRouter()
  const farmerId = params.id

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [lotData, setLotData] = useState({
    crop: '',
    variety: '',
    quantity: '',
    unit: 'quintal',
    quality_grade: '',
    expected_price: '',
    minimum_price: '',
    available_from: '',
    expected_sale_date: '',
    pickup_location: '',
    state: '',
    district: '',
    village: '',
    description: '',
    packaging_type: '',
  })

  // Try to load farmer profile for location prefill
  useEffect(() => {
    const loadFarmerProfile = async () => {
      try {
        // Try to get from localStorage first (from onboarding)
        const savedProfile = localStorage.getItem('digifarm_farmer_profile')
        if (savedProfile) {
          const profile = JSON.parse(savedProfile)
          setLotData(prev => ({
            ...prev,
            state: profile.state || '',
            district: profile.district || '',
            village: profile.village || '',
            pickup_location: profile.village || '',
          }))
        }
      } catch (e) {
        console.error('Failed to load farmer profile')
      }
    }
    loadFarmerProfile()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validate required fields
      const required = ['crop', 'quantity', 'quality_grade', 'expected_price', 'available_from', 'pickup_location', 'state']
      for (const field of required) {
        if (!lotData[field]) {
          setError(`Please fill in all required fields`)
          setIsLoading(false)
          return
        }
      }

      // Prepare data for API
      const lotPayload = {
        ...lotData,
        quantity: parseFloat(lotData.quantity),
        expected_price: parseFloat(lotData.expected_price),
        minimum_price: lotData.minimum_price ? parseFloat(lotData.minimum_price) : null,
        farmer_id: parseInt(farmerId),
      }

      const response = await createLot(farmerId, lotPayload)
      
      if (response.success) {
        setSuccess(true)
        // Redirect after showing success
        setTimeout(() => {
          router.push(`/farmer/${farmerId}/lots`)
        }, 1500)
      } else {
        setError(response.message || 'Failed to create lot')
      }
    } catch (err) {
      setError(err.message || 'Failed to create lot. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateLotData = (field, value) => {
    setLotData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  // Calculate estimated gross value
  const calculateGrossValue = () => {
    const quantity = parseFloat(lotData.quantity)
    const price = parseFloat(lotData.expected_price)
    if (!quantity || !price || isNaN(quantity) || isNaN(price)) return null
    return quantity * price
  }

  const grossValue = calculateGrossValue()

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href={`/farmer/${farmerId}/lots`}
            className="text-gray-500 hover:text-[#1a4d3e] transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#2d2d2d]">Create New Lot</h1>
            <p className="text-gray-500 text-sm mt-1">
              Create a saleable batch of your produce and connect with verified buyers
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-700 font-medium">Lot created successfully!</p>
            <p className="text-green-600 text-sm">Redirecting to My Lots...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Main Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <CreateLotForm 
              lotData={lotData}
              updateLotData={updateLotData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              farmerId={farmerId}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <LotSummary 
            lotData={lotData}
            grossValue={grossValue}
          />
        </div>
      </div>
    </div>
  )
}