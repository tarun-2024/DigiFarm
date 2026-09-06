'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Search,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Truck,
  RefreshCw,
} from 'lucide-react'

import { markets, crops, locations } from '@/lib/mock-data'

export default function FarmerMarketPage() {
  const params = useParams()
  const farmerId = params.id

  const [filters, setFilters] = useState({
    crop: '',
    state: '',
    market: '',
  })

  const [appliedFilters, setAppliedFilters] = useState({
    crop: '',
    state: '',
    market: '',
  })

  // =====================================================
  // APPLY FILTERS
  // =====================================================

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    const emptyFilters = {
      crop: '',
      state: '',
      market: '',
    }

    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
  }

  // =====================================================
  // FILTER MARKETS
  // =====================================================

  const filteredMarkets = markets.filter((market) => {
    // Market search
    if (
      appliedFilters.market &&
      !market.name
        .toLowerCase()
        .includes(appliedFilters.market.toLowerCase())
    ) {
      return false
    }

    // Crop filter
    if (
      appliedFilters.crop &&
      market.crop &&
      market.crop !== appliedFilters.crop
    ) {
      return false
    }

    // State filter
    if (
      appliedFilters.state &&
      market.state &&
      market.state !== appliedFilters.state
    ) {
      return false
    }

    return true
  })

  // =====================================================
  // TRANSPORT COST
  // =====================================================

  const getTransportCost = (market, index) => {
    if (market.transport) {
      return market.transport
    }

    // Stable demo values instead of Math.random()
    return 20 + (index % 5) * 15
  }

  // =====================================================
  // DISTANCE
  // =====================================================

  const getDistance = (market, index) => {
    if (market.distance) {
      return market.distance
    }

    // Stable demo values
    return 10 + (index % 8) * 10
  }

  // =====================================================
  // TREND ICON
  // =====================================================

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') {
      return <TrendingUp size={16} />
    }

    if (trend === 'down') {
      return <TrendingDown size={16} />
    }

    return <Minus size={16} />
  }

  // =====================================================
  // TREND TEXT
  // =====================================================

  const getTrendText = (trend) => {
    if (trend === 'up') {
      return 'Rising'
    }

    if (trend === 'down') {
      return 'Falling'
    }

    return 'Stable'
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 lg:p-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-[#2d2d2d]">
                Market Intelligence
              </h1>

              <p className="text-gray-500 mt-1">
                Compare prices across nearby markets
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={18} className="text-[#2d7d46]" />

              <span>
                Farmer ID: {farmerId}
              </span>
            </div>

          </div>

        </div>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="font-semibold text-[#2d2d2d]">
                Market Search
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Find the best market for your produce
              </p>
            </div>

            <Search
              size={22}
              className="text-[#2d7d46]"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* CROP */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop
              </label>

              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
                value={filters.crop}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    crop: e.target.value,
                  })
                }
              >
                <option value="">
                  All Crops
                </option>

                {crops.map((crop) => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* STATE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>

              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
                value={filters.state}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    state: e.target.value,
                  })
                }
              >
                <option value="">
                  All States
                </option>

                {locations.map((loc) => (
                  <option
                    key={loc.state}
                    value={loc.state}
                  >
                    {loc.state}
                  </option>
                ))}
              </select>
            </div>

            {/* MARKET */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market
              </label>

              <input
                type="text"
                placeholder="Search market..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
                value={filters.market}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    market: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters()
                  }
                }}
              />
            </div>

            {/* BUTTONS */}

            <div className="flex items-end gap-2">

              <button
                onClick={handleApplyFilters}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Apply
              </button>

              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                title="Reset filters"
              >
                <RefreshCw size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            MARKET SUMMARY
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Markets Found
            </p>

            <p className="text-2xl font-bold text-[#2d2d2d] mt-1">
              {filteredMarkets.length}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Best Available Price
            </p>

            <p className="text-2xl font-bold text-[#2d7d46] mt-1">
              {filteredMarkets.length > 0
                ? `₹${Math.max(
                    ...filteredMarkets.map(
                      (market) => Number(market.price) || 0
                    )
                  )}`
                : '₹0'}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

            <p className="text-sm text-gray-500">
              Selected Crop
            </p>

            <p className="text-2xl font-bold text-[#2d2d2d] mt-1">
              {appliedFilters.crop || 'All Crops'}
            </p>

          </div>

        </div>

        {/* =================================================
            MARKET TABLE
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

          {/* TABLE HEADER */}

          <div className="px-6 py-5 border-b border-gray-100">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <div>
                <h2 className="text-lg font-bold text-[#2d2d2d]">
                  Nearby Markets
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Current mandi prices and estimated net realization
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Updated recently
              </div>

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="bg-[#e8f5e9]">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Market
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Distance
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Arrival
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Trend
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Transport
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#2d2d2d]">
                    Net Realization
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredMarkets.length > 0 ? (

                  filteredMarkets.map((market, index) => {

                    const transportCost =
                      getTransportCost(market, index)

                    const netRealization =
                      Number(market.price || 0) -
                      Number(transportCost || 0)

                    const distance =
                      getDistance(market, index)

                    return (
                      <tr
                        key={market.id || index}
                        className="hover:bg-gray-50 transition"
                      >

                        {/* MARKET */}

                        <td className="px-6 py-5">

                          <div>
                            <p className="font-semibold text-[#2d2d2d]">
                              {market.name}
                            </p>

                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <MapPin size={13} />

                              <span>
                                {market.location}
                              </span>
                            </div>

                          </div>

                        </td>

                        {/* PRICE */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-[#2d2d2d]">
                            ₹{market.price}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            per quintal
                          </p>

                        </td>

                        {/* DISTANCE */}

                        <td className="px-6 py-5 text-gray-600">
                          {distance} km
                        </td>

                        {/* ARRIVAL */}

                        <td className="px-6 py-5">

                          <span className="text-gray-700">
                            {market.arrival} T
                          </span>

                        </td>

                        {/* TREND */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              market.trend === 'up'
                                ? 'bg-green-100 text-green-700'
                                : market.trend === 'down'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >

                            <TrendIcon
                              trend={market.trend}
                            />

                            {getTrendText(
                              market.trend
                            )}

                          </span>

                        </td>

                        {/* TRANSPORT */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <Truck
                              size={16}
                              className="text-gray-400"
                            />

                            <span>
                              ₹{transportCost}
                            </span>

                          </div>

                        </td>

                        {/* NET REALIZATION */}

                        <td className="px-6 py-5">

                          <p className="font-bold text-[#2d7d46]">
                            ₹{netRealization}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            after transport
                          </p>

                        </td>

                      </tr>
                    )
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <Search
                          size={40}
                          className="text-gray-300 mb-3"
                        />

                        <h3 className="font-semibold text-gray-700">
                          No markets found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Try changing your filters.
                        </p>

                        <button
                          onClick={handleResetFilters}
                          className="mt-4 text-sm text-[#2d7d46] font-medium hover:underline"
                        >
                          Reset filters
                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================================
            FOOTER NOTE
        ================================================= */}

        <div className="mt-5 flex items-start gap-2 text-xs text-gray-500">

          <span className="font-medium">
            Note:
          </span>

          <span>
            Market prices shown here are currently demo data.
            They can later be connected to live mandi/market
            APIs and your PostgreSQL database.
          </span>

        </div>

      </div>
    </div>
  )
}