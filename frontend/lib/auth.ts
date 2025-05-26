// Fungsi untuk mengelola autentikasi dengan backend

// Tipe untuk data autentikasi
export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    walletAddress?: string
    email?: string
    username?: string
    isAdmin: boolean
  }
}

// URL API backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Login dengan wallet address
export async function loginWithWallet(walletAddress: string, signature: string, nonce: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/web3-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        signature,
        nonce,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login gagal")
    }

    const data = await response.json()
    // Simpan token di localStorage
    localStorage.setItem("auth_token", data.accessToken)
    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Add a function to generate or get a nonce for wallet authentication
export async function getNonce(walletAddress: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/auth/nonce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      // If the backend doesn't have a nonce endpoint, generate a random one
      return Math.floor(Math.random() * 1000000000).toString()
    }

    const data = await response.json()
    return data.nonce
  } catch (error) {
    // Fallback to a random nonce if the endpoint fails
    console.error("Error getting nonce:", error)
    return Math.floor(Math.random() * 1000000000).toString()
  }
}

// Login dengan email dan password
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login gagal")
    }

    const data = await response.json()
    // Simpan token di localStorage
    localStorage.setItem("auth_token", data.accessToken)
    return data
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Register dengan email dan password
export async function registerWithEmail(email: string, password: string, username: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registrasi gagal")
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Logout
export function logout() {
  localStorage.removeItem("auth_token")
  // Tambahkan logika tambahan jika diperlukan
}

// Mendapatkan token autentikasi
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Cek apakah user sudah login
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

// Mendapatkan data user dari token
export async function getCurrentUser(): Promise<AuthResponse["user"] | null> {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      logout()
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}
