'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import {
  TrendingUp,
  Package,
  Users,
  Calendar,
  Clock,
  Leaf,
  BarChart3,
  PlayCircle,
} from 'lucide-react'

import StatCard from '@/components/ui/StatCard'
import RecommendationCard from '@/components/farmer/RecommendationCard'
import PriceChart from '@/components/charts/PriceChart'

import { getFarmer } from '@/lib/api/farmer'

export default function FarmerDashboard() {
  const params = useParams()
  const router = useRouter()

  const farmerId = params.id

  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // =====================================================
  // GET FARMER FROM DATABASE
  // =====================================================

  useEffect(() => {
    async function loadFarmer() {
      try {
        setLoading(true)
        setError('')

        const data = await getFarmer(farmerId)

        if (data.success) {
          setFarmer(data.farmer)
        } else {
          setError(data.error || 'Farmer not found')
        }
      } catch (err) {
        console.error('ERROR LOADING FARMER:', err)

        setError(
          err.message || 'Unable to load farmer dashboard'
        )
      } finally {
        setLoading(false)
      }
    }

    if (farmerId) {
      loadFarmer()
    }
  }, [farmerId])

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1a4d3e] border-t-transparent mx-auto mb-4"></div>

          <p className="text-gray-500">
            Loading your DigiFarm dashboard...
          </p>
        </div>
      </div>
    )
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mb-6">
            {error || 'Farmer not found'}
          </p>

          <button
            onClick={() => router.push('/signin')}
            className="bg-[#1a4d3e] text-white px-6 py-3 rounded-lg hover:bg-[#143d31] transition"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  // =====================================================
  // FARMER DATA
  // =====================================================

  const currentCrop =
    farmer.crops?.[0]?.crop || 'No crop'

  const totalProduce =
    farmer.crops?.reduce(
      (total, crop) =>
        total + Number(crop.quantity || 0),
      0
    ) || 0

  // =====================================================
  // CURRENT DASHBOARD STATISTICS
  // =====================================================
  // These market values are currently demo/mock values.
  // Later we can connect them to market APIs/database.

  const stats = {
    currentCrop,

    currentMarketPrice:
      '₹2,650/quintal',

    marketArrival:
      '1,240 tonnes',

    activeBuyerDemand:
      '8 buyers',

    myProduce:
      `${totalProduce} quintals`,

    activeLots:
      '3 lots',
  }

  // =====================================================
  // AI RECOMMENDATION
  // =====================================================

  const recommendation = {
    action: 'SELL NOW',

    currentPrice: 2650,

    predictedPrice: 2690,

    transport: 60,

    storage: 40,

    netRealization: 2590,

    confidence: 78,

    reason:
      'Expected price increase does not sufficiently compensate for additional storage and risk.',
  }

  // =====================================================
  // PRICE DATA
  // =====================================================

  const priceData = [
    { date: 'Jan', price: 2400 },
    { date: 'Feb', price: 2450 },
    { date: 'Mar', price: 2500 },
    { date: 'Apr', price: 2480 },
    { date: 'May', price: 2550 },
    { date: 'Jun', price: 2600 },
    { date: 'Jul', price: 2580 },
    { date: 'Aug', price: 2650 },
  ]

  // =====================================================
  // AI ANALYSIS
  // =====================================================

  const runAIAnalysis = () => {
    setIsAnalyzing(true)

    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

            <div>
              <h1 className="text-3xl font-bold text-[#2d2d2d]">
                Good Morning, {farmer.name} 👋
              </h1>

              <p className="text-gray-500 mt-1">
                {farmer.district}, {farmer.state}
              </p>
            </div>

            <button
              onClick={runAIAnalysis}
              disabled={isAnalyzing}
              className="btn-primary flex items-center gap-2 mt-4 md:mt-0"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <PlayCircle size={20} />
                  Run AI Analysis
                </>
              )}
            </button>

          </div>
        </div>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

          <StatCard
            title="Current Crop"
            value={stats.currentCrop}
            icon={Leaf}
            color="agri-green"
          />

          <StatCard
            title="Market Price"
            value={stats.currentMarketPrice}
            icon={TrendingUp}
            color="forest"
          />

          <StatCard
            title="Market Arrival"
            value={stats.marketArrival}
            icon={BarChart3}
            color="cream"
          />

          <StatCard
            title="Active Buyers"
            value={stats.activeBuyerDemand}
            icon={Users}
            color="agri-green"
          />

          <StatCard
            title="My Produce"
            value={stats.myProduce}
            icon={Package}
            color="forest"
          />

          <StatCard
            title="Active Lots"
            value={stats.activeLots}
            icon={Package}
            color="cream"
          />

        </div>

        {/* =================================================
            AI RECOMMENDATION
        ================================================= */}

        <div className="mb-8">
          <RecommendationCard
            recommendation={recommendation}
            onViewAnalysis={() => {}}
          />
        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {/* CREATE LOT */}

          <Link
            href={`/farmer/${farmer.id}/lots`}
            className="card hover:border-[#2d7d46] border-2 border-transparent text-center transition"
          >
            <Package
              size={24}
              className="mx-auto mb-2 text-[#2d7d46]"
            />

            <p className="font-medium text-sm">
              Create Lot
            </p>
          </Link>

          {/* FIND BUYERS */}

          <Link
            href={`/farmer/${farmer.id}/buyers`}
            className="card hover:border-[#2d7d46] border-2 border-transparent text-center transition"
          >
            <Users
              size={24}
              className="mx-auto mb-2 text-[#2d7d46]"
            />

            <p className="font-medium text-sm">
              Find Buyers
            </p>
          </Link>

          {/* AI MATCHES */}

          <Link
            href={`/farmer/${farmer.id}/matches`}
            className="card hover:border-[#2d7d46] border-2 border-transparent text-center transition"
          >
            <TrendingUp
              size={24}
              className="mx-auto mb-2 text-[#2d7d46]"
            />

            <p className="font-medium text-sm">
              AI Matches
            </p>
          </Link>

          {/* PRICE FORECAST */}

          <Link
            href={`/farmer/${farmer.id}/forecast`}
            className="card hover:border-[#2d7d46] border-2 border-transparent text-center transition"
          >
            <Calendar
              size={24}
              className="mx-auto mb-2 text-[#2d7d46]"
            />

            <p className="font-medium text-sm">
              Price Forecast
            </p>
          </Link>

        </div>

        {/* =================================================
            PRICE + MARKET INSIGHTS
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* PRICE TRENDS */}

          <div className="card">

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-bold text-[#2d2d2d]">
                Price Trends
              </h3>

              <span className="text-sm text-gray-500">
                Last 8 months
              </span>

            </div>

            <PriceChart data={priceData} />

          </div>

          {/* MARKET INSIGHTS */}

          <div className="card">

            <h3 className="font-bold text-[#2d2d2d] mb-4">
              Market Insights
            </h3>

            <div className="space-y-4">

              {/* PRICE TREND */}

              <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-lg">

                <TrendingUp
                  size={20}
                  className="text-[#2d7d46]"
                />

                <div>
                  <p className="text-sm font-medium">
                    Prices are trending upward
                  </p>

                  <p className="text-xs text-gray-500">
                    +2.3% in the last week
                  </p>
                </div>

              </div>

              {/* BUYER DEMAND */}

              <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-lg">

                <Users
                  size={20}
                  className="text-[#2d7d46]"
                />

                <div>
                  <p className="text-sm font-medium">
                    8 active buyers for {currentCrop.toLowerCase()}
                  </p>

                  <p className="text-xs text-gray-500">
                    High demand in your region
                  </p>
                </div>

              </div>

              {/* SELLING WINDOW */}

              <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-lg">

                <Clock
                  size={20}
                  className="text-[#2d7d46]"
                />

                <div>
                  <p className="text-sm font-medium">
                    Best selling window: This week
                  </p>

                  <p className="text-xs text-gray-500">
                    Prices expected to hold steady
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}