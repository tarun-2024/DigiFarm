'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Building2,
  Store,
  Shield,
  CheckCircle
} from 'lucide-react'
import DigiFarmLogo from '@/components/ui/DigiFarmLogo'

const roles = [
  {
    id: 'farmer',
    label: 'Farmer',
    icon: User,
    description: 'Manage your farm, crops, and sales',
    color: 'bg-[#2d7d46]'
  },
  {
    id: 'fpo',
    label: 'FPO',
    icon: Building2,
    description: 'Manage farmer aggregation and bulk sales',
    color: 'bg-blue-600'
  },
  {
    id: 'buyer',
    label: 'Buyer',
    icon: Store,
    description: 'Discover and procure quality produce',
    color: 'bg-purple-600'
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Shield,
    description: 'Manage platform and users',
    color: 'bg-amber-600'
  }
]

export default function LoginPage() {
  const router = useRouter()

  const [selectedRole, setSelectedRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!selectedRole) return

    setIsLoading(true)

    // ================================
    // BUYER
    // ================================

    if (selectedRole === 'buyer') {
      router.push('/buyer/signup')
      return
    }

    // ================================
    // FARMER
    // ================================

    if (selectedRole === 'farmer') {
      router.push('/onboarding/farmer')
      return
    }

    // ================================
    // OTHER ROLES
    // ================================

    await new Promise(resolve =>
      setTimeout(resolve, 1500)
    )

    router.push(`/${selectedRole}/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-white flex items-center justify-center p-4">

      <div className="max-w-4xl w-full">

        {/* Logo + Heading */}
        <div className="text-center mb-10">

          <div className="flex justify-center mb-6">
            <DigiFarmLogo size="xl" />
          </div>

          <h1 className="text-3xl font-bold text-[#2d2d2d]">
            Welcome to DigiFarm
          </h1>

          <p className="text-gray-600 mt-2">
            Choose your role to continue
          </p>

        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {roles.map((role) => {

            const Icon = role.icon

            const isSelected =
              selectedRole === role.id

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  p-6 rounded-xl border-2
                  transition-all duration-200
                  text-left

                  ${
                    isSelected
                      ? 'border-[#1a4d3e] shadow-lg bg-white scale-105'
                      : 'border-gray-200 hover:border-[#1a4d3e] hover:shadow-md bg-white/80'
                  }
                `}
              >

                {/* Icon */}
                <div
                  className={`
                    ${role.color}
                    text-white
                    p-3
                    rounded-lg
                    inline-block
                    mb-3
                  `}
                >
                  <Icon size={24} />
                </div>

                {/* Role name */}
                <h3 className="text-lg font-bold text-[#2d2d2d]">
                  {role.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-1">
                  {role.description}
                </p>

                {/* Selected indicator */}
                {isSelected && (
                  <CheckCircle
                    size={20}
                    className="text-[#2d7d46] mt-2"
                  />
                )}

              </button>
            )
          })}

        </div>

        {/* Continue Button */}
        <button
          onClick={handleLogin}
          disabled={!selectedRole || isLoading}
          className={`
            w-full
            py-4
            rounded-xl
            font-semibold
            text-lg
            transition-all
            duration-200

            ${
              selectedRole && !isLoading
                ? 'bg-[#1a4d3e] text-white hover:bg-opacity-90 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >

          {isLoading ? (

            <span className="flex items-center justify-center gap-2">

              <span
                className="
                  animate-spin
                  rounded-full
                  h-5
                  w-5
                  border-2
                  border-white
                  border-t-transparent
                "
              />

              Authenticating...

            </span>

          ) : (

            'Continue to DigiFarm'

          )}

        </button>

        {/* Terms */}
        <p className="text-center text-sm text-gray-500 mt-6">

          By continuing, you agree to our Terms of Service
          and Privacy Policy

        </p>

      </div>

    </div>
  )
}
