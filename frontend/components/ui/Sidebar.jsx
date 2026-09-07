'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getFarmer } from '@/lib/api/farmer'
import { getBuyer } from '@/lib/api/buyer'
import {
  LayoutDashboard,
  TrendingUp,
  LineChart,
  Calendar,
  Users,
  Handshake,
  Package,
  Award,
  FileText,
  Truck,
  Warehouse,
  CreditCard,
  AlertCircle,
  Bell,
  User,
  Menu,
  X,
  Building2,
  ShoppingBag,
  FileCheck,
  BarChart3,
  Shield,
  Database,
  Scale,
  Store
} from 'lucide-react'

import DigiFarmLogo from './DigiFarmLogo'


// =====================================================
// ROLE MENUS
// =====================================================

const roleMenus = {

  // =====================================================
  // FARMER
  // =====================================================

  farmer: [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: 'dashboard'
    },
    {
      name: 'Market Intelligence',
      icon: TrendingUp,
      path: 'market'
    },
    {
      name: 'Price Forecast',
      icon: LineChart,
      path: 'forecast'
    },
    {
      name: 'Sale Window',
      icon: Calendar,
      path: 'sale-window'
    },
    {
      name: 'Find Buyers',
      icon: Users,
      path: 'buyers'
    },
    {
      name: 'AI Matches',
      icon: Handshake,
      path: 'matches'
    },
    {
      name: 'My Lots',
      icon: Package,
      path: 'lots'
    },
    {
      name: 'Quality',
      icon: Award,
      path: 'quality'
    },
    {
      name: 'Offers',
      icon: FileText,
      path: 'offers'
    },
    {
      name: 'Logistics',
      icon: Truck,
      path: 'logistics'
    },
    {
      name: 'Storage',
      icon: Warehouse,
      path: 'storage'
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      path: 'transactions'
    },
    {
      name: 'Payments',
      icon: CreditCard,
      path: 'payments'
    },
    {
      name: 'Disputes',
      icon: AlertCircle,
      path: 'disputes'
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: 'notifications'
    },
    {
      name: 'Profile',
      icon: User,
      path: 'profile'
    }
  ],


  // =====================================================
  // FPO
  // =====================================================

  fpo: [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/fpo/dashboard'
    },
    {
      name: 'Farmers',
      icon: Users,
      path: '/fpo/farmers'
    },
    {
      name: 'Aggregation',
      icon: Scale,
      path: '/fpo/aggregation'
    },
    {
      name: 'Market Intelligence',
      icon: TrendingUp,
      path: '/fpo/market'
    },
    {
      name: 'Buyer Demand',
      icon: Store,
      path: '/fpo/buyers'
    },
    {
      name: 'Lots',
      icon: Package,
      path: '/fpo/lots'
    },
    {
      name: 'Offers',
      icon: FileText,
      path: '/fpo/offers'
    },
    {
      name: 'Logistics',
      icon: Truck,
      path: '/fpo/logistics'
    },
    {
      name: 'Storage',
      icon: Warehouse,
      path: '/fpo/storage'
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      path: '/fpo/transactions'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/fpo/analytics'
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '/fpo/notifications'
    },
    {
      name: 'Profile',
      icon: User,
      path: '/fpo/profile'
    }
  ],


  // =====================================================
  // BUYER
  // =====================================================

  buyer: [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: 'dashboard'
    },
    {
      name: 'Market Demand',
      icon: TrendingUp,
      path: 'demands'
    },
    {
      name: 'Post Demand',
      icon: FileCheck,
      path: 'demand/create'
    },
    {
      name: 'Browse Lots',
      icon: Package,
      path: 'lots'
    },
    {
      name: 'AI Matches',
      icon: Handshake,
      path: 'matches'
    },
    {
      name: 'Offers',
      icon: FileText,
      path: 'offers'
    },
    {
      name: 'Orders',
      icon: ShoppingBag,
      path: 'orders'
    },
    {
      name: 'Logistics',
      icon: Truck,
      path: 'logistics'
    },
    {
      name: 'Payments',
      icon: CreditCard,
      path: 'payments'
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      path: 'transactions'
    },
    {
      name: 'Suppliers',
      icon: Building2,
      path: 'suppliers'
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: 'notifications'
    },
    {
      name: 'Profile',
      icon: User,
      path: 'profile'
    }
  ],


  // =====================================================
  // ADMIN
  // =====================================================

  admin: [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard'
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users'
    },
    {
      name: 'Farmers',
      icon: User,
      path: '/admin/farmers'
    },
    {
      name: 'FPOs',
      icon: Building2,
      path: '/admin/fpos'
    },
    {
      name: 'Buyers',
      icon: Store,
      path: '/admin/buyers'
    },
    {
      name: 'Verification',
      icon: Shield,
      path: '/admin/verification'
    },
    {
      name: 'Lots',
      icon: Package,
      path: '/admin/lots'
    },
    {
      name: 'Market Data',
      icon: Database,
      path: '/admin/market-data'
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      path: '/admin/transactions'
    },
    {
      name: 'Disputes',
      icon: AlertCircle,
      path: '/admin/disputes'
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics'
    }
  ]
}


// =====================================================
// SIDEBAR
// =====================================================

