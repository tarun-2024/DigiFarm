'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react'

import { INITIAL_FARMER_STATE } from '@/lib/constants/onboarding'
import ProgressSteps from '@/components/onboarding/ProgressSteps'
import BasicInfoStep from '@/components/onboarding/BasicInfoStep'
import FarmDetailsStep from '@/components/onboarding/FarmDetailsStep'
import ProduceStep from '@/components/onboarding/ProduceStep'
import SellingPreferencesStep from '@/components/onboarding/SellingPreferencesStep'
import OnboardingSummary from '@/components/onboarding/OnboardingSummary'

import { createFarmer } from '@/lib/api/farmer'

// =====================================================
// DIGIFARM LOGO
// =====================================================

let DigiFarmLogo

try {
  const logoModule = require('@/components/ui/DigiFarmLogo')
  DigiFarmLogo = logoModule.default || logoModule
} catch (e) {
  // Fallback logo component
  DigiFarmLogo = ({ size = 'md' }) => {
    const sizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
      xl: 'text-5xl',
    }

    return (
      <div className="flex items-center gap-3">
        <div className="bg-[#1a4d3e] text-white rounded-full p-2">
          <span className="font-bold text-xl">
            DF
          </span>
        </div>

        <span
          className={`font-bold ${
            sizes[size] || sizes.md
          } text-[#1a4d3e]`}
        >
          Digi
          <span className="text-[#2d7d46]">
            Farm
          </span>
        </span>
      </div>
    )
  }
}

// =====================================================
// FARMER ONBOARDING
// =====================================================

