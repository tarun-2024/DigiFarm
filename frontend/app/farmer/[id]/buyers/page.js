'use client'

import { useState, useEffect } from 'react'
import BuyerCard from '@/components/shared/BuyerCard'

export default function FarmerBuyersPage() {

  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    crop: '',
    quantity: '',
    location: '',
    verifiedOnly: false
  })


  // ==========================
  // Fetch buyers from Flask
  // ==========================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/buyers")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch buyers")
        }

        return response.json()

      })

      .then((data) => {

        setBuyers(data)
        setLoading(false)

      })

      .catch((error) => {

        console.error("Error fetching buyers:", error)
        setLoading(false)

      })

  }, [])


  // ==========================
  // Filter buyers
  // ==========================

  const filteredBuyers = buyers.filter((buyer) => {

    // Crop
    if (
      filters.crop &&
      buyer.crop.toLowerCase() !== filters.crop.toLowerCase()
    ) {
      return false
    }


    // Quantity
    if (
      filters.quantity &&
      Number(buyer.demand) < Number(filters.quantity)
    ) {
      return false
    }


    // Location
    if (
      filters.location &&
      !buyer.location
        .toLowerCase()
        .includes(filters.location.toLowerCase())
    ) {
      return false
    }


    // Verified
    if (
      filters.verifiedOnly &&
      !buyer.verified
    ) {
      return false
    }


    return true
  })


  if (loading) {
    return <p>Loading buyers...</p>
  }


  return (


      <div className="p-6 lg:p-8">

        {/* ==========================
             Header
        ========================== */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-[#2d2d2d]">
            Find Buyers
          </h1>

          <p className="text-gray-500 mt-1">
            Discover verified buyers for your produce
          </p>

        </div>


        {/* ==========================
             Filters
        ========================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">


          {/* Crop */}

          <select
            value={filters.crop}
            onChange={(e) =>
              setFilters({
                ...filters,
                crop: e.target.value
              })
            }

            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
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


          {/* Quantity */}

          <input
            type="number"
            placeholder="Quantity (tonnes)"
            value={filters.quantity}

            onChange={(e) =>
              setFilters({
                ...filters,
                quantity: e.target.value
              })
            }

            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
          />


          {/* Location */}

          <input
            type="text"
            placeholder="Location"
            value={filters.location}

            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value
              })
            }

            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e]"
          />


          {/* Verified */}

          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg">

            <input
              type="checkbox"
              className="w-4 h-4 text-[#1a4d3e] focus:ring-[#1a4d3e]"

              checked={filters.verifiedOnly}

              onChange={(e) =>
                setFilters({
                  ...filters,
                  verifiedOnly: e.target.checked
                })
              }
            />

            <span className="text-sm">
              Verified Only
            </span>

          </label>

        </div>


        {/* ==========================
             Result Count
        ========================== */}

        <p className="text-sm text-gray-500 mb-4">

          Showing {filteredBuyers.length} buyer
          {filteredBuyers.length !== 1 ? 's' : ''}

        </p>


        {/* ==========================
             Buyer Cards
        ========================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredBuyers.map((buyer) => (

            <BuyerCard
              key={buyer.id}
              buyer={buyer}
            />

          ))}

        </div>


        {/* ==========================
             No Results
        ========================== */}

        {filteredBuyers.length === 0 && (

          <div className="text-center py-12">

            <p className="text-gray-500">
              No buyers found matching your filters.
            </p>

          </div>

        )}

      </div>

  )
}