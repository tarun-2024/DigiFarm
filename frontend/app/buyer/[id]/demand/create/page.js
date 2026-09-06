'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  IndianRupee, 
  Calendar, 
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Tag
} from 'lucide-react'
import { createDemand } from '@/lib/api/buyerDemands'

const CROP_OPTIONS = [
  'Potato', 'Rice', 'Wheat', 'Tomato', 'Onion', 'Maize',
  'Mustard', 'Brinjal', 'Cabbage', 'Cauliflower', 'Other'
]

const UNIT_OPTIONS = ['Tonnes', 'Quintals', 'Kg']

const GRADE_OPTIONS = ['Grade A', 'Grade B', 'Grade C', 'Not Graded']

const STATE_OPTIONS = [
  'West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Uttar Pradesh',
  'Maharashtra', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'
]

const PACKAGING_OPTIONS = ['Loose', 'Bags', 'Crates', 'Other']

export default function CreateDemandPage() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id

  const [formData, setFormData] = useState({
    crop: '',
    variety: '',
    quantity: '',
    unit: 'Tonnes',
    quality_grade: '',
    min_price: '',
    max_price: '',
    required_by: '',
    state: '',
    district: '',
    pickup_location: '',
    packaging_type: '',
    additional_requirements: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [backendError, setBackendError] = useState('')
  const [success, setSuccess] = useState(false)

  // Try to load buyer profile for location prefill
  useEffect(() => {
    try {
      const storedBuyer = localStorage.getItem('digifarm_buyer')
      if (storedBuyer) {
        const buyer = JSON.parse(storedBuyer)
        setFormData(prev => ({
          ...prev,
          state: buyer.state || '',
          district: buyer.district || '',
          pickup_location: buyer.village || '',
        }))
      }
    } catch (e) {
      console.error('Failed to load buyer profile')
    }
  }, [])

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'crop':
        if (!value) newErrors.crop = 'Please select a crop'
        else delete newErrors.crop
        break
      case 'quantity':
        if (!value || value <= 0) newErrors.quantity = 'Please enter a valid quantity'
        else delete newErrors.quantity
        break
      case 'quality_grade':
        if (!value) newErrors.quality_grade = 'Please select a quality grade'
        else delete newErrors.quality_grade
        break
      case 'required_by':
        if (!value) newErrors.required_by = 'Please select a required by date'
        else delete newErrors.required_by
        break
      case 'state':
        if (!value) newErrors.state = 'Please select a state'
        else delete newErrors.state
        break
      default:
        break
    }
    setErrors(newErrors)
    return !newErrors[field]
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setBackendError('')
    validateField(field, value)
  }

  const validateForm = () => {
    const fields = ['crop', 'quantity', 'quality_grade', 'required_by', 'state']
    let isValid = true
    
    fields.forEach(field => {
      const valid = validateField(field, formData[field])
      if (!valid) isValid = false
    })
    
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBackendError('')
    
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsLoading(true)

    try {
      const demandData = {
        crop: formData.crop,
        variety: formData.variety || null,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        quality_grade: formData.quality_grade,
        min_price: formData.min_price ? parseFloat(formData.min_price) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price) : null,
        required_by: formData.required_by,
        state: formData.state,
        district: formData.district || null,
        pickup_location: formData.pickup_location || null,
        packaging_type: formData.packaging_type || null,
        additional_requirements: formData.additional_requirements || null
      }

      const response = await createDemand(buyerId, demandData)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/buyer/${buyerId}/demands`)
        }, 1500)
      } else {
        setBackendError(response.message || 'Failed to post demand')
      }
    } catch (error) {
      console.error('Demand creation error:', error)
      setBackendError(error.message || 'Unable to connect to server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href={`/buyer/${buyerId}/demands`}
          className="text-gray-500 hover:text-[#1a4d3e] transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#2d2d2d]">Post a Demand</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a procurement requirement and we'll find matching farmer lots
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-green-700 font-medium">Demand posted successfully!</p>
            <p className="text-green-600 text-sm">We will match your requirement with available farmer/FPO supply.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {backendError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{backendError}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop & Variety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Crop <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.crop}
                onChange={(e) => handleChange('crop', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white ${
                  errors.crop ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select crop</option>
                {CROP_OPTIONS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
              {errors.crop && <p className="text-red-500 text-sm mt-1">{errors.crop}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Variety
              </label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => handleChange('variety', e.target.value)}
                placeholder="Enter variety (optional)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Required Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  step="0.01"
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <select
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] bg-white"
                >
                  {UNIT_OPTIONS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Quality Grade <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.quality_grade}
                onChange={(e) => handleChange('quality_grade', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white ${
                  errors.quality_grade ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select grade</option>
                {GRADE_OPTIONS.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.quality_grade && <p className="text-red-500 text-sm mt-1">{errors.quality_grade}</p>}
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Minimum Price (₹ / {formData.unit})
              </label>
              <input
                type="number"
                value={formData.min_price}
                onChange={(e) => handleChange('min_price', e.target.value)}
                placeholder="Enter minimum price"
                min="0"
                step="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Maximum Price (₹ / {formData.unit})
              </label>
              <input
                type="number"
                value={formData.max_price}
                onChange={(e) => handleChange('max_price', e.target.value)}
                placeholder="Enter maximum price"
                min="0"
                step="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>
          </div>

          {/* Required By */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Required By <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={formData.required_by}
                onChange={(e) => handleChange('required_by', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                  errors.required_by ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.required_by && <p className="text-red-500 text-sm mt-1">{errors.required_by}</p>}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select state</option>
                {STATE_OPTIONS.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange('district', e.target.value)}
                placeholder="Enter district"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Preferred Pickup Location
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.pickup_location}
                onChange={(e) => handleChange('pickup_location', e.target.value)}
                placeholder="Enter preferred pickup location"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>
          </div>

          {/* Packaging */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Packaging Requirement
            </label>
            <select
              value={formData.packaging_type}
              onChange={(e) => handleChange('packaging_type', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white"
            >
              <option value="">Select packaging type</option>
              {PACKAGING_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Additional Requirements */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Additional Requirements
            </label>
            <textarea
              value={formData.additional_requirements}
              onChange={(e) => handleChange('additional_requirements', e.target.value)}
              placeholder="Add any additional requirements, quality specifications, or preferences..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push(`/buyer/${buyerId}/demands`)}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Posting...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  Posted!
                </>
              ) : (
                <>
                  <Package size={20} />
                  Post Demand
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}