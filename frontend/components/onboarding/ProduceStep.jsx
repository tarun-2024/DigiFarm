import React from 'react'
import { Package, Calendar, Plus, Trash2 } from 'lucide-react'
import { CROPS } from '@/lib/constants/onboarding'

export default function ProduceStep({
  farmer,
  updateCrop,
  addCrop,
  removeCrop,
  errors
}) {
  const getError = (index, field) => {
    return errors?.[`${field}_${index}`]
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#2d2d2d]">
        What are you planning to sell?
      </h2>

      <p className="text-gray-500 mt-1 mb-6">
        Tell us about the produce you want DigiFarm to help you sell.
      </p>

      <div className="space-y-6">

        {farmer.crops?.map((crop, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 relative"
          >

            {/* Remove Crop */}
            {farmer.crops.length > 1 && (
              <button
                type="button"
                onClick={() => removeCrop(index)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove crop"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="space-y-4">

              {/* ================= CROP ================= */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  Crop <span className="text-red-500">*</span>
                </label>

                <select
                  value={crop.crop || ''}
                  onChange={(e) =>
                    updateCrop(index, 'crop', e.target.value)
                  }
                  className={`
                    w-full px-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2
                    transition-all bg-white
                    ${
                      getError(index, 'crop')
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#1a4d3e]'
                    }
                  `}
                >
                  <option value="">Select crop</option>

                  {CROPS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {getError(index, 'crop') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError(index, 'crop')}
                  </p>
                )}
              </div>

              {/* ================= VARIETY ================= */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  Variety
                </label>

                <input
                  type="text"
                  value={crop.variety || ''}
                  onChange={(e) =>
                    updateCrop(index, 'variety', e.target.value)
                  }
                  placeholder="Enter crop variety (optional)"
                  className="
                    w-full px-4 py-3
                    border border-gray-300
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#1a4d3e]
                    transition-all
                  "
                />
              </div>

              {/* ================= QUANTITY ================= */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  Quantity (Quintals) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Package
                    size={18}
                    className="
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={crop.quantity || ''}
                    onChange={(e) =>
                      updateCrop(index, 'quantity', e.target.value)
                    }
                    placeholder="Enter quantity in quintals"
                    className={`
                      w-full pl-10 pr-4 py-3
                      border rounded-lg
                      focus:outline-none
                      focus:ring-2
                      transition-all
                      ${
                        getError(index, 'quantity')
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-[#1a4d3e]'
                      }
                    `}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Example: 50 quintals = 5 tonnes
                </p>

                {getError(index, 'quantity') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError(index, 'quantity')}
                  </p>
                )}
              </div>

              {/* ================= HARVEST DATE ================= */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  Harvest Date <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="date"
                    value={crop.harvestDate || ''}
                    onChange={(e) =>
                      updateCrop(index, 'harvestDate', e.target.value)
                    }
                    className={`
                      w-full pl-10 pr-4 py-3
                      border rounded-lg
                      focus:outline-none
                      focus:ring-2
                      transition-all
                      ${
                        getError(index, 'harvest')
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-[#1a4d3e]'
                      }
                    `}
                  />
                </div>

                {getError(index, 'harvest') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError(index, 'harvest')}
                  </p>
                )}
              </div>

              {/* ================= EXPECTED SELLING DATE ================= */}
              <div>
                <label className="block text-sm font-medium text-[#2d2d2d] mb-1">
                  Expected Selling Date{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Calendar
                    size={18}
                    className="
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
                  />

                  <input
                    type="date"
                    value={crop.expectedSellingDate || ''}
                    onChange={(e) =>
                      updateCrop(
                        index,
                        'expectedSellingDate',
                        e.target.value
                      )
                    }
                    className={`
                      w-full pl-10 pr-4 py-3
                      border rounded-lg
                      focus:outline-none
                      focus:ring-2
                      transition-all
                      ${
                        getError(index, 'selling')
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-[#1a4d3e]'
                      }
                    `}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  When do you expect to sell this produce?
                </p>

                {getError(index, 'selling') && (
                  <p className="text-red-500 text-sm mt-1">
                    {getError(index, 'selling')}
                  </p>
                )}
              </div>

            </div>
          </div>
        ))}

        {/* ================= ADD ANOTHER CROP ================= */}
        <button
          type="button"
          onClick={addCrop}
          className="
            flex items-center gap-2
            text-[#2d7d46]
            hover:text-[#1a4d3e]
            font-medium
            transition-colors
          "
        >
          <Plus size={20} />
          Add Another Crop
        </button>

      </div>
    </div>
  )
}