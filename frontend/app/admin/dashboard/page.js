'use client'

import React from 'react'
import Sidebar from '@/components/ui/Sidebar'
import StatCard from '@/components/ui/StatCard'
import { 
  Users, 
  Building2, 
  Store, 
  Package, 
  CreditCard, 
  DollarSign,
  AlertCircle,
  Shield
} from 'lucide-react'
import PriceChart from '@/components/charts/PriceChart'
import { generatePriceHistory } from '@/lib/mock-data'

export default function AdminDashboard() {
  const stats = {
    totalFarmers: 2847,
    fpos: 124,
    buyers: 356,
    activeLots: 982,
    transactions: 4562,
    tradeValue: '₹124.8Cr',
    disputes: 23,
    verifiedBuyers: 289
  }

  const priceData = generatePriceHistory(2500, 30, 60)

  return (
    <Sidebar role="admin">
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d2d2d]">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform Overview & Monitoring</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <StatCard title="Farmers" value={stats.totalFarmers} icon={Users} color="forest" />
          <StatCard title="FPOs" value={stats.fpos} icon={Building2} color="agri-green" />
          <StatCard title="Buyers" value={stats.buyers} icon={Store} color="forest" />
          <StatCard title="Active Lots" value={stats.activeLots} icon={Package} color="agri-green" />
          <StatCard title="Transactions" value={stats.transactions} icon={CreditCard} color="forest" />
          <StatCard title="Trade Value" value={stats.tradeValue} icon={DollarSign} color="agri-green" />
          <StatCard title="Disputes" value={stats.disputes} icon={AlertCircle} color="amber" />
          <StatCard title="Verified Buyers" value={stats.verifiedBuyers} icon={Shield} color="forest" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="font-bold text-[#2d2d2d] mb-4">Price Trends</h3>
            <PriceChart data={priceData} />
          </div>
          <div className="card">
            <h3 className="font-bold text-[#2d2d2d] mb-4">Platform Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#e8f5e9] rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-[#2d7d46]" />
                  <span className="text-sm font-medium">New Farmers Today</span>
                </div>
                <span className="font-bold">34</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#e8f5e9] rounded-lg">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-[#2d7d46]" />
                  <span className="text-sm font-medium">New Lots Created</span>
                </div>
                <span className="font-bold">27</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#e8f5e9] rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[#2d7d46]" />
                  <span className="text-sm font-medium">Transactions Today</span>
                </div>
                <span className="font-bold">18</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-[#2d2d2d] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New buyer registered', user: 'XYZ Retail Ltd.', time: '2 min ago' },
              { action: 'Lot published', user: 'Burdwan FPO', time: '15 min ago' },
              { action: 'Transaction completed', user: 'ABC Foods', time: '1 hour ago' },
              { action: 'Dispute resolved', user: 'FreshMart', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sidebar>
  )
}