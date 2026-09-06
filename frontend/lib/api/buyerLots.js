// lib/api/buyerLots.js

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api'

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMessage =
      data?.error ||
      data?.message ||
      data?.msg ||
      'Something went wrong'

    throw new Error(errorMessage)
  }

  return data
}

// Get all available lots
export const getAvailableLots = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key])
      }
    })

    const url =
      `${API_URL}/lots` +
      `${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching lots:', error)
    throw error
  }
}

// Get a single lot
export const getLot = async (lotId) => {
  try {
    const response = await fetch(
      `${API_URL}/lots/${lotId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching lot:', error)
    throw error
  }
}

// Get matched lots for a buyer
export const getMatchedLots = async (buyerId) => {
  try {
    const response = await fetch(
      `${API_URL}/buyers/${buyerId}/matches`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching matched lots:', error)
    throw error
  }
}