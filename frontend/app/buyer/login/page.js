'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { loginBuyer } from '@/lib/api/buyer'

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

export default function BuyerLoginPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [backendError, setBackendError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already logged in
    try {
      const user = localStorage.getItem('digifarm_user')
      if (user) {
        const parsed = JSON.parse(user)
        if (parsed.role === 'buyer' && parsed.id) {
          router.push(`/buyer/${parsed.id}/dashboard`)
        }
      }
    } catch (e) {}
  }, [router])

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'mobile':
        if (!value) newErrors.mobile = 'Mobile number is required'
        else if (!/^[0-9]{10}$/.test(value)) newErrors.mobile = 'Enter a valid 10-digit mobile number'
        else delete newErrors.mobile
        break
        
      case 'password':
        if (!value) newErrors.password = 'Password is required'
        else if (value.length < 6) newErrors.password = 'Password must be at least 6 characters'
        else delete newErrors.password
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
    const fields = ['mobile', 'password']
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
      const credentials = {
        mobile: formData.mobile,
        password: formData.password
      }

      const response = await loginBuyer(credentials)

      if (response.success && response.buyer) {
        setShowSuccess(true)
        
        const buyer = response.buyer
        
        // Store buyer data in localStorage
        const buyerSession = {
          id: buyer.id,
          name: buyer.name,
          mobile: buyer.mobile,
          email: buyer.email || null,
          buyer_type: buyer.buyer_type,
          state: buyer.state,
          district: buyer.district,
          village: buyer.village,
          role: 'buyer',
          loggedInAt: new Date().toISOString()
        }
        
        localStorage.setItem('digifarm_buyer', JSON.stringify(buyerSession))
        localStorage.setItem('digifarm_user', JSON.stringify(buyerSession))
        
        // Redirect after short delay
        setTimeout(() => {
          router.push(`/buyer/${buyer.id}/dashboard`)
        }, 1500)
      } else {
        setBackendError(response.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
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
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DigiFarmLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d]">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            Sign in to your buyer account
          </p>
        </div>

        {/* Success State */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-700 font-medium">Login successful!</p>
              <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
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
            {/* Mobile Number */}
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
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-[#1a4d3e] focus:ring-[#1a4d3e]" />
                Remember me
              </label>
              <button type="button" className="text-sm text-[#2d7d46] hover:underline">
                Forgot password?
              </button>
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
                  Signing In...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle size={20} />
                  Redirecting...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link href="/buyer/signup" className="text-[#2d7d46] font-medium hover:underline">
                Create Buyer Account
              </Link>
            </p>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-[#2d7d46]" />
            Secure Login
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-[#2d7d46]" />
            SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-[#2d7d46]" />
            DigiFarm Trust
          </span>
        </div>
      </div>
    </div>
  )
}