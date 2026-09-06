'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

export default function FarmerSaleWindowPage() {
  const [selectedOption, setSelectedOption] = useState('now')

  const scenarios = {
    now: {
      label: 'SELL NOW',
      price: 2650,
      transport: 60,
      storage: 0,
      spoilage: 0,
      liquidity: 0,
      net: 2590,
      color: 'green',
      icon: CheckCircle
    },
    '3days': {
      label: 'WAIT 3 DAYS',
      price: 2710,
      transport: 60,
      storage: 120,
      spoilage: 40,
      liquidity: 50,
      net: 2440,
      color: 'amber',
      icon: AlertCircle
    },
    '7days': {
      label: 'WAIT 7 DAYS',
      price: 2730,
      transport: 60,
      storage: 280,
      spoilage: 100,
      liquidity: 100,
      net: 2190,
      color: 'red',
      icon: XCircle
    }
  }

  const selectedScenario = scenarios[selectedOption]

  return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d2d2d]">When Should I Sell?</h1>
          <p className="text-gray-500 mt-1">Compare selling scenarios</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(scenarios).map(([key, scenario]) => {
            const isSelected = selectedOption === key
            return (
              <button
                key={key}
                onClick={() => setSelectedOption(key)}
                className={`
                  p-6 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected 
                    ? `border-${scenario.color}-500 bg-${scenario.color}-50 shadow-lg` 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <h3 className={`font-bold text-lg ${isSelected ? `text-${scenario.color}-700` : 'text-[#2d2d2d]'}`}>
                  {scenario.label}
                </h3>
                <p className="text-2xl font-bold text-[#2d2d2d] mt-2">₹{scenario.price}</p>
              </button>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-[#2d2d2d] mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Expected Future Price</span>
                <span className="font-bold">₹{selectedScenario.price}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">+ Demand Premium</span>
                <span className="font-bold text-green-600">+ ₹40</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">- Storage Cost</span>
                <span className="font-bold text-red-600">- ₹{selectedScenario.storage}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">- Transport Cost</span>
                <span className="font-bold text-red-600">- ₹{selectedScenario.transport}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">- Spoilage Risk</span>
                <span className="font-bold text-red-600">- ₹{selectedScenario.spoilage}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">- Liquidity Constraint</span>
                <span className="font-bold text-red-600">- ₹{selectedScenario.liquidity}</span>
              </div>
              <div className="flex justify-between py-3 bg-[#e8f5e9] rounded-lg px-4">
                <span className="font-bold text-[#2d2d2d]">Net Realization</span>
                <span className="font-bold text-[#2d7d46] text-xl">₹{selectedScenario.net}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-[#2d2d2d] mb-4">Final Recommendation</h3>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-600">SELL NOW</h2>
              <p className="text-gray-600 mt-4 max-w-md mx-auto">
                Additional expected price gain does not compensate for storage cost 
                and farmer liquidity requirements.
              </p>
              <button className="btn-primary mt-6">
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}