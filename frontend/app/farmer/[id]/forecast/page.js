'use client'

import { useState } from 'react'
import ForecastChart from '@/components/charts/ForecastChart'
import { generatePriceHistory } from '@/lib/mock-data'

export default function FarmerForecastPage() {
  const [crop, setCrop] = useState('Potato')
  
  const currentPrice = 2650
  const forecast3Day = 2690
  const forecast7Day = 2720
  const forecast14Day = 2760
  const confidence = 78

  const historicalData = generatePriceHistory(2500, 30, 80)
  const forecastData = [
    { date: 'Day 1', price: forecast3Day },
    { date: 'Day 3', price: forecast3Day + 20 },
    { date: 'Day 7', price: forecast7Day },
    { date: 'Day 14', price: forecast14Day }
  ]

  return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2d2d2d]">AI Price Forecast</h1>
            <p className="text-gray-500 mt-1">Predictive analysis for better selling decisions</p>
          </div>
          <select 
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] mt-4 md:mt-0"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option value="Potato">Potato</option>
            <option value="Rice">Rice</option>
            <option value="Tomato">Tomato</option>
            <option value="Onion">Onion</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-2xl font-bold text-[#2d2d2d]">₹{currentPrice}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500">3-Day Forecast</p>
            <p className="text-2xl font-bold text-[#2d7d46]">₹{forecast3Day}</p>
            <p className="text-xs text-green-600">↑ +1.5%</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500">7-Day Forecast</p>
            <p className="text-2xl font-bold text-[#2d7d46]">₹{forecast7Day}</p>
            <p className="text-xs text-green-600">↑ +2.6%</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500">14-Day Forecast</p>
            <p className="text-2xl font-bold text-[#2d7d46]">₹{forecast14Day}</p>
            <p className="text-xs text-green-600">↑ +4.2%</p>
          </div>
        </div>

        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Model Confidence</p>
              <p className="text-2xl font-bold text-[#2d2d2d]">{confidence}%</p>
            </div>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2d7d46] rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            AI Estimate — Not a guaranteed market price
          </p>
        </div>

        <div className="card">
          <h3 className="font-bold text-[#2d2d2d] mb-4">Historical → Current → Forecast</h3>
          <ForecastChart historicalData={historicalData} forecastData={forecastData} />
        </div>
      </div>
  )
}