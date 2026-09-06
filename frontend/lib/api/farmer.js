const API_URL = "http://127.0.0.1:5000/api"


export async function createFarmer(farmerData) {

  const response = await fetch(
    `${API_URL}/farmers`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(farmerData),
    }
  )


  let data

  try {
    data = await response.json()
  } catch (error) {
    throw new Error(
      "Invalid response from server"
    )
  }


  // Backend returned an error
  if (!response.ok) {

    throw new Error(
      data.error ||
      "Failed to create farmer"
    )
  }


  return data
}


// ===============================
// Farmer Login
// ===============================

export async function loginFarmer(credentials) {

  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(credentials),
    }
  )


  let data

  try {
    data = await response.json()
  } catch (error) {
    throw new Error(
      "Invalid response from server"
    )
  }


  // Backend returned an error
  if (!response.ok) {

    throw new Error(
      data?.error ||
      "Login failed"
    )
  }


  return data
}

export async function getFarmer(farmerId) {

  const response = await fetch(
    `${API_URL}/farmers/${farmerId}`
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error ||
      "Failed to fetch farmer"
    )
  }

  return data
}