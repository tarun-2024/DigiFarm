const API_URL = "http://127.0.0.1:5000/api"


// =====================================================
// CREATE FARMER / FARMER SIGNUP
// =====================================================


export async function createFarmer(farmerData) {
  try {
    console.log("CREATING FARMER:", farmerData)

    const response = await fetch(`${API_URL}/farmers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(farmerData),
    })

    const text = await response.text()

    let data = {}

    try {
      data = JSON.parse(text)
    } catch (error) {
      console.error("SERVER RETURNED NON-JSON:", text)

      throw new Error(
        `Server returned invalid response (${response.status})`
      )
    }

    console.log("FARMER RESPONSE STATUS:", response.status)
    console.log("FARMER RESPONSE:", data)

    // ==========================================
    // DUPLICATE MOBILE NUMBER
    // ==========================================

    const message = String(
      data?.message ||
      data?.error ||
      data?.details ||
      ""
    ).toLowerCase()

    if (
      message.includes("mobile number already exists") ||
      message.includes("mobile already exists") ||
      message.includes("already registered")
    ) {
      return {
        success: false,
        duplicate: true,
        message:
          data?.message ||
          "Mobile number already exists",
      }
    }

    // ==========================================
    // OTHER BACKEND ERRORS
    // ==========================================

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        data?.details ||
        `Failed to create farmer (${response.status})`
      )
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return data

  } catch (error) {
    console.error("CREATE FARMER ERROR:", error)
    throw error
  }
}


// =====================================================
// FARMER LOGIN
// =====================================================

export async function loginFarmer(credentials) {

  try {

    const response = await fetch(
      `${API_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        body: JSON.stringify(credentials),
      }
    )


    // Read response only ONCE
    const data = await response.json().catch(() => ({}))


    console.log("LOGIN RESPONSE STATUS:", response.status)
    console.log("LOGIN RESPONSE:", data)


    // Backend returned an error
    if (!response.ok) {

      throw new Error(
        data?.message ||
        data?.error ||
        data?.details ||
        `Login failed (${response.status})`
      )
    }


    return data

  } catch (error) {

    console.error(
      "LOGIN FARMER ERROR:",
      error
    )

    throw error
  }
}



// =====================================================
// GET FARMER
// =====================================================
export const getFarmer = async (farmerId) => {
  if (!farmerId) {
    throw new Error('Farmer ID is required')
  }

  const url = `${API_URL}/farmers/${farmerId}`

  console.log('=================================')
  console.log('GET FARMER URL:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json().catch(() => null)

    console.log('GET FARMER STATUS:', response.status)
    console.log('GET FARMER RESPONSE:', data)
    console.log('=================================')

    if (!response.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        data?.details ||
        `Failed to fetch farmer profile (${response.status})`
      )
    }

    return data

  } catch (error) {
    console.error('GET FARMER ERROR:', error)
    throw error
  }
}
// =====================================================
// UPDATE FARMER
// =====================================================

export async function updateFarmer(
  farmerId,
  farmerData
) {

  const response = await fetch(
    `${API_URL}/farmers/${farmerId}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(farmerData),
    }
  )

  const data =
    await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      data?.msg ||
      'Failed to update farmer'
    )
  }

  return data
}