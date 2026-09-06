import React from 'react'
import { Wallet, Clock, TrendingUp, Warehouse, IndianRupee } from 'lucide-react'
import { PAYMENT_OPTIONS, STORAGE_OPTIONS, STORAGE_DURATIONS } from '@/lib/constants/onboarding'

export default function SellingPreferencesStep({ farmer, updateFarmer, errors }) {
  const getPaymentIcon = (value) => {
    switch (value) {
      case 'immediate': return Wallet
      case 'medium': return Clock
      case 'long': return TrendingUp
      default: return Wallet
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2d2d2d]">How do you want to sell?</h2>
      <p className="text-gray-500 mt-1 mb-6">
        Your preferences help DigiFarm recommend the right time and market for you.
      </p>

      <div className="space-y-6">
        {/* Payment Requirement */}
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
            When do you need payment? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_OPTIONS.map((option) => {
              const Icon = getPaymentIcon(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => updateFarmer('paymentNeed', option.value)}
                  className={`
                    p-4 border-2 rounded-lg text-left transition-all
                    ${farmer.paymentNeed === option.value 
                      ? 'border-[#1a4d3e] bg-[#e8f5e9]' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={20} className={farmer.paymentNeed === option.value ? 'text-[#1a4d3e]' : 'text-gray-400'} />
                  <p className="font-medium text-sm mt-2">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </button>
              )
            })}
          </div>
          {errors.paymentNeed && <p className="text-red-500 text-sm mt-2">{errors.paymentNeed}</p>}
        </div>

        {/* Storage */}
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
            Do you have storage available? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {STORAGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => {
                  updateFarmer('storageAvailable', option)
                  if (option === 'No') updateFarmer('storageDuration', '')
                }}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all
                  ${farmer.storageAvailable === option 
                    ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <Warehouse size={18} />
                <span>{option}</span>
              </button>
            ))}
          </div>
          {errors.storageAvailable && <p className="text-red-500 text-sm mt-2">{errors.storageAvailable}</p>}
        </div>

        {/* Storage Duration - Conditional */}
        {farmer.storageAvailable === 'Yes' && (
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              Maximum Storage Duration <span className="text-red-500">*</span>
            </label>
            <select
              value={farmer.storageDuration || ''}
              onChange={(e) => updateFarmer('storageDuration', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all bg-white
                ${errors.storageDuration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1a4d3e]'}
              `}
            >
              <option value="">Select duration</option>
              {STORAGE_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
            {errors.storageDuration && <p className="text-red-500 text-sm mt-1">{errors.storageDuration}</p>}
          </div>
        )}

        {/* Minimum Acceptable Price */}
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Minimum Acceptable Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={farmer.minimumPrice || ''}
              onChange={(e) => updateFarmer('minimumPrice', e.target.value)}
              placeholder="Enter minimum price per quintal"
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                ${errors.minimumPrice ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1a4d3e]'}
              `}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            DigiFarm will use this preference when evaluating selling opportunities.
          </p>
          {errors.minimumPrice && <p className="text-red-500 text-sm mt-1">{errors.minimumPrice}</p>}
        </div>
      </div>
    </div>
  )
}