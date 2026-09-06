'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Package, 
  TrendingUp, 
  Truck, 
  DollarSign,
  ArrowRight,
  ShoppingBag,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react'
import StatCard from '@/components/ui/StatCard'

// Mock data - replace with API calls
const mockStats = {
  activeRequirements: 12,
  matchingLots: 38,
  pendingOffers: 7,
  activeOrders: 14,
  procurementValue: '₹18.6L'
}

const mockDemands = [
  {
    id: 1,
    crop: 'Potato',
    quantity: '50 tonnes',
    grade: 'A',
    priceRange: '₹2,600–₹2,750',
    requiredBy: '10 Sept 2026',
    location: 'Kolkata',
    status: 'Active',
    matches: 8
  },
  {
    id: 2,
    crop: 'Rice',
    quantity: '30 tonnes',
    grade: 'A+',
    priceRange: '₹1,800–₹2,000',
    requiredBy: '15 Sept 2026',
    location: 'Howrah',
    status: 'Active',
    matches: 3
  }
]

export default function BuyerDashboard() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id
  
  const [buyer, setBuyer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    try {
      const storedBuyer = localStorage.getItem('digifarm_buyer')
      if (storedBuyer) {
        const parsed = JSON.parse(storedBuyer)
        setBuyer(parsed)
        
        // Set greeting based on time
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 17) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
      }
    } catch (error) {
      console.error('Error loading buyer:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2d2d2d]">
          {greeting}, {buyer?.name || 'Buyer'} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {buyer?.buyer_type} • {buyer?.district}, {buyer?.state}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Active
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Active Requirements"
          value={mockStats.activeRequirements}
          icon={FileText}
          color="forest"
        />
        <StatCard
          title="Matching Lots"
          value={mockStats.matchingLots}
          icon={Package}
          color="agri-green"
        />
        <StatCard
          title="Pending Offers"
          value={mockStats.pendingOffers}
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Active Orders"
          value={mockStats.activeOrders}
          icon={ShoppingBag}
          color="forest"
        />
        <StatCard
          title="Procurement Value"
          value={mockStats.procurementValue}
          icon={DollarSign}
          color="agri-green"
        />
      </div>

      {/* AI Matches Alert */}
      <div className="bg-gradient-to-r from-[#1a4d3e] to-[#2d7d46] rounded-xl p-6 text-white mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold">AI-Matched Supply</h3>
            <p className="text-white/80 mt-1">
              {mockStats.matchingLots} farmer/FPO lots match your current requirements
            </p>
          </div>
          <Link 
            href={`/buyer/${buyerId}/matches`}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            View Matches <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Active Demands */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2d2d2d]">Active Demands</h2>
          <Link 
            href={`/buyer/${buyerId}/demand/create`}
            className="text-[#2d7d46] font-medium hover:underline"
          >
            + Post New Demand
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {mockDemands.map((demand) => (
            <div key={demand.id} className="card">
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
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {demand.matches} matching lots
                </span>
                <Link 
                  href={`/buyer/${buyerId}/matches?demand=${demand.id}`}
                  className="text-[#2d7d46] font-medium hover:underline text-sm"
                >
                  View Matching Lots →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          href={`/buyer/${buyerId}/demand/create`} 
          className="card text-center hover:border-[#2d7d46] border-2 border-transparent"
        >
          <FileText size={24} className="mx-auto mb-2 text-[#2d7d46]" />
          <p className="font-medium text-sm">Post Demand</p>
        </Link>
        <Link 
          href={`/buyer/${buyerId}/lots`} 
          className="card text-center hover:border-[#2d7d46] border-2 border-transparent"
        >
          <Package size={24} className="mx-auto mb-2 text-[#2d7d46]" />
          <p className="font-medium text-sm">Browse Lots</p>
        </Link>
        <Link 
          href={`/buyer/${buyerId}/matches`} 
          className="card text-center hover:border-[#2d7d46] border-2 border-transparent"
        >
          <TrendingUp size={24} className="mx-auto mb-2 text-[#2d7d46]" />
          <p className="font-medium text-sm">AI Matches</p>
        </Link>
        <Link 
          href={`/buyer/${buyerId}/orders`} 
          className="card text-center hover:border-[#2d7d46] border-2 border-transparent"
        >
          <Truck size={24} className="mx-auto mb-2 text-[#2d7d46]" />
          <p className="font-medium text-sm">Orders</p>
        </Link>
      </div>
    </div>
  )
}