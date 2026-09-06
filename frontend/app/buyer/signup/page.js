'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Building2,
  MapPin,
  Home,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { createBuyer } from '@/lib/api/buyer'

// Try to import existing logo component
let DigiFarmLogo
try {
  const logoModule = require('@/components/ui/DigiFarmLogo')
  DigiFarmLogo = logoModule.default || logoModule
} catch (e) {
  // Fallback logo
  DigiFarmLogo = ({ size = 'md' }) => {
    const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', xl: 'text-5xl' }
    return (
      <div className="flex items-center gap-3">
        <div className="bg-[#1a4d3e] text-white rounded-full p-2">
          <span className="font-bold text-xl">DF</span>
        </div>
        <span className={`font-bold ${sizes[size] || sizes.md} text-[#1a4d3e]`}>
          Digi<span className="text-[#2d7d46]">Farm</span>
        </span>
      </div>
    )
  }
}

// Constants
const STATES = [
  'West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Uttar Pradesh',
  'Maharashtra', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan',
  'Other'
]

const BUYER_TYPES = [
  'Individual Buyer',
  'Trader',
  'Wholesaler',
  'Retailer',
  'Processor',
  'FPO',
  'Restaurant / Institution'
]

export default function BuyerSignupPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    buyer_type: '',
    state: '',
    district: '',
    village: '',
    address: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [backendError, setBackendError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Business name is required'
        else if (value.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
        else delete newErrors.name
        break
        
      case 'mobile':
        if (!value) newErrors.mobile = 'Mobile number is required'
        else if (!/^[0-9]{10}$/.test(value)) newErrors.mobile = 'Enter a valid 10-digit mobile number'
        else delete newErrors.mobile
        break
        
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
        
      case 'password':
        if (!value) newErrors.password = 'Password is required'
        else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters'
        else delete newErrors.password
        break
        
      case 'confirmPassword':
        if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match'
        else if (!value) newErrors.confirmPassword = 'Please confirm your password'
        else delete newErrors.confirmPassword
        break
        
      case 'buyer_type':
        if (!value) newErrors.buyer_type = 'Please select a buyer type'
        else delete newErrors.buyer_type
        break
        
      case 'state':
        if (!value) newErrors.state = 'Please select a state'
        else delete newErrors.state
        break
        
      case 'district':
        if (!value.trim()) newErrors.district = 'District is required'
        else delete newErrors.district
        break
        
      case 'village':
        if (!value.trim()) newErrors.village = 'Village/City is required'
        else delete newErrors.village
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
    const fields = ['name', 'mobile', 'password', 'confirmPassword', 'buyer_type', 'state', 'district', 'village']
    let isValid = true
    
    fields.forEach(field => {
      const valid = validateField(field, formData[field])
      if (!valid) isValid = false
    })
    
    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Enter a valid email address' }))
      isValid = false
    }
    
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBackendError('')
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsLoading(true)

    try {
      const buyerData = {
        name: formData.name.trim(),
        mobile: formData.mobile,
        email: formData.email.trim() || null,
        password: formData.password,
        buyer_type: formData.buyer_type,
        state: formData.state,
        district: formData.district.trim(),
        village: formData.village.trim(),
        address: formData.address.trim() || null
      }

      const response = await createBuyer(buyerData)

      if (response.success && response.buyer_id) {
        setShowSuccess(true)
        
        // Store buyer data in localStorage
        const buyerSession = {
          id: response.buyer_id,
          name: formData.name.trim(),
          mobile: formData.mobile,
          email: formData.email.trim() || null,
          buyer_type: formData.buyer_type,
          state: formData.state,
          district: formData.district.trim(),
          village: formData.village.trim(),
          role: 'buyer',
          loggedInAt: new Date().toISOString()
        }
        
        localStorage.setItem('digifarm_buyer', JSON.stringify(buyerSession))
        localStorage.setItem('digifarm_user', JSON.stringify(buyerSession))
        
        // Redirect after short delay
        setTimeout(() => {
          router.push(`/buyer/${response.buyer_id}/dashboard`)
        }, 1500)
      } else {
        setBackendError(response.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      setBackendError(error.message || 'Unable to connect to server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#1a4d3e]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DigiFarmLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d]">Create Buyer Account</h1>
          <p className="text-gray-500 mt-2">
            Join DigiFarm and connect with verified agricultural suppliers.
          </p>
        </div>

        {/* Success State */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-700 font-medium">Account created successfully!</p>
              <p className="text-green-600 text-sm">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Backend Error */}
          {backendError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{backendError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Business / Buyer Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter business or buyer name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 10) {
                      handleChange('mobile', value)
                    }
                  }}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Email <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Buyer Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.buyer_type}
                  onChange={(e) => handleChange('buyer_type', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white ${
                    errors.buyer_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select buyer type</option>
                  {BUYER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.buyer_type && <p className="text-red-500 text-sm mt-1">{errors.buyer_type}</p>}
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select state</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="Enter district"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.district ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
              </div>
            </div>

            {/* Village */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Village / City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleChange('village', e.target.value)}
                  placeholder="Enter village or city"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all ${
                    errors.village ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                Business Address <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter full business address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className={`
                w-full py-3 rounded-lg font-medium transition-all duration-200
                flex items-center justify-center gap-2
                ${(isLoading || showSuccess) 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#1a4d3e] text-white hover:bg-opacity-90 shadow-lg'
                }
              `}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Creating Account...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Account Created!
                </>
              ) : (
                <>
                  Create Buyer Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#2d7d46] font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}