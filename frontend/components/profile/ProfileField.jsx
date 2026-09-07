'use client'

import { Eye, EyeOff } from 'lucide-react'

export default function ProfileField({ 
  label, 
  value, 
  isEditing, 
  onChange, 
  type = 'text',
  placeholder = '',
  required = false,
  options = null,
  disabled = false,
  icon: Icon = null
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {isEditing ? (
        options ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all bg-white"
            disabled={disabled}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="relative">
            {Icon && (
              <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
            <input
              type={type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full ${Icon ? 'pl-10' : 'px-3'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all`}
              disabled={disabled}
              required={required}
            />
          </div>
        )
      ) : (
        <p className="text-[#2d2d2d] font-medium">{value || '—'}</p>
      )}
    </div>
  )
}