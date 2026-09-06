'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'

export default function BuyerLayout({ children }) {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id
  
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const buyerData = localStorage.getItem('digifarm_buyer')
      const userData = localStorage.getItem('digifarm_user')
      
      if (buyerData && userData) {
        const buyer = JSON.parse(buyerData)
        const user = JSON.parse(userData)
        
        if (user.role === 'buyer' && user.id === parseInt(buyerId)) {
          setIsAuthenticated(true)
        } else {
          router.push('/buyer/login')
        }
      } else {
        router.push('/buyer/login')
      }
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/buyer/login')
    } finally {
      setIsLoading(false)
    }
  }, [buyerId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#1a4d3e]">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Sidebar role="buyer" buyerId={buyerId}>
      {children}
    </Sidebar>
  )
}