export default function Sidebar({
  role = 'farmer',
  farmerId,
  buyerId,
  children
}) {

  const pathname = usePathname()

  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(null)


  // =====================================================
  // LOAD USER AFTER COMPONENT MOUNTS
  // =====================================================

 useEffect(() => {

  const loadLatestUser = async () => {

    try {

      // ==========================================
      // FARMER
      // ==========================================

      if (role === 'farmer' && farmerId) {

        const response = await getFarmer(farmerId)

        if (response?.farmer) {

          const latestFarmer = response.farmer

          setUser(latestFarmer)

          localStorage.setItem(
            'digifarm_user',
            JSON.stringify(latestFarmer)
          )

          localStorage.setItem(
            'digifarm_farmer',
            JSON.stringify(latestFarmer)
          )

          return
        }
      }


      // ==========================================
      // BUYER
      // ==========================================

      if (role === 'buyer' && buyerId) {

        const response = await getBuyer(buyerId)

        if (response?.buyer) {

          const latestBuyer = response.buyer

          setUser(latestBuyer)

          localStorage.setItem(
            'digifarm_user',
            JSON.stringify(latestBuyer)
          )

          localStorage.setItem(
            'digifarm_buyer',
            JSON.stringify(latestBuyer)
          )

          return
        }
      }


      // ==========================================
      // FPO / ADMIN / FALLBACK
      // ==========================================

      const storedUser =
        localStorage.getItem('digifarm_user')

      if (storedUser) {

        const parsedUser =
          JSON.parse(storedUser)

        setUser(parsedUser)
      }

    } catch (error) {

      console.error(
        'Error loading latest user:',
        error
      )

      // Fallback to localStorage
      try {

        const storedUser =
          localStorage.getItem('digifarm_user')

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

      } catch (storageError) {

        console.error(
          'Error reading stored user:',
          storageError
        )

      }
    }

  }

  loadLatestUser()

}, [role, farmerId, buyerId, pathname])


  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems =
    roleMenus[role] || roleMenus.farmer


  // =====================================================
  // CREATE LINK
  // =====================================================

  const getPath = (item) => {

    // -----------------------------------------------------
    // FARMER
    // -----------------------------------------------------

    if (role === 'farmer') {

      if (!farmerId) {
        return '#'
      }

      return `/farmer/${farmerId}/${item.path}`
    }


    // -----------------------------------------------------
    // BUYER
    // -----------------------------------------------------

    if (role === 'buyer') {

      if (!buyerId) {
        return '#'
      }

      return `/buyer/${buyerId}/${item.path}`
    }


    // -----------------------------------------------------
    // FPO / ADMIN
    // -----------------------------------------------------

    return item.path
  }


  // =====================================================
  // USER DISPLAY
  // =====================================================

  const defaultName =
    role === 'buyer'
      ? 'Buyer'
      : role === 'fpo'
        ? 'FPO'
        : role === 'admin'
          ? 'Admin'
          : 'Farmer'

  const userName =
    user?.name || defaultName

  const userInitial =
    userName.charAt(0).toUpperCase()


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>

      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          setIsMobileOpen(!isMobileOpen)
        }
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-50
          p-2
          bg-white
          rounded-lg
          shadow-lg
        "
      >

        {isMobileOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}

      </button>


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-40
          h-screen
          w-64
          bg-white
          border-r
          border-gray-200

          transform
          transition-transform
          duration-300
          ease-in-out

          ${
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:translate-x-0
        `}
      >

        <div className="flex flex-col h-full">


          {/* =================================================
              LOGO
          ================================================= */}

          <div
            className="
              p-6
              border-b
              border-gray-200
            "
          >

            <DigiFarmLogo />

          </div>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav
            className="
              flex-1
              overflow-y-auto
              p-4
              space-y-1
            "
          >

            {menuItems.map((item) => {

              const Icon = item.icon

              const href =
                getPath(item)


              // -------------------------------------------------
              // ACTIVE PAGE
              // -------------------------------------------------

              const isActive =
                href !== '#' &&
                (
                  pathname === href ||
                  pathname.startsWith(`${href}/`)
                )


              return (

                <Link
                  key={item.name}
                  href={href}
                  onClick={() =>
                    setIsMobileOpen(false)
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-lg
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-[#1a4d3e]
                          text-white
                          shadow-md
                        `
                        : `
                          text-gray-600
                          hover:bg-[#e8f5e9]
                          hover:text-[#1a4d3e]
                        `
                    }
                  `}
                >

                  <Icon size={20} />

                  <span
                    className="
                      font-medium
                      text-sm
                    "
                  >
                    {item.name}
                  </span>

                </Link>

              )

            })}

          </nav>


          {/* =================================================
              USER
          ================================================= */}

          <div
            className="
              p-4
              border-t
              border-gray-200
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-2
                bg-[#e8f5e9]
                rounded-lg
              "
            >

              {/* AVATAR */}

              <div
                className="
                  w-8
                  h-8
                  bg-[#1a4d3e]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                "
              >

                {userInitial}

              </div>


              {/* NAME */}

              <div className="min-w-0">

                <p
                  className="
                    text-sm
                    font-medium
                    text-[#1a4d3e]
                    truncate
                  "
                >
                  {userName}
                </p>

                <p
                  className="
                    text-xs
                    text-gray-500
                    capitalize
                  "
                >
                  {role}
                </p>

              </div>

            </div>

          </div>


        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="
          min-h-screen
          lg:ml-64
        "
      >

        {children}

      </main>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {isMobileOpen && (

        <div
          className="
            fixed
            inset-0
            bg-black
            bg-opacity-50
            z-30
            lg:hidden
          "
          onClick={() =>
            setIsMobileOpen(false)
          }
        />

      )}

    </>
  )
}
