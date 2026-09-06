import React from 'react'
import { CheckCircle } from 'lucide-react'

const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Farm Details' },
  { number: 3, label: 'Produce' },
  { number: 4, label: 'Selling Preferences' }
]

export default function ProgressSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number
        const isCompleted = currentStep > step.number
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300
                  ${isActive ? 'bg-[#1a4d3e] text-white scale-110 shadow-lg' : ''}
                  ${isCompleted ? 'bg-[#2d7d46] text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <CheckCircle size={20} /> : step.number}
              </div>
              <span
                className={`
                  text-xs mt-2 font-medium transition-colors hidden sm:block
                  ${isActive ? 'text-[#1a4d3e]' : ''}
                  ${isCompleted ? 'text-[#2d7d46]' : ''}
                  ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div
                  className={`
                    absolute inset-0 transition-all duration-500
                    ${currentStep > step.number ? 'bg-[#2d7d46]' : 'bg-gray-200'}
                  `}
                  style={{
                    width: currentStep > step.number ? '100%' : '0%'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}