export default function FarmerOnboarding() {
  const router = useRouter()

  // =====================================================
  // STATE
  // =====================================================

  const [currentStep, setCurrentStep] = useState(1)

  const [farmer, setFarmer] = useState(
    INITIAL_FARMER_STATE
  )

  const [isComplete, setIsComplete] = useState(false)

  const [createdFarmerId, setCreatedFarmerId] =
    useState(null)

  const [errors, setErrors] = useState({})

  const [mounted, setMounted] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  // =====================================================
  // LOAD SAVED FARMER PROFILE
  // =====================================================

  useEffect(() => {
    setMounted(true)

    try {
      const saved = localStorage.getItem(
        'digifarm_farmer_profile'
      )

      if (saved) {
        const parsed = JSON.parse(saved)

        setFarmer(parsed)

        // If saved profile already has an ID,
        // remember it.
        if (parsed?.id) {
          setCreatedFarmerId(parsed.id)
        }
      }
    } catch (e) {
      console.error(
        'Failed to parse saved profile',
        e
      )
    }
  }, [])

  // =====================================================
  // SAVE FARMER PROFILE LOCALLY
  // =====================================================

  useEffect(() => {
    if (
      mounted &&
      farmer !== INITIAL_FARMER_STATE
    ) {
      try {
        localStorage.setItem(
          'digifarm_farmer_profile',
          JSON.stringify(farmer)
        )
      } catch (e) {
        console.error(
          'Failed to save profile',
          e
        )
      }
    }
  }, [farmer, mounted])

  // =====================================================
  // UPDATE FARMER FIELD
  // =====================================================

  const updateFarmer = (field, value) => {
    setFarmer(prev => ({
      ...prev,
      [field]: value,
    }))

    // Remove error when user fixes field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {
          ...prev,
        }

        delete newErrors[field]

        return newErrors
      })
    }
  }

  // =====================================================
  // UPDATE CROP
  // =====================================================

  const updateCrop = (
    index,
    field,
    value
  ) => {
    const updatedCrops = [
      ...farmer.crops,
    ]

    updatedCrops[index] = {
      ...updatedCrops[index],
      [field]: value,
    }

    setFarmer(prev => ({
      ...prev,
      crops: updatedCrops,
    }))
  }

  // =====================================================
  // ADD NEW CROP
  // =====================================================

  const addCrop = () => {
    setFarmer(prev => ({
      ...prev,

      crops: [
        ...prev.crops,

        {
          crop: '',
          variety: '',
          quantity: '',
          harvestDate: '',
          expectedSellingDate: '',
        },
      ],
    }))
  }

  // =====================================================
  // REMOVE CROP
  // =====================================================

  const removeCrop = index => {
    // At least one crop must remain
    if (farmer.crops.length <= 1) {
      return
    }

    setFarmer(prev => ({
      ...prev,

      crops: prev.crops.filter(
        (_, i) => i !== index
      ),
    }))
  }

  // =====================================================
  // VALIDATE CURRENT STEP
  // =====================================================

  const validateStep = step => {
    const newErrors = {}

    // =========================================
    // STEP 1 - BASIC INFORMATION
    // =========================================

    if (step === 1) {
      if (!farmer.name?.trim()) {
        newErrors.name =
          'Please enter your full name'
      }

      if (!farmer.mobile?.trim()) {
        newErrors.mobile =
          'Please enter your mobile number'
      }

      if (
        farmer.mobile?.trim() &&
        !/^[0-9]{10}$/.test(
          farmer.mobile.trim()
        )
      ) {
        newErrors.mobile =
          'Please enter a valid 10-digit mobile number'
      }

      if (!farmer.state) {
        newErrors.state =
          'Please select your state'
      }

      if (!farmer.district) {
        newErrors.district =
          'Please select your district'
      }

      if (!farmer.village?.trim()) {
        newErrors.village =
          'Please enter your village'
      }

      if (!farmer.language) {
        newErrors.language =
          'Please select your preferred language'
      }
    }

    // =========================================
    // STEP 2 - FARM DETAILS
    // =========================================

    if (step === 2) {
      if (!farmer.farmSize) {
        newErrors.farmSize =
          'Please enter your farm size'
      }

      if (
        farmer.farmSize &&
        isNaN(farmer.farmSize)
      ) {
        newErrors.farmSize =
          'Please enter a valid number'
      }

      if (!farmer.irrigation) {
        newErrors.irrigation =
          'Please select irrigation availability'
      }

      if (!farmer.fpoMember) {
        newErrors.fpoMember =
          'Please select FPO membership status'
      }

      if (
        farmer.fpoMember === 'Yes' &&
        !farmer.fpoName?.trim()
      ) {
        newErrors.fpoName =
          'Please enter your FPO name'
      }
    }

    // =========================================
    // STEP 3 - PRODUCE
    // =========================================

    if (step === 3) {
      farmer.crops.forEach(
        (crop, index) => {
          if (!crop.crop) {
            newErrors[`crop_${index}`] =
              'Please select a crop'
          }

          if (!crop.quantity) {
            newErrors[`quantity_${index}`] =
              'Please enter quantity'
          }

          if (
            crop.quantity &&
            isNaN(crop.quantity)
          ) {
            newErrors[`quantity_${index}`] =
              'Please enter a valid number'
          }

          if (!crop.harvestDate) {
            newErrors[`harvest_${index}`] =
              'Please select harvest date'
          }

          if (
            !crop.expectedSellingDate
          ) {
            newErrors[`selling_${index}`] =
              'Please select expected selling date'
          }
        }
      )
    }

    // =========================================
    // STEP 4 - SELLING PREFERENCES
    // =========================================

    if (step === 4) {
      if (!farmer.paymentNeed) {
        newErrors.paymentNeed =
          'Please select your payment preference'
      }

      if (!farmer.storageAvailable) {
        newErrors.storageAvailable =
          'Please select storage availability'
      }

      if (
        farmer.storageAvailable === 'Yes' &&
        !farmer.storageDuration
      ) {
        newErrors.storageDuration =
          'Please select maximum storage duration'
      }

      if (!farmer.minimumPrice) {
        newErrors.minimumPrice =
          'Please enter minimum acceptable price'
      }

      if (
        farmer.minimumPrice &&
        isNaN(farmer.minimumPrice)
      ) {
        newErrors.minimumPrice =
          'Please enter a valid number'
      }
    }

    setErrors(newErrors)

    return (
      Object.keys(newErrors).length === 0
    )
  }

  // =====================================================
  // NEXT BUTTON
  // =====================================================

  const handleNext = () => {
    // Prevent duplicate submission
    if (isLoading) {
      return
    }

    if (validateStep(currentStep)) {
      // Step 4 = complete onboarding
      if (currentStep === 4) {
        handleComplete()
      }

      // Go to next step
      else {
        setCurrentStep(
          prev => prev + 1
        )

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }

    // Scroll to first validation error
    else {
      const firstError =
        document.querySelector(
          '.border-red-500'
        )

      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    if (isLoading) {
      return
    }

    setCurrentStep(
      prev => prev - 1
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // =====================================================
  // SIGN IN BUTTON
  // =====================================================

  const goToLogin = () => {
    router.push('/signin')
  }

  // =====================================================
  // COMPLETE ONBOARDING
  // =====================================================

  const handleComplete = async () => {
  // Prevent duplicate clicks
  if (isLoading) {
    return
  }

  try {
    // Start loading
    setIsLoading(true)

    // Remove previous submit error
    setErrors(prev => ({
      ...prev,
      submit: undefined,
    }))

    // ================================================
    // SEND FARMER INFORMATION TO FLASK
    // ================================================

    const data = await createFarmer(farmer)

    console.log("Farmer created:", data)

    // ================================================
    // HANDLE DUPLICATE MOBILE NUMBER
    // ================================================

    if (data?.duplicate) {
      console.log(
        "Mobile number already exists:",
        data?.message
      )

      setErrors(prev => ({
        ...prev,
        submit:
          data?.message ||
          "This mobile number is already registered.",
      }))

      // IMPORTANT:
      // Do NOT open dashboard
      // Do NOT show success screen
      return
    }

    // ================================================
    // GET FARMER ID
    // ================================================

    /*
     * Support all common backend response formats:
     *
     * { farmer_id: 5 }
     *
     * { farmer: { id: 5 } }
     *
     * { id: 5 }
     */

    const farmerId =
      data?.farmer_id ??
      data?.farmer?.id ??
      data?.id

    console.log(
      "FARMER ID FROM SERVER:",
      farmerId
    )

    // ================================================
    // FARMER ID NOT FOUND
    // ================================================

    if (!farmerId) {
      console.error(
        "FULL FARMER SERVER RESPONSE:",
        data
      )

      throw new Error(
        "Farmer ID was not returned by the server."
      )
    }

    // ================================================
    // SAVE FARMER ID
    // ================================================

    setCreatedFarmerId(farmerId)

    console.log(
      "Created Farmer ID:",
      farmerId
    )

    // ================================================
    // CREATE COMPLETE FARMER OBJECT
    // ================================================

    const savedFarmer = {
      ...farmer,
      id: farmerId,
    }

    // ================================================
    // SAVE TO LOCAL STORAGE
    // ================================================

    localStorage.setItem(
      "digifarm_farmer",
      JSON.stringify(savedFarmer)
    )

    localStorage.setItem(
      "digifarm_farmer_profile",
      JSON.stringify(savedFarmer)
    )

    // ================================================
    // SAVE LOGGED-IN USER
    // ================================================

    localStorage.setItem(
      "digifarm_user",
      JSON.stringify({
        ...savedFarmer,
        role: "farmer",
        loggedInAt: new Date().toISOString(),
      })
    )

    // ================================================
    // UPDATE FARMER STATE
    // ================================================

    setFarmer(savedFarmer)

    // ================================================
    // SHOW SUCCESS SCREEN
    // ================================================

    setIsComplete(true)

  } catch (error) {
    console.error(
      "ONBOARDING ERROR:",
      error
    )

    setErrors(prev => ({
      ...prev,
      submit:
        error?.message ||
        "Unable to complete onboarding. Please try again.",
    }))
  } finally {
    // Stop loading
    setIsLoading(false)
  }
}

  // =====================================================
  // GO TO FARMER DASHBOARD
  // =====================================================

  const goToDashboard = () => {
    if (!createdFarmerId) {
      console.error(
        'Farmer ID is missing'
      )

      setErrors(prev => ({
        ...prev,
        submit:
          'Farmer ID is missing. Please try signing up again.',
      }))

      return
    }

    console.log(
      'Opening dashboard:',
      `/farmer/${createdFarmerId}/dashboard`
    )

    // Open dashboard in a new tab
    window.open(
      `/farmer/${createdFarmerId}/dashboard`,
      '_blank'
    )
  }

  // =====================================================
  // PREVENT HYDRATION MISMATCH
  // =====================================================

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#1a4d3e]">
          Loading...
        </div>
      </div>
    )
  }

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white flex items-center justify-center p-4">

        <div className="w-full max-w-3xl">

          <OnboardingSummary
            farmer={farmer}
            onContinue={goToDashboard}
          />

          {/* Show error if redirect cannot happen */}

          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm text-center">
              {errors.submit}
            </div>
          )}

        </div>

      </div>
    )
  }

  // =====================================================
  // RENDER CURRENT STEP
  // =====================================================

  const renderStep = () => {
    switch (currentStep) {

      // =======================================
      // STEP 1
      // =======================================

      case 1:
        return (
          <BasicInfoStep
            farmer={farmer}
            updateFarmer={updateFarmer}
            errors={errors}
          />
        )

      // =======================================
      // STEP 2
      // =======================================

      case 2:
        return (
          <FarmDetailsStep
            farmer={farmer}
            updateFarmer={updateFarmer}
            errors={errors}
          />
        )

      // =======================================
      // STEP 3
      // =======================================

      case 3:
        return (
          <ProduceStep
            farmer={farmer}
            updateCrop={updateCrop}
            addCrop={addCrop}
            removeCrop={removeCrop}
            errors={errors}
          />
        )

      // =======================================
      // STEP 4
      // =======================================

      case 4:
        return (
          <SellingPreferencesStep
            farmer={farmer}
            updateFarmer={updateFarmer}
            errors={errors}
          />
        )

      default:
        return null
    }
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white py-8 px-4">

      <div className="max-w-3xl mx-auto">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="text-center mb-8">

          <div className="flex justify-center mb-2">
            <DigiFarmLogo size="lg" />
          </div>

          <p className="text-sm text-gray-500">
            From Farm to Better Markets
          </p>

        </div>

        {/* =====================================
            PROGRESS
        ====================================== */}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-4">

            <span className="text-sm font-medium text-[#1a4d3e]">
              Step {currentStep} of 4
            </span>

            <span className="text-sm text-gray-500">
              {currentStep === 4
                ? 'Almost there!'
                : 'Tell us about yourself'}
            </span>

          </div>

          <ProgressSteps
            currentStep={currentStep}
          />

        </div>

        {/* =====================================
            STEP CONTENT
        ====================================== */}

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">

          {renderStep()}

        </div>

        {/* =====================================
            SUBMIT ERROR
        ====================================== */}

        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {errors.submit}
          </div>
        )}

        {/* =====================================
            NAVIGATION
        ====================================== */}

        <div className="flex items-center justify-between mt-6">

          {/* BACK BUTTON */}

          {currentStep > 1 ? (

            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 text-[#1a4d3e] hover:bg-[#e8f5e9] rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />

              Back
            </button>

          ) : (

            <div />

          )}

          {/* =====================================
              SIGN IN + CONTINUE
          ====================================== */}

          <div className="flex items-center gap-3">

            {/* SIGN IN */}

            <button
              type="button"
              onClick={goToLogin}
              disabled={isLoading}
              className="px-6 py-3 text-[#1a4d3e] border border-[#1a4d3e] rounded-lg hover:bg-[#e8f5e9] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>

            {/* CONTINUE / COMPLETE */}

            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="bg-[#1a4d3e] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              {isLoading ? (

                <>
                  <span className="animate-spin">
                    ⏳
                  </span>

                  Saving...
                </>

              ) : (

                <>

                  {currentStep === 4
                    ? 'Complete Setup'
                    : 'Continue'}

                  <ArrowRight size={20} />

                </>

              )}

            </button>

          </div>

        </div>

        {/* =====================================
            AI CONNECTION CARD
        ====================================== */}

        <div className="mt-8 bg-white rounded-xl shadow-sm p-4 border border-[#e8f5e9]">

          <h4 className="text-sm font-semibold text-[#1a4d3e] flex items-center gap-2">

            <CheckCircle
              size={16}
              className="text-[#2d7d46]"
            />

            Your information powers DigiFarm AI

          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs text-gray-600">

            <div>
              📍 Location → Nearby Markets
            </div>

            <div>
              🌾 Crop + Quantity → Demand + Matching
            </div>

            <div>
              ⏰ Selling Preference → Sale Window
            </div>

            <div>
              🏠 Storage → Wait vs Sell Decision
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}