'use client'

import { useState } from 'react'
import { 
  Sprout, 
  Package, 
  IndianRupee, 
  Calendar, 
  MapPin, 
  FileText,
  Tag,
  X
} from 'lucide-react'

const CROP_OPTIONS = [
  'Potato', 'Rice', 'Wheat', 'Tomato', 'Onion', 'Maize',
  'Mustard', 'Brinjal', 'Cabbage', 'Cauliflower', 'Other'
]

const UNIT_OPTIONS = ['Quintal', 'Tonnes', 'Kg']

const GRADE_OPTIONS = ['Grade A', 'Grade B', 'Grade C', 'Not Graded']

const PACKAGING_OPTIONS = ['Loose', 'Bags', 'Crates', 'Other']

const STATE_OPTIONS = [
  'West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Uttar Pradesh',
  'Maharashtra', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'
]

const DISTRICT_OPTIONS = {
  'West Bengal': ['Nadia', 'North 24 Parganas', 'South 24 Parganas', 'Hooghly', 
                  'Bardhaman', 'Murshidabad', 'Malda', 'Bankura', 'Birbhum', 
                  'Howrah', 'Kolkata'],
}

export default function CreateLotForm({ 
  lotData, 
  updateLotData, 
  onSubmit, 
  isLoading,
  farmerId 
}) {
  const [errors, setErrors] = useState({})

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
      case 'expected_price':
        if (!value || value <= 0) newErrors.expected_price = 'Please enter a valid price'
        else delete newErrors.expected_price
        break
      case 'available_from':
        if (!value) newErrors.available_from = 'Please select a date'
        else delete newErrors.available_from
        break
      case 'pickup_location':
        if (!value.trim()) newErrors.pickup_location = 'Please enter a pickup location'
        else delete newErrors.pickup_location
        break
      case 'state':
        if (!value) newErrors.state = 'Please select a state'
        else delete newErrors.state
        break
      default:
        break
    }
    setErrors(newErrors)
  }

  const handleChange = (field, value) => {
    updateLotData(field, value)
    validateField(field, value)
    
    // Reset district if state changes
    if (field === 'state') {
      updateLotData('district', '')
    }
  }

  const getDistricts = () => {
    return DISTRICT_OPTIONS[lotData.state] || []
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Section 1: Produce Details */}
      <div>
        <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
          <Sprout size={20} className="text-[#2d7d46]" />
          Produce Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crop */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Crop <span className="text-red-500">*</span>
            </label>
            <select
              value={lotData.crop}
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

          {/* Variety */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Variety
            </label>
            <input
              type="text"
              value={lotData.variety}
              onChange={(e) => handleChange('variety', e.target.value)}
              placeholder="Enter variety (e.g., HD-2967)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={lotData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="Enter quantity"
                min="0"
                step="0.01"
                className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <select
                value={lotData.unit}
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

          {/* Quality Grade */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Quality Grade <span className="text-red-500">*</span>
            </label>
            <select
              value={lotData.quality_grade}
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
      </div>

      {/* Section 2: Price & Sale Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
          <IndianRupee size={20} className="text-[#2d7d46]" />
          Price & Sale Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expected Price */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Expected Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={lotData.expected_price}
                onChange={(e) => handleChange('expected_price', e.target.value)}
                placeholder="Enter expected price"
                min="0"
                step="1"
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                  errors.expected_price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                / {lotData.unit || 'unit'}
              </span>
            </div>
            {errors.expected_price && <p className="text-red-500 text-sm mt-1">{errors.expected_price}</p>}
          </div>

          {/* Minimum Price */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Minimum Acceptable Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={lotData.minimum_price}
                onChange={(e) => handleChange('minimum_price', e.target.value)}
                placeholder="Optional"
                min="0"
                step="1"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                / {lotData.unit || 'unit'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Minimum price you're willing to accept</p>
          </div>

          {/* Available From */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Available From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={lotData.available_from}
                onChange={(e) => handleChange('available_from', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                  errors.available_from ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.available_from && <p className="text-red-500 text-sm mt-1">{errors.available_from}</p>}
          </div>

          {/* Expected Sale Date */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Expected Sale Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={lotData.expected_sale_date}
                onChange={(e) => handleChange('expected_sale_date', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">When do you expect to sell this produce?</p>
          </div>
        </div>
      </div>

      {/* Section 3: Location */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-[#2d7d46]" />
          Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Location */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lotData.pickup_location}
              onChange={(e) => handleChange('pickup_location', e.target.value)}
              placeholder="Enter pickup location address"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                errors.pickup_location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.pickup_location && <p className="text-red-500 text-sm mt-1">{errors.pickup_location}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              value={lotData.state}
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

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              District
            </label>
            <select
              value={lotData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              disabled={!lotData.state}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select district</option>
              {getDistricts().map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Village
            </label>
            <input
              type="text"
              value={lotData.village}
              onChange={(e) => handleChange('village', e.target.value)}
              placeholder="Enter village name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Additional Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
          <FileText size={20} className="text-[#2d7d46]" />
          Additional Information
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Description
            </label>
            <textarea
              value={lotData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add information about your produce, quality, packaging, or other requirements..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all resize-y"
            />
          </div>

          {/* Packaging Type */}
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Packaging Type
            </label>
            <select
              value={lotData.packaging_type}
              onChange={(e) => handleChange('packaging_type', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white"
            >
              <option value="">Select packaging type</option>
              {PACKAGING_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.location.href = `/farmer/${farmerId}/lots`}
          className="px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              Creating...
            </>
          ) : (
            <>
              <Package size={20} />
              Create Lot
            </>
          )}
        </button>
      </div>
    </form>
  )
}