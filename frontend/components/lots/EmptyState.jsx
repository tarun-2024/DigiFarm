'use client'

import Link from 'next/link'
import { Package, Plus } from 'lucide-react'

export default function EmptyState({ farmerId }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-[#e8f5e9] rounded-full">
          <Package size={48} className="text-[#2d7d46]" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">No Lots Yet</h3>
      <p className="text-gray-500 mb-6">You haven't created any produce lots yet.</p>
      <Link 
        href={`/farmer/${farmerId}/lots/create`}
        className="btn-primary inline-flex items-center gap-2"
      >
        <Plus size={20} />
        Create Your First Lot
      </Link>
    </div>
  )
}