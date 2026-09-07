'use client'

import { useState, useEffect } from 'react'
import BuyerCard from '@/components/shared/BuyerCard'

export default function FarmerBuyersPage() {

  // ==========================
  // STATE
  // ==========================

  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    crop: '',
    quantity: '',
    location: '',
    verifiedOnly: false
  })


  // ==========================
  // FETCH BUYERS
  // ==========================

  useEffect(() => {

    const fetchBuyers = async () => {

      try {

        setLoading(true)
        setError('')

        const response = await fetch(
          'http://127.0.0.1:5000/api/buyers',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          }
        )

        const data = await response.json().catch(() => null)

        console.log('BUYERS STATUS:', response.status)
        console.log('BUYERS RESPONSE:', data)

        if (!response.ok) {

          throw new Error(
            data?.error ||
            data?.message ||
            `Failed to fetch buyers (${response.status})`
          )

        }

        if (!Array.isArray(data?.buyers)) {

          throw new Error(
            'Invalid buyers response from server'
          )

        }

        setBuyers(data.buyers)

      } catch (error) {

        console.error(
          'Error fetching buyers:',
          error
        )

        setError(
          error.message ||
          'Failed to load buyers'
        )

        setBuyers([])

      } finally {

        setLoading(false)

      }

    }

    fetchBuyers()

  }, [])


  // ==========================
  // FILTER BUYERS
  // ==========================

  const filteredBuyers = buyers.filter((buyer) => {

    // Make sure demands is always an array
    const demands = Array.isArray(buyer.demands)
      ? buyer.demands
      : []


    // ==========================
    // CROP FILTER
    // ==========================

    if (filters.crop) {

      const cropMatches = demands.some(
        (demand) =>
          demand.crop?.toLowerCase() ===
          filters.crop.toLowerCase()
      )

      if (!cropMatches) {
        return false
      }

    }


    // ==========================
    // QUANTITY FILTER
    // ==========================

    if (filters.quantity) {

      const selectedQuantity =
        Number(filters.quantity)

      const quantityMatches = demands.some(
        (demand) =>
          Number(demand.quantity) >=
          selectedQuantity
      )

      if (!quantityMatches) {
        return false
      }

    }


    // ==========================
    // LOCATION FILTER
    // ==========================

    if (filters.location) {

      const location = [

        buyer.village,
        buyer.district,
        buyer.state,
        buyer.address

      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (
        !location.includes(
          filters.location.toLowerCase()
        )
      ) {

        return false

      }

    }


    // ==========================
    // VERIFIED FILTER
    // ==========================

    if (filters.verifiedOnly) {

      if (buyer.status !== 'Active') {
        return false
      }

    }


    return true

  })


  // ==========================
  // RESET FILTERS
  // ==========================

  const resetFilters = () => {

    setFilters({
      crop: '',
      quantity: '',
      location: '',
      verifiedOnly: false
    })

  }


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <div className="p-6 lg:p-8">

        <div className="flex items-center justify-center py-20">

          <div className="text-center">

            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#1a4d3e] mx-auto mb-4"></div>

            <p className="text-gray-500">
              Loading buyers...
            </p>

          </div>

        </div>

      </div>

    )

  }


  // ==========================
  // ERROR
  // ==========================

  if (error) {

    return (

      <div className="p-6 lg:p-8">

        <div className="bg-red-50 border border-red-200 rounded-xl p-5">

          <h2 className="font-semibold text-red-700 mb-1">
            Unable to load buyers
          </h2>

          <p className="text-red-600 text-sm">
            {error}
          </p>

        </div>

      </div>

    )

  }


  // ==========================
  // PAGE
  // ==========================

  return (

    <div className="p-6 lg:p-8">

      {/* ==========================
           HEADER
      ========================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#2d2d2d]">
          Find Buyers
        </h1>

        <p className="text-gray-500 mt-1">
          Discover buyers looking for your produce
        </p>

      </div>


      {/* ==========================
           FILTERS
      ========================== */}

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


          {/* ==========================
               CROP
          ========================== */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop
            </label>

            <select
              value={filters.crop}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  crop: e.target.value
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            >

              <option value="">
                All Crops
              </option>

              <option value="Potato">
                Potato
              </option>

              <option value="Rice">
                Rice
              </option>

              <option value="Tomato">
                Tomato
              </option>

              <option value="Onion">
                Onion
              </option>

              <option value="Carrot">
                Carrot
              </option>

            </select>

          </div>


          {/* ==========================
               QUANTITY
          ========================== */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Quantity
            </label>

            <input
              type="number"
              min="0"
              placeholder="e.g. 10"
              value={filters.quantity}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  quantity: e.target.value
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            />

          </div>


          {/* ==========================
               LOCATION
          ========================== */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>

            <input
              type="text"
              placeholder="State, district or village"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  location: e.target.value
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
            />

          </div>


          {/* ==========================
               VERIFIED
          ========================== */}

          <div className="flex items-end">

            <label className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer">

              <input
                type="checkbox"
                className="w-4 h-4 text-[#1a4d3e] focus:ring-[#1a4d3e]"
                checked={filters.verifiedOnly}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    verifiedOnly: e.target.checked
                  }))
                }
              />

              <span className="text-sm text-gray-700">
                Active / Verified Buyers
              </span>

            </label>

          </div>

        </div>


        {/* ==========================
             RESET
        ========================== */}

        {(filters.crop ||
          filters.quantity ||
          filters.location ||
          filters.verifiedOnly) && (

          <div className="mt-4 flex justify-end">

            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-[#2d7d46] hover:underline"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>


      {/* ==========================
           RESULT COUNT
      ========================== */}

      <div className="flex items-center justify-between mb-5">

        <p className="text-sm text-gray-500">

          Showing{' '}

          <span className="font-semibold text-gray-700">
            {filteredBuyers.length}
          </span>{' '}

          buyer
          {filteredBuyers.length !== 1 ? 's' : ''}

        </p>

      </div>


      {/* ==========================
           BUYER CARDS
      ========================== */}

      {filteredBuyers.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredBuyers.map((buyer) => (

            <BuyerCard
              key={buyer.id}
              buyer={buyer}
            />

          ))}

        </div>

      ) : (

        <div className="bg-white border border-gray-200 rounded-xl text-center py-16">

          <div className="text-4xl mb-3">
            🔍
          </div>

          <h3 className="font-semibold text-gray-700">
            No buyers found
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            No buyers match your current filters.
          </p>

          {(filters.crop ||
            filters.quantity ||
            filters.location ||
            filters.verifiedOnly) && (

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-[#1a4d3e] text-white rounded-lg hover:bg-[#153d32]"
            >
              Clear Filters
            </button>

          )}

        </div>

      )}

    </div>

  )

}