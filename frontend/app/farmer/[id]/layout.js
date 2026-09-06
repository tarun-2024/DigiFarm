'use client'

import { useParams } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'

export default function FarmerLayout({ children }) {
  const params = useParams()
  const farmerId = params.id

  return (
    <Sidebar
      role="farmer"
      farmerId={farmerId}
    >
      {children}
    </Sidebar>
  )
}