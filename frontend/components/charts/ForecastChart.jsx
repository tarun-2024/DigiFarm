import React from 'react'
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

export default function ForecastChart({ historicalData, forecastData }) {
  const allData = [...historicalData, ...forecastData]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={allData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#888888"
          fontSize={12}
        />
        <YAxis 
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip 
          formatter={(value) => [`₹${value}`, 'Price']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        
        <Area
          type="monotone"
          dataKey="price"
          stroke="#2d7d46"
          fill="#e8f5e9"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
          connectNulls={true}
        />
        
        <Line
          type="monotone"
          dataKey="price"
          stroke="#ff6b6b"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          activeDot={{ r: 6 }}
          connectNulls={true}
        />
        
        <ReferenceLine
          x={historicalData[historicalData.length - 1]?.date}
          stroke="#ff6b6b"
          strokeDasharray="3 3"
          label={{ 
            value: 'Forecast Start', 
            position: 'top',
            fill: '#ff6b6b',
            fontSize: 12
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}