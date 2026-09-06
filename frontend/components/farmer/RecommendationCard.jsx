import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function RecommendationCard({ recommendation, onViewAnalysis }) {
  const { 
    action, 
    currentPrice, 
    predictedPrice, 
    transport, 
    storage, 
    netRealization, 
    confidence,
    reason 
  } = recommendation

  const isSellNow = action === 'SELL NOW'

  return (
    <div className={`card border-2 ${isSellNow ? 'border-green-500' : 'border-amber-500'} relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 px-4 py-2 text-white text-sm font-bold ${isSellNow ? 'bg-green-500' : 'bg-amber-500'}`}>
        {isSellNow ? 'RECOMMENDED' : 'CONSIDER'}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">AI Recommendation</h3>
          <div className="flex items-center gap-3">
            <div className={`text-4xl font-bold ${isSellNow ? 'text-green-600' : 'text-amber-600'}`}>
              {action}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Confidence</span>
              <span className="font-bold">{confidence}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-lg font-bold">₹{currentPrice}/q</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Predicted</p>
            <p className="text-lg font-bold">₹{predictedPrice}/q</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transport</p>
            <p className="text-lg font-bold">₹{transport}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Storage</p>
            <p className="text-lg font-bold">₹{storage}</p>
          </div>
        </div>

        <div className="bg-[#e8f5e9] p-4 rounded-lg text-center min-w-[140px]">
          <p className="text-sm text-gray-500">Net Realization</p>
          <p className="text-2xl font-bold text-[#1a4d3e]">₹{netRealization}/q</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <AlertCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          {reason}
        </p>
      </div>

      <button 
        onClick={onViewAnalysis}
        className="mt-4 btn-secondary text-sm w-full lg:w-auto"
      >
        View Full Analysis
      </button>
    </div>
  )
}