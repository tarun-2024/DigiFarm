// lib/api/buyer.js

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api'


// =====================================================
// HANDLE API RESPONSE
// =====================================================

const handleResponse = async (response) => {

  const data =
    await response.json().catch(() => null)

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


// =====================================================
// CREATE A NEW BUYER
// =====================================================

export const createBuyer = async (buyerData) => {

  const response = await fetch(
    `${API_URL}/buyers`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(buyerData),
    }
  )

  return await handleResponse(response)
}


// =====================================================
// LOGIN BUYER
// =====================================================

export const loginBuyer = async (credentials) => {

  const response = await fetch(
    `${API_URL}/buyer/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(credentials),
    }
  )

  return await handleResponse(response)
}


// =====================================================
// GET BUYER DETAILS
// =====================================================

export const getBuyer = async (buyerId) => {

  const response = await fetch(
    `${API_URL}/buyers/${buyerId}`,
    {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
      },

      cache: 'no-store',
    }
  )

  return await handleResponse(response)
}
// =====================================================
// UPDATE BUYER
// =====================================================

// =====================================================
// UPDATE BUYER
// =====================================================

export async function updateBuyer(buyerId, buyerData) {
  if (!buyerId) {
    throw new Error('Buyer ID is required')
  }

  const url = `${API_URL}/buyers/${buyerId}`

  console.log('======================================')
  console.log('UPDATE BUYER URL:', url)
  console.log('UPDATE BUYER DATA:', buyerData)

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(buyerData),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    console.log('UPDATE BUYER STATUS:', response.status)
    console.log('UPDATE BUYER RESPONSE:', data)
    console.log('======================================')

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        data?.details ||
        `Failed to update buyer (${response.status})`
      )
    }

    return data

  } catch (error) {
    console.error(
      'UPDATE BUYER ERROR:',
      error
    )

    throw error
  }
}