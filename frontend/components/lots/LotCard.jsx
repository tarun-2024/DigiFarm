'use client'

import Link from 'next/link'
import { 
  Package, 
  MapPin, 
  IndianRupee, 
  Calendar,
  Eye,
  MessageCircle,
  Edit,
  TrendingUp
} from 'lucide-react'

const STATUS_COLORS = {
  'Available': 'bg-green-100 text-green-700',
  'Draft': 'bg-gray-100 text-gray-600',
  'Offers Received': 'bg-blue-100 text-blue-700',
  'Accepted': 'bg-purple-100 text-purple-700',
  'In Logistics': 'bg-amber-100 text-amber-700',
  'Delivered': 'bg-blue-100 text-blue-700',
  'Sold': 'bg-emerald-100 text-emerald-700',
  'Completed': 'bg-green-100 text-green-700',
  'Cancelled': 'bg-red-100 text-red-700'
}

export default function LotCard({ lot, farmerId }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
  }

  const getActions = () => {
    const actions = []
    
    // View Details - always available
    actions.push({
      label: 'View Details',
      icon: Eye,
      href: `/farmer/${farmerId}/lots/${lot.id}`,
      primary: true
    })

    // Edit - for Draft and Available
    if (lot.status === 'Draft' || lot.status === 'Available') {
      actions.push({
        label: 'Edit',
        icon: Edit,
        href: `/farmer/${farmerId}/lots/${lot.id}/edit`,
        primary: false
      })
    }

    // View Matches - for Available
    if (lot.status === 'Available') {
      actions.push({
        label: 'View Matches',
        icon: TrendingUp,
        href: `/farmer/${farmerId}/matches?lot=${lot.id}`,
        primary: false
      })
    }

    // View Offers - when offers received
    if (lot.status === 'Offers Received') {
      actions.push({
        label: 'View Offers',
        icon: MessageCircle,
        href: `/farmer/${farmerId}/offers?lot=${lot.id}`,
        primary: false
      })
    }

    return actions
  }

  const actions = getActions()

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 font-mono">{lot.id}</p>
            <h3 className="font-bold text-[#2d2d2d] text-lg mt-1">{lot.crop}</h3>
            {lot.variety && (
              <p className="text-sm text-gray-500">{lot.variety}</p>
            )}
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
            {lot.status || 'Draft'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Package size={14} className="text-gray-400" />
          <span className="text-gray-600">{lot.quantity} {lot.unit}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600">{lot.quality_grade || 'Not Graded'}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <IndianRupee size={14} className="text-gray-400" />
          <span className="text-gray-600">₹{lot.expected_price} / {lot.unit}</span>
        </div>

        {lot.pickup_location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600 truncate">{lot.pickup_location}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-gray-500 text-xs">Created: {formatDate(lot.created_at)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              action.primary 
                ? 'bg-[#1a4d3e] text-white hover:bg-opacity-90' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <action.icon size={14} />
            {action.label}
          </Link>
        ))}
        
        {actions.length === 0 && (
          <span className="text-xs text-gray-400">No actions available</span>
        )}
      </div>
    </div>
  )
}