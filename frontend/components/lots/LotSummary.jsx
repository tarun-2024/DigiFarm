'use client'

import { 
  Sprout, 
  Package, 
  IndianRupee, 
  MapPin, 
  Calendar,
  Tag,
  CheckCircle
} from 'lucide-react'

export default function LotSummary({ lotData, grossValue }) {
  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusIcon = () => {
    if (Object.values(lotData).some(v => v)) {
      return <span className="text-amber-500">●</span>
    }
    return <span className="text-gray-400">●</span>
  }

  const fields = [
    { label: 'Crop', value: lotData.crop, icon: Sprout },
    { label: 'Quantity', value: lotData.quantity ? `${lotData.quantity} ${lotData.unit}` : '', icon: Package },
    { label: 'Quality', value: lotData.quality_grade, icon: Tag },
    { label: 'Expected Price', value: lotData.expected_price ? `₹${lotData.expected_price} / ${lotData.unit}` : '', icon: IndianRupee },
    { label: 'Location', value: lotData.pickup_location || lotData.village, icon: MapPin },
    { label: 'Available From', value: formatDate(lotData.available_from), icon: Calendar },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#2d2d2d]">Lot Summary</h3>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          {getStatusIcon()}
          {Object.values(lotData).some(v => v) ? 'Draft' : 'Empty'}
        </span>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
            <field.icon size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{field.label}</p>
              <p className="text-sm font-medium text-[#2d2d2d] truncate">
                {field.value || '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Gross Value */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="bg-[#e8f5e9] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated Gross Value</span>
            <span className="text-xl font-bold text-[#1a4d3e]">
              {grossValue !== null ? `₹${grossValue.toLocaleString()}` : '—'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {grossValue !== null ? `${lotData.quantity} × ₹${lotData.expected_price}` : 'Enter quantity and price to calculate'}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          <CheckCircle size={14} className="inline mr-1 text-[#2d7d46]" />
          All information is saved automatically
        </p>
      </div>
    </div>
  )
}