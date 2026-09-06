import React from 'react'
import { MapPin, Shield, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default function BuyerCard({ buyer }) {

  const {
    name,
    verified,
    crop,
    demand,
    grade,
    offeredPrice,
    distance,
    trustScore,
    match,
    location,
    id
  } = buyer

  return (
    <div className="card hover:border-[#2d7d46] border-2 border-transparent">

      {/* Buyer Name + Location */}
      <div className="flex items-start justify-between mb-3">

        <div>
          <h3 className="font-bold text-[#2d2d2d]">
            {name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <MapPin size={14} className="text-gray-400" />

            <span className="text-sm text-gray-500">
              {location}
            </span>
          </div>
        </div>


        {/* Verified */}
        {verified && (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">

            <CheckCircle size={14} />

            Verified

          </div>
        )}

      </div>


      {/* Buyer Details */}
      <div className="grid grid-cols-2 gap-3 my-4">

        {/* Crop */}
        <div>
          <p className="text-xs text-gray-500">
            Crop
          </p>

          <p className="font-medium">
            {crop}
          </p>
        </div>


        {/* Demand */}
        <div>
          <p className="text-xs text-gray-500">
            Demand
          </p>

          <p className="font-medium">
            {demand} tonnes
          </p>
        </div>


        {/* Grade */}
        <div>
          <p className="text-xs text-gray-500">
            Required Grade
          </p>

          <p className="font-medium">
            {grade}
          </p>
        </div>


        {/* Offered Price */}
        <div>
          <p className="text-xs text-gray-500">
            Offered Price
          </p>

          <p className="font-medium">
            ₹{offeredPrice}/qunital
          </p>
        </div>


        {/* Distance */}
        <div>
          <p className="text-xs text-gray-500">
            Distance
          </p>

          <p className="font-medium">
            {distance} km
          </p>
        </div>

      </div>


      {/* Trust + Match */}
      <div className="flex items-center gap-4 mb-4">

        <div className="flex items-center gap-2">

          <Shield
            size={16}
            className="text-[#2d7d46]"
          />

          <span className="text-sm font-medium">
            Trust {trustScore}/100
          </span>

        </div>


        <div className="flex items-center gap-2">

          <Star
            size={16}
            className="text-amber-500"
          />

          <span className="text-sm font-bold text-[#1a4d3e]">
            {match}% Match
          </span>

        </div>

      </div>


      {/* Buttons */}
      <div className="flex gap-3">

        <Link
          href={`/farmer/buyers/${id}`}
          className="btn-outline text-sm flex-1 text-center"
        >
          View Buyer
        </Link>

        <button className="btn-primary text-sm flex-1">
          Make Deal
        </button>

      </div>

    </div>
  )
}