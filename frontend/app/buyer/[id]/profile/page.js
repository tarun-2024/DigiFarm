'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { User, Phone, Mail, Building2, MapPin, Home, CheckCircle } from 'lucide-react'

export default function BuyerProfilePage() {
  const params = useParams()
  const buyerId = params.id
  const [buyer, setBuyer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedBuyer = localStorage.getItem('digifarm_buyer')
      if (storedBuyer) {
        setBuyer(JSON.parse(storedBuyer))
      }
    } catch (error) {
      console.error('Error loading buyer:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#2d2d2d]">Profile</h1>
      <p className="text-gray-500 mt-1">View and manage your account</p>

      <div className="mt-6 bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <User size={14} /> Name
            </p>
            <p className="font-medium">{buyer?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Phone size={14} /> Mobile
            </p>
            <p className="font-medium">{buyer?.mobile || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Mail size={14} /> Email
            </p>
            <p className="font-medium">{buyer?.email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Building2 size={14} /> Buyer Type
            </p>
            <p className="font-medium">{buyer?.buyer_type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin size={14} /> Location
            </p>
            <p className="font-medium">{buyer?.district}, {buyer?.state}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Home size={14} /> Village/City
            </p>
            <p className="font-medium">{buyer?.village || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500">Address</p>
            <p className="font-medium">{buyer?.address || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle size={14} className="text-[#2d7d46]" /> Status
            </p>
            <p className="font-medium text-[#2d7d46]">Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}