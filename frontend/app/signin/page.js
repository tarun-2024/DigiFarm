'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Shield,
  Leaf
} from 'lucide-react'

import DigiFarmLogo from '@/components/ui/DigiFarmLogo'

import { loginFarmer } from '@/lib/api/farmer'
import { loginBuyer } from '@/lib/api/buyer'


export default function SignInPage() {

  const router = useRouter()

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'farmer'
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)


  // =====================================================
  // ROLES
  // =====================================================

  const roles = [
    {
      id: 'farmer',
      label: 'Farmer',
      icon: Shield,
      color: 'bg-[#2d7d46]',
      description: 'Sell your produce'
    },
    {
      id: 'fpo',
      label: 'FPO',
      icon: Shield,
      color: 'bg-blue-600',
      description: 'Manage aggregation'
    },
    {
      id: 'buyer',
      label: 'Buyer',
      icon: Shield,
      color: 'bg-purple-600',
      description: 'Procure quality produce'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: Shield,
      color: 'bg-amber-600',
      description: 'Manage platform'
    }
  ]


  // =====================================================
  // ROLE SELECT
  // =====================================================

  const handleRoleSelect = (roleId) => {

    setFormData(prev => ({
      ...prev,
      role: roleId
    }))

    setError('')
    setShowSuccess(false)
  }


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setShowSuccess(false)


    // ===================================================
    // CHECK SUPPORTED ROLES
    // ===================================================

    if (
      formData.role !== 'farmer' &&
      formData.role !== 'buyer'
    ) {

      setError(
        `${formData.role.toUpperCase()} sign in is not available yet.`
      )

      return
    }


    // ===================================================
    // VALIDATE MOBILE
    // ===================================================

    if (!formData.phone) {

      setError(
        'Please enter your mobile number'
      )

      return
    }


    if (!/^[0-9]{10}$/.test(formData.phone)) {

      setError(
        'Please enter a valid 10-digit phone number'
      )

      return
    }


    // ===================================================
    // VALIDATE PASSWORD
    // ===================================================

    if (!formData.password) {

      setError(
        'Please enter your password'
      )

      return
    }


    if (formData.password.length < 6) {

      setError(
        'Password must be at least 6 characters'
      )

      return
    }


    try {

      setIsLoading(true)


      // =================================================
      // CALL LOGIN API
      // =================================================

      let data

      if (formData.role === 'farmer') {

        // -----------------------------------------------
        // FARMER LOGIN
        // -----------------------------------------------

        data = await loginFarmer({
          mobile: formData.phone,
          password: formData.password
        })

      } else if (formData.role === 'buyer') {

        // -----------------------------------------------
        // BUYER LOGIN
        // -----------------------------------------------

        data = await loginBuyer({
          mobile: formData.phone,
          password: formData.password
        })

      }


      console.log('LOGIN RESPONSE:', data)


      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!data?.success) {

        setError(
          data?.error ||
          data?.message ||
          'Invalid mobile number or password'
        )

        return
      }


      // =================================================
      // FARMER LOGIN SUCCESS
      // =================================================

      if (formData.role === 'farmer') {

        if (!data?.farmer?.id) {

          setError(
            'Farmer ID was not returned by the server.'
          )

          return
        }


        const farmer = data.farmer
        const farmerId = farmer.id


        // -----------------------------------------------
        // STORE FARMER
        // -----------------------------------------------

        localStorage.setItem(
          'digifarm_farmer',
          JSON.stringify(farmer)
        )


        // -----------------------------------------------
        // COMMON USER STORAGE
        // -----------------------------------------------

        localStorage.setItem(
          'digifarm_user',
          JSON.stringify({
            ...farmer,
            role: 'farmer',
            loggedInAt: new Date().toISOString()
          })
        )


        // -----------------------------------------------
        // SUCCESS
        // -----------------------------------------------

        setShowSuccess(true)


          // -----------------------------------------------
          // REDIRECT
          // -----------------------------------------------

        window.open(`/farmer/${farmerId}/dashboard`, '_blank')

        return
}


// =================================================
// BUYER LOGIN SUCCESS
// =================================================

if (formData.role === 'buyer') {

  if (!data?.buyer?.id) {

    setError(
      'Buyer ID was not returned by the server.'
    )

    return
  }


  const buyer = data.buyer
  const buyerId = buyer.id


  // -----------------------------------------------
  // STORE BUYER
  // -----------------------------------------------

  localStorage.setItem(
    'digifarm_buyer',
    JSON.stringify(buyer)
  )


  // -----------------------------------------------
  // COMMON USER STORAGE
  // -----------------------------------------------

  localStorage.setItem(
    'digifarm_user',
    JSON.stringify({
      ...buyer,
      role: 'buyer',
      loggedInAt: new Date().toISOString()
    })
  )


  // -----------------------------------------------
  // SUCCESS
  // -----------------------------------------------

  setShowSuccess(true)


  // -----------------------------------------------
  // REDIRECT
  // -----------------------------------------------

  window.open(`/buyer/${buyerId}/dashboard`, '_blank')

  return
}

    } catch (error) {

  console.error(
    'LOGIN ERROR:',
    error
  )


  setError(
    error.message ||
    'Unable to login. Please try again.'
  )

} finally {

  setIsLoading(false)

}

  }


// =====================================================
// UI
// =====================================================

