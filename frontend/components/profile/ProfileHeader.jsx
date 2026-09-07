'use client'

import { User, Phone, Mail, MapPin, CheckCircle, Pencil } from 'lucide-react'

export default function ProfileHeader({ 
  name, 
  role, 
  mobile, 
  email, 
  location, 
  status, 
  onEdit,
  isEditing,
  buyerType,
  avatar 
}) {
  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#1a4d3e] to-[#2d7d46] flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
            {avatar || getInitials(name)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2d2d2d]">{name || 'User'}</h1>
            <span className="px-3 py-1 bg-[#e8f5e9] text-[#1a4d3e] rounded-full text-xs font-medium">
              {role || 'User'}
            </span>
            {status === 'Active' && (
              <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle size={14} />
                Active
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <span>{mobile || 'Not provided'}</span>
            </div>
            {email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <span>{email}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span>{location}</span>
              </div>
            )}
            {buyerType && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Type:</span>
                <span className="font-medium text-[#1a4d3e]">{buyerType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a4d3e] text-[#1a4d3e] rounded-lg hover:bg-[#e8f5e9] transition-colors"
          >
            <Pencil size={18} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}