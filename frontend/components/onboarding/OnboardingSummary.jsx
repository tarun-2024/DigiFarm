import React from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function OnboardingSummary({ farmer, onContinue }) {
  const getPaymentLabel = (value) => {
    const map = {
      immediate: 'Immediate Payment',
      medium: '3–5 Days',
      long: '7+ Days'
    }
    return map[value] || value
  }

  const getCropSummary = () => {
    return farmer.crops
      .filter(c => c.crop)
      .map(c => `${c.crop} (${c.quantity || 0} Quintals)`)
      .join(', ') || 'Not specified'
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-[#2d2d2d]">You're all set! 🌾</h2>
        <p className="text-gray-600 mt-2">
          DigiFarm is ready to personalize your market intelligence, selling recommendations, 
          buyer matches, and logistics options.
        </p>
      </div>

      <div className="bg-[#e8f5e9] rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-[#1a4d3e] mb-3">Profile Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{farmer.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-medium">{farmer.mobile || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">
              {farmer.village}, {farmer.district}, {farmer.state}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Language</p>
            <p className="font-medium">{farmer.language}</p>
          </div>
          <div>
            <p className="text-gray-500">Farm Size</p>
            <p className="font-medium">{farmer.farmSize || 0} acres</p>
          </div>
          <div>
            <p className="text-gray-500">Irrigation</p>
            <p className="font-medium">{farmer.irrigation || 'Not specified'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Crops</p>
            <p className="font-medium">{getCropSummary()}</p>
          </div>
          <div>
            <p className="text-gray-500">Payment Need</p>
            <p className="font-medium">{getPaymentLabel(farmer.paymentNeed)}</p>
          </div>
          <div>
            <p className="text-gray-500">Storage</p>
            <p className="font-medium">
              {farmer.storageAvailable === 'Yes' 
                ? `${farmer.storageDuration}` 
                : 'Not Available'}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-500">Minimum Price</p>
            <p className="font-medium">₹{farmer.minimumPrice || 0}/quintal</p>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-[#1a4d3e] text-white px-6 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center justify-center gap-2"
      >
        Go to Farmer Dashboard
        <ArrowRight size={20} />
      </button>
    </div>
  )
}