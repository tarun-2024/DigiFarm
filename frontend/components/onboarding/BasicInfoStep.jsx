'use client'

import React, { useState } from 'react'
import {
  User,
  Phone,
  MapPin,
  Languages,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

import {
  STATES,
  DISTRICTS_BY_STATE,
  LANGUAGES
} from '@/lib/constants/onboarding'


export default function BasicInfoStep({
  farmer,
  updateFarmer,
  errors
}) {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const getDistricts = () => {
    return DISTRICTS_BY_STATE[farmer.state] || []
  }


  return (
    <div>

      {/* =========================================
          HEADING
      ========================================= */}

      <h2 className="text-2xl font-bold text-[#2d2d2d]">
        Tell us about yourself
      </h2>

      <p className="text-gray-500 mt-1 mb-6">
        This helps DigiFarm provide market information relevant to your location and language.
      </p>


      <div className="space-y-5">


        {/* =========================================
            FULL NAME
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={farmer.name || ''}
              onChange={(e) =>
                updateFarmer(
                  'name',
                  e.target.value
                )
              }
              placeholder="Enter your full name"
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition-all
                ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1a4d3e]'
                }
              `}
            />

          </div>

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}

        </div>


        {/* =========================================
            MOBILE NUMBER
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <div className="relative">

            <Phone
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="tel"
              inputMode="numeric"
              value={farmer.mobile || ''}
              onChange={(e) => {

                const value =
                  e.target.value.replace(
                    /\D/g,
                    ''
                  )

                updateFarmer(
                  'mobile',
                  value
                )
              }}
              placeholder="Enter your 10-digit mobile number"
              maxLength={10}
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition-all
                ${
                  errors.mobile
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1a4d3e]'
                }
              `}
            />

          </div>

          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">
              {errors.mobile}
            </p>
          )}

        </div>


        {/* =========================================
            CREATE PASSWORD
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Create Password <span className="text-red-500">*</span>
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
              value={farmer.password || ''}
              onChange={(e) =>
                updateFarmer(
                  'password',
                  e.target.value
                )
              }
              placeholder="Create a password"
              className={`
                w-full pl-10 pr-12 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition-all
                ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1a4d3e]'
                }
              `}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  prev => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a4d3e] transition-colors"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >

              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters.
            </p>
          )}

        </div>


        {/* =========================================
            CONFIRM PASSWORD
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={
                showConfirmPassword
                  ? 'text'
                  : 'password'
              }
              value={
                farmer.confirmPassword || ''
              }
              onChange={(e) =>
                updateFarmer(
                  'confirmPassword',
                  e.target.value
                )
              }
              placeholder="Re-enter your password"
              className={`
                w-full pl-10 pr-12 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition-all
                ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1a4d3e]'
                }
              `}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  prev => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a4d3e] transition-colors"
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
              }
            >

              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}

        </div>


        {/* =========================================
            STATE
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            State <span className="text-red-500">*</span>
          </label>

          <select
            value={farmer.state || ''}
            onChange={(e) => {

              updateFarmer(
                'state',
                e.target.value
              )

              updateFarmer(
                'district',
                ''
              )

            }}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:outline-none focus:ring-2
              transition-all bg-white
              ${
                errors.state
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#1a4d3e]'
              }
            `}
          >

            <option value="">
              Select your state
            </option>

            {STATES.map(state => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}

          </select>

          {errors.state && (
            <p className="text-red-500 text-sm mt-1">
              {errors.state}
            </p>
          )}

        </div>


        {/* =========================================
            DISTRICT
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            District <span className="text-red-500">*</span>
          </label>

          <select
            value={farmer.district || ''}
            onChange={(e) =>
              updateFarmer(
                'district',
                e.target.value
              )
            }
            disabled={!farmer.state}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:outline-none focus:ring-2
              transition-all bg-white

              ${
                !farmer.state
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }

              ${
                errors.district
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#1a4d3e]'
              }
            `}
          >

            <option value="">
              Select your district
            </option>

            {getDistricts().map(
              district => (
                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>
              )
            )}

          </select>

          {errors.district && (
            <p className="text-red-500 text-sm mt-1">
              {errors.district}
            </p>
          )}

        </div>


        {/* =========================================
            VILLAGE
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
            Village / Location{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="relative">

            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={farmer.village || ''}
              onChange={(e) =>
                updateFarmer(
                  'village',
                  e.target.value
                )
              }
              placeholder="Enter village or locality"
              className={`
                w-full pl-10 pr-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 transition-all
                ${
                  errors.village
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#1a4d3e]'
                }
              `}
            />

          </div>

          {errors.village && (
            <p className="text-red-500 text-sm mt-1">
              {errors.village}
            </p>
          )}

        </div>


        {/* =========================================
            PREFERRED LANGUAGE
        ========================================= */}

        <div>

          <label className="block text-sm font-medium text-[#2d2d2d] mb-2">
            Preferred Language{' '}
            <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-3">

            {LANGUAGES.map(lang => (

              <button
                key={lang.value}
                type="button"
                onClick={() =>
                  updateFarmer(
                    'language',
                    lang.value
                  )
                }
                className={`
                  flex items-center justify-center
                  gap-2 px-4 py-3 border-2
                  rounded-lg transition-all

                  ${
                    farmer.language ===
                    lang.value
                      ? 'border-[#1a4d3e] bg-[#e8f5e9] text-[#1a4d3e]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }
                `}
              >

                <Languages size={18} />

                <span>
                  {lang.label}
                </span>

              </button>

            ))}

          </div>

          {errors.language && (
            <p className="text-red-500 text-sm mt-2">
              {errors.language}
            </p>
          )}

        </div>

      </div>

    </div>
  )
}