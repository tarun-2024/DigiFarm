'use client'

import { useParams } from 'next/navigation'

export default function BuyerLogisticsPage() {
  const params = useParams()
  const buyerId = params.id

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#2d2d2d]">Logistics</h1>
      <p className="text-gray-500 mt-1">Track your shipments</p>
      <div className="mt-6 p-8 bg-white rounded-xl shadow-sm text-center">
        <p className="text-gray-400">Logistics feature coming soon</p>
        <p className="text-sm text-gray-300 mt-2">Buyer ID: {buyerId}</p>
      </div>
    </div>
  )
}