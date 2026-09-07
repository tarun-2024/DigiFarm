'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

import {
  User,
  Phone,
  MapPin,
  Home,
  Sprout,
  Package,
  Calendar,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Loader2,
  Languages,
  Building2,
  Plus,
} from 'lucide-react'

import {
  getFarmer,
  updateFarmer,
} from '@/lib/api/farmer'

import ProfileHeader from '@/components/profile/ProfileHeader'
import InfoCard from '@/components/profile/InfoCard'
import ProfileField from '@/components/profile/ProfileField'


// =====================================================
// OPTIONS
// =====================================================

const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Bengali',
  'Other',
]

const STATE_OPTIONS = [
  'West Bengal',
  'Bihar',
  'Odisha',
  'Jharkhand',
  'Uttar Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Rajasthan',
]


// =====================================================
// FARMER PROFILE PAGE
// =====================================================

export default function FarmerProfilePage() {
  const params = useParams()

  const farmerId = params?.id


  // ===================================================
  // STATE
  // ===================================================

  const [farmer, setFarmer] = useState(null)

  const [editData, setEditData] = useState({})

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [error, setError] = useState('')

  const [saveError, setSaveError] = useState('')

  const [saveSuccess, setSaveSuccess] = useState(false)


  // ===================================================
  // FETCH FARMER
  // ===================================================

  useEffect(() => {
    if (!farmerId) {
      return
    }

    fetchFarmer()
  }, [farmerId])


  const fetchFarmer = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getFarmer(farmerId)

      console.log(
        'FARMER PROFILE RESPONSE:',
        response
      )

      if (!response?.success) {
        throw new Error(
          response?.message ||
          'Failed to load farmer profile'
        )
      }

      if (!response?.farmer) {
        throw new Error(
          'Farmer information was not returned by the server'
        )
      }

      // -----------------------------------------------
      // Set farmer data
      // -----------------------------------------------

      setFarmer(response.farmer)

      // -----------------------------------------------
      // Create editable copy
      // -----------------------------------------------

      setEditData({
        name: response.farmer.name || '',
        mobile: response.farmer.mobile || '',
        language: response.farmer.language || '',
        state: response.farmer.state || '',
        district: response.farmer.district || '',
        village: response.farmer.village || '',
        address: response.farmer.address || '',
      })

    } catch (err) {
      console.error(
        'GET FARMER ERROR:',
        err
      )

      setError(
        err?.message ||
        'Unable to load your profile'
      )

    } finally {
      setLoading(false)
    }
  }


  // ===================================================
  // START / CANCEL EDIT
  // ===================================================

  const handleEditClick = () => {

    // -----------------------------------------------
    // Cancel editing
    // -----------------------------------------------

    if (isEditing) {

      setEditData({
        name: farmer?.name || '',
        mobile: farmer?.mobile || '',
        language: farmer?.language || '',
        state: farmer?.state || '',
        district: farmer?.district || '',
        village: farmer?.village || '',
        address: farmer?.address || '',
      })

      setSaveError('')
      setSaveSuccess(false)

      setIsEditing(false)

      return
    }


    // -----------------------------------------------
    // Start editing
    // -----------------------------------------------

    setEditData({
      name: farmer?.name || '',
      mobile: farmer?.mobile || '',
      language: farmer?.language || '',
      state: farmer?.state || '',
      district: farmer?.district || '',
      village: farmer?.village || '',
      address: farmer?.address || '',
    })

    setSaveError('')
    setSaveSuccess(false)

    setIsEditing(true)
  }


  // ===================================================
  // HANDLE FIELD CHANGE
  // ===================================================

  const handleFieldChange = (
    field,
    value
  ) => {

    setEditData((previous) => ({
      ...previous,
      [field]: value,
    }))

    setSaveError('')
    setSaveSuccess(false)
  }


  // ===================================================
  // SAVE PROFILE
  // ===================================================

  const handleSave = async () => {

    if (!farmerId) {
      setSaveError(
        'Farmer ID is missing'
      )
      return
    }


    // -----------------------------------------------
    // Basic validation
    // -----------------------------------------------

    if (!editData.name?.trim()) {
      setSaveError(
        'Full name is required'
      )
      return
    }

    if (!editData.state?.trim()) {
      setSaveError(
        'State is required'
      )
      return
    }

    if (!editData.district?.trim()) {
      setSaveError(
        'District is required'
      )
      return
    }

    if (!editData.village?.trim()) {
      setSaveError(
        'Village is required'
      )
      return
    }


    try {

      setSaving(true)

      setSaveError('')

      setSaveSuccess(false)


      // =================================================
      // ONLY SEND EDITABLE FIELDS
      // =================================================

      const updateData = {
        name: editData.name.trim(),

        language:
          editData.language?.trim() || null,

        state:
          editData.state.trim(),

        district:
          editData.district.trim(),

        village:
          editData.village.trim(),

        address:
          editData.address?.trim() || null,
      }


      console.log(
        'UPDATING FARMER:',
        updateData
      )


      // =================================================
      // UPDATE DATABASE
      // =================================================

      const response = await updateFarmer(
        farmerId,
        updateData
      )


      console.log(
        'UPDATE FARMER RESPONSE:',
        response
      )


      if (!response?.success) {
        throw new Error(
          response?.message ||
          response?.error ||
          'Failed to update profile'
        )
      }


      // =================================================
      // UPDATE LOCAL STATE
      // =================================================

      const updatedFarmer =
        response?.farmer || {
          ...farmer,
          ...updateData,
        }


      setFarmer(updatedFarmer)

      setEditData({
        name: updatedFarmer.name || '',
        mobile: updatedFarmer.mobile || '',
        language: updatedFarmer.language || '',
        state: updatedFarmer.state || '',
        district: updatedFarmer.district || '',
        village: updatedFarmer.village || '',
        address: updatedFarmer.address || '',
      })


      // =================================================
      // UPDATE LOCAL STORAGE
      // =================================================

      try {

        // ---------------------------------------------
        // digifarm_user
        // ---------------------------------------------

        const storedUser =
          localStorage.getItem(
            'digifarm_user'
          )

        if (storedUser) {

          const user =
            JSON.parse(storedUser)

          const updatedUser = {
            ...user,

            name:
              updatedFarmer.name,

            state:
              updatedFarmer.state,

            district:
              updatedFarmer.district,

            village:
              updatedFarmer.village,

            language:
              updatedFarmer.language,
          }

          localStorage.setItem(
            'digifarm_user',
            JSON.stringify(updatedUser)
          )
        }


        // ---------------------------------------------
        // digifarm_farmer
        // ---------------------------------------------

        const storedFarmer =
          localStorage.getItem(
            'digifarm_farmer'
          )

        if (storedFarmer) {

          const existingFarmer =
            JSON.parse(storedFarmer)

          localStorage.setItem(
            'digifarm_farmer',
            JSON.stringify({
              ...existingFarmer,
              ...updatedFarmer,
            })
          )
        }

      } catch (storageError) {

        console.error(
          'LOCAL STORAGE UPDATE ERROR:',
          storageError
        )
      }


      // =================================================
      // SUCCESS
      // =================================================

      setIsEditing(false)

      setSaveSuccess(true)


      // -------------------------------------------------
      // Hide success message
      // -------------------------------------------------

      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)


      // =================================================
      // RE-FETCH FROM BACKEND
      // =================================================
      //
      // This ensures that the UI displays exactly
      // what exists in PostgreSQL.
      //
      // Farming summary is also obtained from backend.
      //
      // =================================================

      await fetchFarmer()


    } catch (err) {

      console.error(
        'UPDATE FARMER ERROR:',
        err
      )

      setSaveError(
        err?.message ||
        'Failed to update profile'
      )

    } finally {

      setSaving(false)
    }
  }


  // ===================================================
  // FORMAT DATE
  // ===================================================

  const formatDate = (date) => {

    if (!date) {
      return 'Not available'
    }

    const parsedDate =
      new Date(date)

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return 'Not available'
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }
    )
  }


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <div className="p-6 lg:p-8">

        <div className="animate-pulse space-y-6">

          <div className="h-40 bg-gray-200 rounded-2xl" />

          <div className="grid md:grid-cols-2 gap-6">

            <div className="h-64 bg-gray-200 rounded-xl" />

            <div className="h-64 bg-gray-200 rounded-xl" />

          </div>

        </div>

      </div>
    )
  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (
      <div className="p-6 lg:p-8">

        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">

          <AlertCircle
            size={40}
            className="text-red-600 mx-auto mb-4"
          />

          <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">
            Unable to Load Profile
          </h3>

          <p className="text-red-600 mb-4">
            {error}
          </p>

          <button
            onClick={fetchFarmer}
            className="btn-primary"
          >
            Try Again
          </button>

        </div>

      </div>
    )
  }


  // ===================================================
  // PROFILE NOT FOUND
  // ===================================================

  if (!farmer) {

    return (
      <div className="p-6 lg:p-8">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">

          <AlertCircle
            size={40}
            className="text-amber-600 mx-auto mb-4"
          />

          <h3 className="text-lg font-bold text-[#2d2d2d] mb-2">
            Profile Not Found
          </h3>

          <p className="text-gray-600">
            We couldn't find your profile information.
          </p>

        </div>

      </div>
    )
  }


  // ===================================================
  // LOCATION
  // ===================================================

  const location =
    farmer.district &&
    farmer.state
      ? `${farmer.district}, ${farmer.state}`
      : farmer.state ||
        'Location not set'


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="p-6 lg:p-8 max-w-6xl mx-auto">


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {saveSuccess && (

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">

          <CheckCircle
            size={20}
            className="text-green-600 flex-shrink-0"
          />

          <p className="text-green-700 font-medium">
            Profile updated successfully!
          </p>

        </div>
      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {saveError && (

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">

          <AlertCircle
            size={20}
            className="text-red-600 flex-shrink-0"
          />

          <p className="text-red-700">
            {saveError}
          </p>

        </div>
      )}


      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <ProfileHeader
        name={farmer.name}
        role="Farmer"
        mobile={farmer.mobile}
        location={location}
        status={farmer.status || 'Active'}
        onEdit={handleEditClick}
        isEditing={isEditing}
        avatar={farmer.name?.[0] || 'F'}
      />


      {/* =================================================
          EDIT BUTTONS
      ================================================= */}

      {isEditing && (

        <div className="mt-4 flex gap-3 justify-end">

          {/* Cancel */}

          <button
            type="button"
            onClick={handleEditClick}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >

            <X size={18} />

            Cancel

          </button>


          {/* Save */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a4d3e] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >

            {saving ? (

              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...
              </>

            ) : (

              <>
                <Save size={18} />

                Save Changes
              </>

            )}

          </button>

        </div>
      )}


      {/* =================================================
          PERSONAL + ACCOUNT INFORMATION
      ================================================= */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <InfoCard
          title="Personal Information"
          icon={User}
        >

          {/* Full Name */}

          <ProfileField
            label="Full Name"
            value={editData.name || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'name',
                value
              )
            }
            icon={User}
            required
          />


          {/* Mobile */}

          <ProfileField
            label="Mobile Number"
            value={editData.mobile || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'mobile',
                value
              )
            }
            icon={Phone}
            required
            disabled={true}
          />


          {/* Language */}

          <ProfileField
            label="Language"
            value={editData.language || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'language',
                value
              )
            }
            icon={Languages}
            options={LANGUAGE_OPTIONS}
          />


          {/* State */}

          <ProfileField
            label="State"
            value={editData.state || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'state',
                value
              )
            }
            icon={MapPin}
            options={STATE_OPTIONS}
            required
          />


          {/* District */}

          <ProfileField
            label="District"
            value={editData.district || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'district',
                value
              )
            }
            icon={MapPin}
            required
          />


          {/* Village */}

          <ProfileField
            label="Village"
            value={editData.village || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'village',
                value
              )
            }
            icon={Home}
            required
          />


          {/* Address */}

          <ProfileField
            label="Address"
            value={editData.address || ''}
            isEditing={isEditing}
            onChange={(value) =>
              handleFieldChange(
                'address',
                value
              )
            }
            icon={Building2}
          />

        </InfoCard>


        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <InfoCard
          title="Account Information"
          icon={Calendar}
        >

          {/* Farmer ID */}

          <div>

            <label className="block text-xs font-medium text-gray-500 mb-1">
              Farmer ID
            </label>

            <p className="text-[#2d2d2d] font-mono text-sm">
              {farmer.id || 'N/A'}
            </p>

          </div>


          {/* Account Status */}

          <div>

            <label className="block text-xs font-medium text-gray-500 mb-1">
              Account Status
            </label>

            <p className="flex items-center gap-2">

              <span className="text-[#2d7d46] font-medium">
                {farmer.status || 'Active'}
              </span>

              <span className="flex items-center gap-1 text-xs text-green-600">

                <CheckCircle size={14} />

                Verified

              </span>

            </p>

          </div>


          {/* Joined On */}

          <div>

            <label className="block text-xs font-medium text-gray-500 mb-1">
              Joined On
            </label>

            <p className="text-[#2d2d2d]">
              {formatDate(
                farmer.created_at
              )}
            </p>

          </div>


          {/* Last Updated */}

          {farmer.updated_at && (

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Last Updated
              </label>

              <p className="text-[#2d2d2d] text-sm">
                {formatDate(
                  farmer.updated_at
                )}
              </p>

            </div>

          )}

        </InfoCard>

      </div>


      {/* =================================================
          FARMING INFORMATION
      ================================================= */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">


        {/* =================================================
            FARMING SUMMARY
        ================================================= */}

        <InfoCard
          title="Farming Summary"
          icon={Sprout}
        >

          <div className="grid grid-cols-2 gap-4">


            {/* Total Lots */}

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Total Lots
              </label>

              <p className="text-2xl font-bold text-[#1a4d3e]">
                {farmer.total_lots ?? 0}
              </p>

            </div>


            {/* Active Lots */}

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Active Lots
              </label>

              <p className="text-2xl font-bold text-[#2d7d46]">
                {farmer.active_lots ?? 0}
              </p>

            </div>


            {/* Sold Lots */}

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sold Lots
              </label>

              <p className="text-2xl font-bold text-gray-600">
                {farmer.sold_lots ?? 0}
              </p>

            </div>


            {/* Total Quantity */}

            <div>

              <label className="block text-xs font-medium text-gray-500 mb-1">
                Total Quantity
              </label>

              <p className="text-2xl font-bold text-[#1a4d3e]">
                {farmer.total_quantity ?? 0} q
              </p>

            </div>

          </div>

        </InfoCard>


        {/* =================================================
            CROPS GROWN
        ================================================= */}

        <InfoCard
          title="Crops Grown"
          icon={Package}
        >

          {Array.isArray(farmer.crops) &&
          farmer.crops.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {farmer.crops.map(
                (crop, index) => {

                  const cropName =
                    typeof crop === 'string'
                      ? crop
                      : crop?.name ||
                        crop?.crop ||
                        crop?.crop_name

                  if (!cropName) {
                    return null
                  }

                  return (

                    <span
                      key={`${cropName}-${index}`}
                      className="px-3 py-1 bg-[#e8f5e9] text-[#1a4d3e] rounded-full text-sm font-medium"
                    >
                      {cropName}
                    </span>

                  )
                }
              )}

            </div>

          ) : (

            <p className="text-gray-500 text-sm">
              No crops added yet
            </p>

          )}


          {/* Create Lot */}

          <div className="mt-4 pt-4 border-t border-gray-100">

            <Link
              href={`/farmer/${farmerId}/lots/create`}
              className="text-[#2d7d46] font-medium hover:underline text-sm flex items-center gap-1"
            >

              <Plus size={16} />

              Create New Lot

            </Link>

          </div>

        </InfoCard>

      </div>


      {/* =================================================
          RECENT LOTS
      ================================================= */}

      {Array.isArray(farmer.recent_lots) &&
      farmer.recent_lots.length > 0 && (

        <div className="mt-6">

          <InfoCard
            title="Recent Lots"
            icon={Package}
          >

            <div className="space-y-3">

              {farmer.recent_lots.map(
                (lot) => (

                  <div
                    key={lot.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >

                    <div>

                      <p className="font-medium text-[#2d2d2d]">
                        {lot.crop}
                      </p>

                      <p className="text-sm text-gray-500">
                        {lot.quantity} {lot.unit}
                      </p>

                    </div>


                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lot.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : lot.status === 'Sold'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >

                      {lot.status || 'Draft'}

                    </span>

                  </div>

                )
              )}

            </div>

          </InfoCard>

        </div>

      )}

    </div>
  )
}