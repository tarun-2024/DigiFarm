'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'

const roles = [
  { id: 'farmer', label: 'Farmer', color: 'bg-[#2d7d46]' },
  { id: 'fpo', label: 'FPO', color: 'bg-blue-600' },
  { id: 'buyer', label: 'Buyer', color: 'bg-purple-600' },
  { id: 'admin', label: 'Admin', color: 'bg-amber-600' }
]

export default function SignInForm({ onSuccess }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'farmer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }
    
    setShowSuccess(true)
    
    const userData = {
      name: formData.role === 'farmer' ? 'Rajesh Kumar' : 
             formData.role === 'buyer' ? 'Ananya Sharma' : 'User',
      email: formData.email,
      role: formData.role,
      loggedInAt: new Date().toISOString()
    }
    
    localStorage.setItem('digifarm_user', JSON.stringify(userData))
    
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(userData)
      } else {
        if (formData.role === 'farmer') {
          const isOnboardingComplete = localStorage.getItem('digifarm_onboarding_complete') === 'true'
          router.push(isOnboardingComplete ? '/farmer/dashboard' : '/onboarding/farmer')
        } else {
          router.push(`/${formData.role}/dashboard`)
        }
      }
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
          Continue as
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {roles.map((role) => {
            const isSelected = formData.role === role.id
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, role: role.id }))
                  setError('')
                }}
                className={`
                  flex items-center justify-center gap-2 p-2 rounded-lg border-2 transition-all text-sm
                  ${isSelected 
                    ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <div className={`${role.color} text-white p-1 rounded-full w-6 h-6 flex items-center justify-center`}>
                  <span className="text-xs font-bold">{role.label[0]}</span>
                </div>
                <span className="font-medium">{role.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-green-700 text-sm font-medium">Login successful! Redirecting...</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
          Email Address
        </label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
            disabled={isLoading || showSuccess}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
          Password
        </label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Enter your password"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"
            disabled={isLoading || showSuccess}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

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
            Signing in...
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
    </form>
  )
}