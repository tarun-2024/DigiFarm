import React from 'react'
import { Tractor, Droplets, Users } from 'lucide-react'
import { IRRIGATION_OPTIONS, FPO_OPTIONS } from '@/lib/constants/onboarding'

export default function FarmDetailsStep({ farmer, updateFarmer, errors }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2d2d2d]">Tell us about your farm</h2>
      <p className="text-gray-500 mt-1 mb-6">
        This helps DigiFarm understand your production capacity and connect you with suitable buyers.
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Farm Size (acres) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tractor size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              value={farmer.farmSize || ''}
              onChange={(e) => updateFarmer('farmSize', e.target.value)}
              placeholder="Enter farm size in acres"
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                ${errors.farmSize ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1a4d3e]'}
              `}
            />
          </div>
          {errors.farmSize && <p className="text-red-500 text-sm mt-1">{errors.farmSize}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
            Irrigation Availability <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {IRRIGATION_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => updateFarmer('irrigation', option)}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all
                  ${farmer.irrigation === option 
                    ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <Droplets size={18} />
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
          {errors.irrigation && <p className="text-red-500 text-sm mt-2">{errors.irrigation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
            Are you a member of an FPO? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FPO_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => {
                  updateFarmer('fpoMember', option)
                  if (option !== 'Yes') updateFarmer('fpoName', '')
                }}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all
                  ${farmer.fpoMember === option 
                    ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >
                <Users size={18} />
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>
          {errors.fpoMember && <p className="text-red-500 text-sm mt-2">{errors.fpoMember}</p>}
        </div>

        {farmer.fpoMember === 'Yes' && (
          <div>
            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
              FPO Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={farmer.fpoName || ''}
              onChange={(e) => updateFarmer('fpoName', e.target.value)}
              placeholder="Enter FPO name"
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all
                ${errors.fpoName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#1a4d3e]'}
              `}
            />
            {errors.fpoName && <p className="text-red-500 text-sm mt-1">{errors.fpoName}</p>}
          </div>
        )}
      </div>
    </div>
  )
}