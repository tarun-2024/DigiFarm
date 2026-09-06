// lib/api/buyerDemands.js

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api'

const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    const errorMessage = data.error || data.message || data.msg || 'Something went wrong'
    throw new Error(errorMessage)
  }
  return data
}

// Get all demands for a buyer
export const getBuyerDemands = async (buyerId) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}/demands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching demands:', error)
    throw error
  }
}

// Create a new demand
export const createDemand = async (buyerId, demandData) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}/demands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demandData),
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Error creating demand:', error)
    throw error
  }
}

// Get a single demand
export const getDemand = async (buyerId, demandId) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}/demands/${demandId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Error fetching demand:', error)
    throw error
  }
}

// Update a demand
export const updateDemand = async (buyerId, demandId, demandData) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}/demands/${demandId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(demandData),
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Error updating demand:', error)
    throw error
  }
}

// Delete/cancel a demand
export const deleteDemand = async (buyerId, demandId) => {
  try {
    const response = await fetch(`${API_URL}/buyers/${buyerId}/demands/${demandId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return handleResponse(response)
  } catch (error) {
    console.error('Error deleting demand:', error)
    throw error
  }
}