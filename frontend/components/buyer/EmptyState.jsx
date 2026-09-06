'use client'

import Link from 'next/link'
import { Package, Plus, Search } from 'lucide-react'

export default function EmptyState({ type, buyerId, crop }) {
  if (type === 'lots') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#e8f5e9] rounded-full">
            <Package size={48} className="text-[#2d7d46]" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">No Matching Lots Found</h3>
        {crop ? (
          <p className="text-gray-500 mb-6">
            We couldn't find suitable <span className="font-medium">{crop}</span> supply for your requirement.
          </p>
        ) : (
          <p className="text-gray-500 mb-6">
            No farmer lots are currently available for your requirements.
          </p>
        )}
        <Link 
          href={`/buyer/${buyerId}/demand/create`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Post a Demand
        </Link>
        <p className="text-xs text-gray-400 mt-4">
          Or adjust your filters to find more options
        </p>
      </div>
    )
  }

  if (type === 'demands') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-[#e8f5e9] rounded-full">
            <Search size={48} className="text-[#2d7d46]" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">No Demands Yet</h3>
        <p className="text-gray-500 mb-6">
          You haven't posted any procurement demands yet.
        </p>
        <Link 
          href={`/buyer/${buyerId}/demand/create`}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Post Your First Demand
        </Link>
      </div>
    )
  }

  return null
}