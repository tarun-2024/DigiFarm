'use client'

import React from 'react'
import Link from 'next/link'
import Sidebar from '@/components/ui/Sidebar'
import StatCard from '@/components/ui/StatCard'
import { 
  ShoppingBag, 
  Package, 
  FileText, 
  Truck, 
  TrendingUp,
  DollarSign,
  ArrowRight
} from 'lucide-react'

export default function BuyerDashboard() {
  const stats = {
    activeRequirements: 12,
    matchingLots: 38,
    pendingOffers: 7,
    activeOrders: 14,
    procurementValue: '₹18.6L'
  }

  const activeDemands = [
    {
      crop: 'Potato',
      quantity: '50 tonnes',
      grade: 'A',
      priceRange: '₹2,600-₹2,750',
      requiredBy: '10 Sept',
      location: 'Kolkata',
      status: 'Active'
    },
    {
      crop: 'Rice',
      quantity: '30 tonnes',
      grade: 'A+',
      priceRange: '₹1,800–₹2,000',
      requiredBy: '15 Sept',
      location: 'Howrah',
      status: 'Active'
    }
  ]

  return (
    <Sidebar role="buyer">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d2d2d]">
            Good Morning, Rajesh👋
          </h1>
          <p className="text-gray-500 mt-1">Procurement Overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Active Requirements" value={stats.activeRequirements} icon={FileText} color="forest" />
          <StatCard title="Matching Lots" value={stats.matchingLots} icon={Package} color="agri-green" />
          <StatCard title="Pending Offers" value={stats.pendingOffers} icon={FileText} color="amber" />
          <StatCard title="Active Orders" value={stats.activeOrders} icon={ShoppingBag} color="forest" />
          <StatCard title="Procurement Value" value={stats.procurementValue} icon={DollarSign} color="agri-green" />
        </div>

        <div className="bg-gradient-to-r from-[#1a4d3e] to-[#2d7d46] rounded-xl p-6 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">AI-Matched Supply</h3>
              <p className="text-white/80 mt-1">
                8 farmer/FPO lots match your current potato requirement
              </p>
            </div>
            <Link href="/buyer/matches" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              View Matches <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#2d2d2d]">Active Demands</h2>
            <Link href="/buyer/demand/create" className="text-[#2d7d46] font-medium hover:underline">
              + Post New Demand
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {activeDemands.map((demand, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-[#2d2d2d]">{demand.crop}</h4>
                    <p className="text-sm text-gray-500">{demand.location}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {demand.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium">{demand.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Grade</p>
                    <p className="font-medium">{demand.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price Range</p>
                    <p className="font-medium">{demand.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Required By</p>
                    <p className="font-medium">{demand.requiredBy}</p>
                  </div>
                </div>
                <Link href={`/buyer/lots?demand=${index}`} className="mt-4 inline-block text-[#2d7d46] font-medium hover:underline text-sm">
                  View Matching Lots →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/buyer/demand/create" className="card text-center hover:border-[#2d7d46] border-2 border-transparent">
            <FileText size={24} className="mx-auto mb-2 text-[#2d7d46]" />
            <p className="font-medium text-sm">Post Demand</p>
          </Link>
          <Link href="/buyer/lots" className="card text-center hover:border-[#2d7d46] border-2 border-transparent">
            <Package size={24} className="mx-auto mb-2 text-[#2d7d46]" />
            <p className="font-medium text-sm">Browse Lots</p>
          </Link>
          <Link href="/buyer/matches" className="card text-center hover:border-[#2d7d46] border-2 border-transparent">
            <TrendingUp size={24} className="mx-auto mb-2 text-[#2d7d46]" />
            <p className="font-medium text-sm">AI Matches</p>
          </Link>
          <Link href="/buyer/orders" className="card text-center hover:border-[#2d7d46] border-2 border-transparent">
            <Truck size={24} className="mx-auto mb-2 text-[#2d7d46]" />
            <p className="font-medium text-sm">Orders</p>
          </Link>
        </div>
      </div>
    </Sidebar>
  )
}