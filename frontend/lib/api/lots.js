// lib/api/lots.js

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

    throw new Error(
      data?.error ||
      data?.message ||
      data?.msg ||
      `API request failed with status ${response.status}`
    )
  }

  return data
}


// =====================================================
// GET ALL LOTS FOR FARMER
// =====================================================

export const getFarmerLots = async (farmerId) => {

  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  const url =
    `${API_URL}/farmers/${farmerId}/lots`

  try {

    const response = await fetch(url, {
      method: 'GET',

      headers: {
        Accept: 'application/json',
      },

      cache: 'no-store',
    })

    return await handleResponse(response)

  } catch (error) {

    console.error(
      'GET FARMER LOTS ERROR:',
      error
    )

    throw new Error(
      error?.message ||
      'Unable to fetch farmer lots'
    )
  }
}


// =====================================================
// GET SINGLE LOT
// =====================================================

export const getLot = async (
  farmerId,
  lotId
) => {

  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  if (!lotId) {
    throw new Error('Lot ID is required')
  }

  const url =
    `${API_URL}/farmers/${farmerId}/lots/${lotId}`

  try {

    const response = await fetch(url, {
      method: 'GET',

      headers: {
        Accept: 'application/json',
      },

      cache: 'no-store',
    })

    return await handleResponse(response)

  } catch (error) {

    console.error(
      'GET LOT ERROR:',
      error
    )

    throw new Error(
      error?.message ||
      'Unable to fetch lot'
    )
  }
}


// =====================================================
// CREATE LOT
// =====================================================

export const createLot = async (
  farmerId,
  lotData
) => {

  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  if (!lotData) {
    throw new Error('Lot data is required')
  }

  const url =
    `${API_URL}/farmers/${farmerId}/lots`

  try {

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify(lotData),
    })

    return await handleResponse(response)

  } catch (error) {

    console.error(
      'CREATE LOT ERROR:',
      error
    )

    throw new Error(
      error?.message ||
      'Unable to create lot'
    )
  }
}


// =====================================================
// UPDATE LOT
// =====================================================

export const updateLot = async (
  farmerId,
  lotId,
  lotData
) => {

  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  if (!lotId) {
    throw new Error('Lot ID is required')
  }

  if (!lotData) {
    throw new Error('Lot data is required')
  }

  const url =
    `${API_URL}/farmers/${farmerId}/lots/${lotId}`

  try {

    const response = await fetch(url, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify(lotData),
    })

    return await handleResponse(response)

  } catch (error) {

    console.error(
      'UPDATE LOT ERROR:',
      error
    )

    throw new Error(
      error?.message ||
      'Unable to update lot'
    )
  }
}


// =====================================================
// DELETE LOT
// =====================================================

export const deleteLot = async (
  farmerId,
  lotId
) => {

  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  if (!lotId) {
    throw new Error('Lot ID is required')
  }

  const url =
    `${API_URL}/farmers/${farmerId}/lots/${lotId}`

  try {

    const response = await fetch(url, {
      method: 'DELETE',

      headers: {
        Accept: 'application/json',
      },
    })

    return await handleResponse(response)

  } catch (error) {

    console.error(
      'DELETE LOT ERROR:',
      error
    )

    throw new Error(
      error?.message ||
      'Unable to delete lot'
    )
  }
}