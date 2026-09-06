import React from 'react'

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'forest',
  subtitle 
}) {
  const colors = {
    forest: 'bg-[#1a4d3e] text-white',
    'agri-green': 'bg-[#2d7d46] text-white',
    cream: 'bg-[#fdf8f0] text-[#1a4d3e]',
    amber: 'bg-amber-500 text-white',
    white: 'bg-white text-[#2d2d2d] border border-gray-200'
  }

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-[#2d2d2d] mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color] || colors.forest}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-xs text-gray-400">vs last week</span>
        </div>
      )}
    </div>
  )
}