// lib/api/buyer.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (!response.ok) {
    // Extract error message from various response formats
    const errorMessage = data.error || data.message || data.msg || 'Something went wrong'
    throw new Error(errorMessage)
  }
  
  return data
}

// Create a new buyer (Signup)
export const createBuyer = async (buyerData) => {
  try {
    const response = await fetch(`${API_URL}/buyers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buyerData),
    })
    
    return await handleResponse(response)
  } catch (error) {
    console.error('Error creating buyer:', error)
    throw error
  }
}

// Login buyer
export const loginBuyer = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/buyer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    return await handleResponse(response)
  } catch (error) {
    console.error('Error logging in buyer:', error)
    throw error
  }
}

// Get buyer details
export const getBuyer = async (buyerId) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    return await handleResponse(response)
  } catch (error) {
    console.error('Error fetching buyer:', error)
    throw error
  }
}