return (

  <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white flex items-center justify-center p-4">

    <div className="max-w-md w-full">


      {/* =================================================
            LOGO
        ================================================= */}

      <div className="text-center mb-8">

        <div className="flex justify-center mb-4">

          <DigiFarmLogo size="xl" />

        </div>


        <h1 className="text-2xl font-bold text-[#2d2d2d]">

          Welcome to DigiFarm

        </h1>


        <p className="text-gray-500 text-sm mt-1">

          Sign in to your account

        </p>

      </div>


      {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

      {showSuccess && (

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">

          <CheckCircle
            size={20}
            className="text-green-600 flex-shrink-0"
          />

          <div>

            <p className="text-green-700 font-medium">

              Login successful!

            </p>


            <p className="text-green-600 text-sm">

              Redirecting to your dashboard...

            </p>

          </div>

        </div>

      )}


      {/* =================================================
            FORM
        ================================================= */}

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">

        <form onSubmit={handleSubmit}>


          {/* =================================================
                ROLE
            ================================================= */}

          <div className="mb-6">

            <label className="block text-sm font-medium text-[#2d2d2d] mb-2">

              Continue as

            </label>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">

              {roles.map((role) => {

                const Icon = role.icon

                const isSelected =
                  formData.role === role.id


                return (

                  <button

                    key={role.id}

                    type="button"

                    onClick={() =>
                      handleRoleSelect(role.id)
                    }

                    disabled={isLoading}

                    className={`
                        flex flex-col items-center gap-1
                        p-3 rounded-lg border-2
                        transition-all

                        ${isSelected

                        ? 'border-[#1a4d3e] bg-[#e8f5e9] shadow-sm'

                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }

                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      `}

                  >

                    <div
                      className={`${role.color} text-white p-2 rounded-full`}
                    >

                      <Icon size={16} />

                    </div>


                    <span
                      className={`
                          text-xs font-medium

                          ${isSelected

                          ? 'text-[#1a4d3e]'

                          : 'text-gray-600'
                        }
                        `}
                    >

                      {role.label}

                    </span>

                  </button>

                )

              })}

            </div>

          </div>


          {/* =================================================
                ERROR
            ================================================= */}

          {error && (

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">

              <p className="text-red-600 text-sm">

                {error}

              </p>

            </div>

          )}


          {/* =================================================
                PHONE
            ================================================= */}

          <div className="mb-4">

            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">

              Phone Number

              <span className="text-red-500">
                *
              </span>

            </label>


            <div className="relative">

              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />


              <input

                type="tel"

                value={formData.phone}

                onChange={(e) => {

                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ''
                    )


                  if (value.length <= 10) {

                    setFormData(prev => ({
                      ...prev,
                      phone: value
                    }))

                  }

                }}

                placeholder="Enter 10-digit phone number"

                maxLength={10}

                disabled={
                  isLoading ||
                  showSuccess
                }

                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"

              />

            </div>


            <p className="text-xs text-gray-400 mt-1">

              Enter your registered mobile number

            </p>

          </div>


          {/* =================================================
                PASSWORD
            ================================================= */}

          <div className="mb-6">

            <label className="block text-sm font-medium text-[#2d2d2d] mb-1">

              Password

              <span className="text-red-500">
                *
              </span>

            </label>


            <div className="relative">

              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />


              <input

                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }

                value={formData.password}

                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    password:
                      e.target.value
                  }))
                }

                placeholder="Enter your password"

                disabled={
                  isLoading ||
                  showSuccess
                }

                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a4d3e] transition-all"

              />


              <button

                type="button"

                onClick={() =>
                  setShowPassword(
                    prev => !prev
                  )
                }

                disabled={isLoading}

                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"

              >

                {showPassword

                  ? <EyeOff size={18} />

                  : <Eye size={18} />

                }

              </button>

            </div>

          </div>


          {/* =================================================
                REMEMBER / FORGOT
            ================================================= */}

          <div className="flex items-center justify-between mb-6">

            <label className="flex items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#1a4d3e] focus:ring-[#1a4d3e]"
              />

              Remember me

            </label>


            <button
              type="button"
              className="text-sm text-[#2d7d46] hover:underline"
            >

              Forgot password?

            </button>

          </div>


          {/* =================================================
                SIGN IN BUTTON
            ================================================= */}

          <button

            type="submit"

            disabled={
              isLoading ||
              showSuccess
            }

            className={`
                w-full py-3 rounded-lg
                font-medium transition-all
                duration-200
                flex items-center
                justify-center gap-2

                ${isLoading ||
                showSuccess

                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'

                : 'bg-[#1a4d3e] text-white hover:bg-opacity-90 shadow-lg'
              }
              `}

          >

            {isLoading ? (

              <>

                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>

                Signing in...

              </>

            ) : showSuccess ? (

              <>

                <CheckCircle size={20} />

                Opening Dashboard...

              </>

            ) : (

              <>

                Sign In

                <ArrowRight size={20} />

              </>

            )}

          </button>


          {/* =================================================
                SIGN UP
            ================================================= */}

          <p className="text-center text-sm text-gray-500 mt-6">

            Don't have an account?{' '}

            <Link
              href="/signup"
              className="text-[#2d7d46] font-medium hover:underline"
            >

              Sign up

            </Link>

          </p>

        </form>

      </div>


      {/* =================================================
            TRUST BADGES
        ================================================= */}

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">

        <span className="flex items-center gap-1">

          <CheckCircle
            size={14}
            className="text-[#2d7d46]"
          />

          Secure Login

        </span>


        <span className="flex items-center gap-1">

          <CheckCircle
            size={14}
            className="text-[#2d7d46]"
          />

          SSL Encrypted

        </span>


        <span className="flex items-center gap-1">

          <Leaf
            size={14}
            className="text-[#2d7d46]"
          />

          DigiFarm Trust

        </span>

      </div>


    </div>

  </div>

)
}