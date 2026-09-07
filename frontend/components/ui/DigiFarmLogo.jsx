import React from 'react'
import Image from 'next/image'

export default function DigiFarmLogo({ className = '', size = 'md' }) {

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  }

  const imageSizes = {
    sm: 42,
    md: 52,
    lg: 68,
    xl: 84
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>

      {/* DigiFarm Icon */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: imageSizes[size],
          height: imageSizes[size]
        }}
      >

        <div className="absolute inset-0 bg-[#1a4d3e] rounded-full opacity-10 animate-pulse"></div>

        <Image
          src="/digifarm-icon.png"
          alt="DigiFarm"
          fill
          className="object-cover rounded-full"
        />

      </div>


      {/* Logo Text */}
      <div>

        <span className={`font-bold ${sizes[size]} text-[#1a4d3e]`}>
          Digi<span className="text-[#2d7d46]">FARM</span>
        </span>

        <p className="text-xs text-gray-500 -mt-1">
          From Farm to Better Markets
        </p>

      </div>

    </div>
  )
}