'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
  Search,
  Filter,
  ChevronDown,
  Package,
  MapPin,
  Star,
  Users,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

import { getAvailableLots } from '@/lib/api/buyerLots'
import EmptyState from '@/components/buyer/EmptyState'


// =====================================================
// FILTER OPTIONS
// =====================================================

const CROP_OPTIONS = [
  'All Crops',
  'Potato',
  'Rice',
  'Wheat',
  'Tomato',
  'Onion',
  'Maize',
  'Mustard',
  'Brinjal',
  'Cabbage',
  'Cauliflower'
]

const GRADE_OPTIONS = [
  'All Grades',
  'A',
  'B',
  'C',
  'Not Graded'
]

const STATE_OPTIONS = [
  'All States',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Jharkhand',
  'Uttar Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Rajasthan'
]

const SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest First'
  },
  {
    value: 'price_low',
    label: 'Price: Low to High'
  },
  {
    value: 'price_high',
    label: 'Price: High to Low'
  },
  {
    value: 'quantity_high',
    label: 'Quantity: High to Low'
  }
]


// =====================================================
// PAGE
// =====================================================

export default function BuyerLotsPage() {

  const params = useParams()

  const buyerId = params.id


  // =====================================================
  // STATE
  // =====================================================

  const [lots, setLots] = useState([])

  const [filteredLots, setFilteredLots] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [showFilters, setShowFilters] = useState(false)


  const [filters, setFilters] = useState({

    search: '',

    crop: 'All Crops',

    grade: 'All Grades',

    state: 'All States',

    district: '',

    minPrice: '',

    maxPrice: '',

    sort: 'newest'

  })


  // =====================================================
  // FETCH LOTS FROM DATABASE
  // =====================================================

  const fetchLots = async () => {

    try {

      setLoading(true)

      setError('')


      console.log(
        'Fetching available lots from database...'
      )


      const response =
        await getAvailableLots()


      console.log(
        'Lots API response:',
        response
      )


      if (!response?.success) {

        throw new Error(
          response?.message ||
          'Failed to fetch available lots'
        )

      }


      const databaseLots =
        Array.isArray(response.lots)
          ? response.lots
          : []


      // IMPORTANT:
      // Only use data returned by PostgreSQL API.
      // NO MOCK DATA.

      setLots(databaseLots)


    } catch (err) {

      console.error(
        'Error fetching lots:',
        err
      )


      setLots([])

      setError(
        err?.message ||
        'Unable to connect to the server'
      )


    } finally {

      setLoading(false)

    }

  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchLots()

  }, [])


  // =====================================================
  // APPLY FILTERS
  // =====================================================

  useEffect(() => {

    let result = [...lots]


    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

    if (filters.search.trim()) {

      const search =
        filters.search.toLowerCase().trim()


      result = result.filter((lot) => {

        return (

          lot.crop
            ?.toLowerCase()
            .includes(search)

          ||

          lot.variety
            ?.toLowerCase()
            .includes(search)

          ||

          lot.farmer_name
            ?.toLowerCase()
            .includes(search)

          ||

          lot.district
            ?.toLowerCase()
            .includes(search)

        )

      })

    }


    // -----------------------------------------------------
    // CROP
    // -----------------------------------------------------

    if (filters.crop !== 'All Crops') {

      result = result.filter(
        lot => lot.crop === filters.crop
      )

    }


    // -----------------------------------------------------
    // GRADE
    // -----------------------------------------------------

    if (filters.grade !== 'All Grades') {

      result = result.filter((lot) => {

        if (filters.grade === 'Not Graded') {

          return !lot.quality_grade

        }

        return (
          lot.quality_grade === filters.grade
        )

      })

    }


    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    if (filters.state !== 'All States') {

      result = result.filter(
        lot => lot.state === filters.state
      )

    }


    // -----------------------------------------------------
    // DISTRICT
    // -----------------------------------------------------

    if (filters.district.trim()) {

      const district =
        filters.district.toLowerCase().trim()


      result = result.filter(
        lot =>
          lot.district
            ?.toLowerCase()
            .includes(district)
      )

    }


    // -----------------------------------------------------
    // MIN PRICE
    // -----------------------------------------------------

    if (filters.minPrice !== '') {

      const minPrice =
        Number(filters.minPrice)


      result = result.filter(
        lot =>
          Number(lot.expected_price || 0)
          >= minPrice
      )

    }


    // -----------------------------------------------------
    // MAX PRICE
    // -----------------------------------------------------

    if (filters.maxPrice !== '') {

      const maxPrice =
        Number(filters.maxPrice)


      result = result.filter(
        lot =>
          Number(lot.expected_price || 0)
          <= maxPrice
      )

    }


    // -----------------------------------------------------
    // SORT
    // -----------------------------------------------------

    result.sort((a, b) => {

      switch (filters.sort) {

        case 'newest':

          return (
            new Date(b.created_at || 0) -
            new Date(a.created_at || 0)
          )


        case 'price_low':

          return (
            Number(a.expected_price || 0) -
            Number(b.expected_price || 0)
          )


        case 'price_high':

          return (
            Number(b.expected_price || 0) -
            Number(a.expected_price || 0)
          )


        case 'quantity_high':

          return (
            Number(b.quantity || 0) -
            Number(a.quantity || 0)
          )


        default:

          return 0

      }

    })


    setFilteredLots(result)

  }, [lots, filters])


  // =====================================================
  // FILTER CHANGE
  // =====================================================

  const handleFilterChange = (
    field,
    value
  ) => {

    setFilters(prev => ({
      ...prev,
      [field]: value
    }))

  }


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setFilters({

      search: '',

      crop: 'All Crops',

      grade: 'All Grades',

      state: 'All States',

      district: '',

      minPrice: '',

      maxPrice: '',

      sort: 'newest'

    })

  }


  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return 'N/A'
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    )

  }


  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {

    const colors = {

      Available:
        'bg-green-100 text-green-700',

      Draft:
        'bg-gray-100 text-gray-600',

      'Offers Received':
        'bg-blue-100 text-blue-700',

      Accepted:
        'bg-purple-100 text-purple-700'

    }

    return (
      colors[status] ||
      'bg-gray-100 text-gray-600'
    )

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="p-6 lg:p-8">

        <div className="animate-pulse space-y-4">

          <div className="h-8 w-48 bg-gray-200 rounded" />

          <div className="h-12 bg-gray-200 rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (

                <div
                  key={item}
                  className="h-72 bg-gray-200 rounded-xl"
                />

              )
            )}

          </div>

        </div>

      </div>

    )

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        mb-6
      ">

        <div>

          <h1 className="
            text-2xl
            font-bold
            text-[#2d2d2d]
          ">
            Browse Lots
          </h1>

          <p className="
            text-gray-500
            text-sm
            mt-1
          ">
            Discover farmer and FPO produce lots
            available for purchase
          </p>

        </div>


        <Link
          href={`/buyer/${buyerId}/demand/create`}
          className="
            btn-primary
            flex
            items-center
            gap-2
            mt-4
            md:mt-0
          "
        >

          <Package size={20} />

          Post Demand

        </Link>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="
          mb-6
          bg-red-50
          border
          border-red-200
          rounded-xl
          p-4
          flex
          items-start
          gap-3
        ">

          <AlertCircle
            size={20}
            className="text-red-600 mt-0.5"
          />

          <div className="flex-1">

            <p className="
              font-medium
              text-red-700
            ">
              Unable to load lots
            </p>

            <p className="
              text-sm
              text-red-600
              mt-1
            ">
              {error}
            </p>

          </div>


          <button
            onClick={fetchLots}
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              bg-white
              border
              border-red-200
              rounded-lg
              text-red-700
              text-sm
              hover:bg-red-50
            "
          >

            <RefreshCw size={15} />

            Retry

          </button>

        </div>

      )}


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="
        bg-white
        rounded-xl
        shadow-sm
        p-4
        mb-6
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          gap-4
        ">

          {/* SEARCH */}

          <div className="
            relative
            flex-1
          ">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder="
                Search by crop, variety,
                farmer, or district...
              "
              value={filters.search}
              onChange={(e) =>
                handleFilterChange(
                  'search',
                  e.target.value
                )
              }
              className="
                w-full
                pl-10
                pr-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            />

          </div>


          {/* FILTER BUTTON */}

          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              border
              border-gray-300
              rounded-lg
              hover:bg-gray-50
              transition-colors
            "
          >

            <Filter size={18} />

            Filters

            <ChevronDown
              size={16}
              className={`
                transition-transform
                ${
                  showFilters
                    ? 'rotate-180'
                    : ''
                }
              `}
            />

          </button>

        </div>


        {/* ADVANCED FILTERS */}

        {showFilters && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            lg:grid-cols-4
            gap-4
            mt-4
            pt-4
            border-t
            border-gray-100
          ">

            {/* CROP */}

            <select
              value={filters.crop}
              onChange={(e) =>
                handleFilterChange(
                  'crop',
                  e.target.value
                )
              }
              className="
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            >

              {CROP_OPTIONS.map(
                crop => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {crop}
                  </option>
                )
              )}

            </select>


            {/* GRADE */}

            <select
              value={filters.grade}
              onChange={(e) =>
                handleFilterChange(
                  'grade',
                  e.target.value
                )
              }
              className="
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            >

              {GRADE_OPTIONS.map(
                grade => (
                  <option
                    key={grade}
                    value={grade}
                  >
                    {grade}
                  </option>
                )
              )}

            </select>


            {/* STATE */}

            <select
              value={filters.state}
              onChange={(e) =>
                handleFilterChange(
                  'state',
                  e.target.value
                )
              }
              className="
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            >

              {STATE_OPTIONS.map(
                state => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                )
              )}

            </select>


            {/* DISTRICT */}

            <input
              type="text"
              placeholder="District"
              value={filters.district}
              onChange={(e) =>
                handleFilterChange(
                  'district',
                  e.target.value
                )
              }
              className="
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            />


            {/* PRICE */}

            <div className="flex gap-2">

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  handleFilterChange(
                    'minPrice',
                    e.target.value
                  )
                }
                className="
                  w-1/2
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#1a4d3e]
                "
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  handleFilterChange(
                    'maxPrice',
                    e.target.value
                  )
                }
                className="
                  w-1/2
                  px-4
                  py-2
                  border
                  border-gray-300
                  rounded-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#1a4d3e]
                "
              />

            </div>


            {/* SORT */}

            <select
              value={filters.sort}
              onChange={(e) =>
                handleFilterChange(
                  'sort',
                  e.target.value
                )
              }
              className="
                px-4
                py-2
                border
                border-gray-300
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-[#1a4d3e]
              "
            >

              {SORT_OPTIONS.map(
                option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}

            </select>


            {/* CLEAR */}

            <button
              onClick={clearFilters}
              className="
                px-4
                py-2
                text-[#1a4d3e]
                font-medium
                hover:underline
                text-left
              "
            >
              Clear All
            </button>

          </div>

        )}

      </div>


      {/* =================================================
          RESULT COUNT
      ================================================= */}

      {!error && (

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <p className="
            text-sm
            text-gray-500
          ">

            Showing{' '}

            <span className="
              font-semibold
              text-gray-700
            ">
              {filteredLots.length}
            </span>

            {' '}of{' '}

            <span className="
              font-semibold
              text-gray-700
            ">
              {lots.length}
            </span>

            {' '}available lots

          </p>

        </div>

      )}


      {/* =================================================
          EMPTY DATABASE
      ================================================= */}

      {!error &&
        lots.length === 0 && (

          <EmptyState
            type="lots"
            buyerId={buyerId}
            crop={filters.search}
          />

        )
      }


      {/* =================================================
          NO FILTER RESULTS
      ================================================= */}

      {!error &&
        lots.length > 0 &&
        filteredLots.length === 0 && (

          <div className="
            bg-white
            rounded-xl
            shadow-sm
            p-8
            text-center
          ">

            <Package
              size={48}
              className="
                mx-auto
                text-gray-300
                mb-4
              "
            />

            <h3 className="
              text-lg
              font-bold
              text-[#2d2d2d]
              mb-2
            ">
              No Matching Lots Found
            </h3>

            <p className="
              text-gray-500
              mb-6
            ">
              No available lots match your
              current filters.
            </p>

            <button
              onClick={clearFilters}
              className="
                px-5
                py-2.5
                bg-[#1a4d3e]
                text-white
                rounded-lg
                hover:bg-[#143d31]
              "
            >
              Clear Filters
            </button>

          </div>

        )
      }


      {/* =================================================
          LOT CARDS
      ================================================= */}

      {!error &&
        filteredLots.length > 0 && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          ">

            {filteredLots.map((lot) => (

              <div
                key={lot.id}
                className="
                  bg-white
                  rounded-xl
                  shadow-sm
                  hover:shadow-md
                  transition-shadow
                  border
                  border-gray-100
                  overflow-hidden
                "
              >

                <div className="p-5">

                  {/* HEADER */}

                  <div className="
                    flex
                    items-start
                    justify-between
                  ">

                    <div>

                      <h3 className="
                        font-bold
                        text-[#2d2d2d]
                        text-lg
                      ">
                        {lot.crop || 'Unknown Crop'}
                      </h3>

                      {lot.variety && (

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          {lot.variety}
                        </p>

                      )}

                    </div>


                    <span className={`
                      px-2.5
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getStatusColor(
                        lot.status
                      )}
                    `}>
                      {lot.status || 'Available'}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  ">

                    {/* QUANTITY */}

                    <div>

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Quantity
                      </p>

                      <p className="
                        font-medium
                      ">
                        {lot.quantity ?? 'N/A'}{' '}
                        {lot.unit || ''}
                      </p>

                    </div>


                    {/* GRADE */}

                    <div>

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Grade
                      </p>

                      <p className="
                        font-medium
                      ">
                        {lot.quality_grade || 'Not Graded'}
                      </p>

                    </div>


                    {/* PRICE */}

                    <div className="
                      col-span-2
                    ">

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Expected Price
                      </p>

                      <p className="
                        font-bold
                        text-[#1a4d3e]
                      ">
                        ₹{Number(
                          lot.expected_price || 0
                        ).toLocaleString('en-IN')}

                        {' '}/ {lot.unit || 'unit'}

                      </p>


                      {lot.minimum_price && (

                        <p className="
                          text-xs
                          text-gray-400
                        ">
                          Minimum: ₹{Number(
                            lot.minimum_price
                          ).toLocaleString('en-IN')}
                        </p>

                      )}

                    </div>


                    {/* LOCATION */}

                    <div className="
                      col-span-2
                    ">

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Location
                      </p>

                      <p className="
                        text-sm
                        flex
                        items-center
                        gap-1
                      ">

                        <MapPin
                          size={14}
                          className="text-gray-400"
                        />

                        {lot.district || 'N/A'}
                        {lot.state
                          ? `, ${lot.state}`
                          : ''
                        }

                      </p>

                    </div>


                    {/* SUPPLIER */}

                    {lot.farmer_name && (

                      <div className="
                        col-span-2
                      ">

                        <p className="
                          text-xs
                          text-gray-500
                        ">
                          Supplier
                        </p>

                        <p className="
                          text-sm
                          flex
                          items-center
                          gap-1
                        ">

                          <Users
                            size={14}
                            className="text-gray-400"
                          />

                          {lot.farmer_name}


                          {lot.farmer_rating && (

                            <span className="
                              flex
                              items-center
                              gap-1
                              text-xs
                              text-amber-500
                              ml-2
                            ">

                              <Star size={12} />

                              {lot.farmer_rating}

                            </span>

                          )}

                        </p>

                      </div>

                    )}


                    {/* CREATED DATE */}

                    <div className="
                      col-span-2
                    ">

                      <p className="
                        text-xs
                        text-gray-500
                      ">
                        Listed On
                      </p>

                      <p className="
                        text-sm
                        text-gray-700
                      ">
                        {formatDate(
                          lot.created_at
                        )}
                      </p>

                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="
                    mt-5
                    pt-4
                    border-t
                    border-gray-100
                  ">

                    <Link
                      href={`/buyer/${buyerId}/lots/${lot.id}`}
                      className="
                        block
                        w-full
                        text-center
                        px-4
                        py-2.5
                        bg-[#1a4d3e]
                        text-white
                        rounded-lg
                        hover:bg-[#143d31]
                        transition-colors
                        text-sm
                        font-medium
                      "
                    >
                      View Lot
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )
      }

    </div>

  )

}