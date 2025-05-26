import { type NextRequest, NextResponse } from "next/server"

// TypeScript interfaces
interface User {
  id: string
  email?: string
  username: string
  walletAddress?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  username: string
}

interface Web3LoginRequest {
  walletAddress: string
  signature: string
  nonce: string
}

interface RefreshTokenRequest {
  refreshToken: string
}

interface NonceResponse {
  nonce: string
}

interface RegisterResponse {
  message: string
  user: User
}

// Helper function to extract auth type from URL
function getAuthType(request: NextRequest): string {
  const url = new URL(request.url)
  const pathSegments = url.pathname.split("/")
  const authIndex = pathSegments.findIndex((segment) => segment === "auth")
  return pathSegments[authIndex + 1] || ""
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Helper function to validate Ethereum address
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Helper function to validate signature
function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature)
}

// Helper function to validate nonce
function isValidNonce(nonce: string): boolean {
  return /^[0-9]+$/.test(nonce)
}

// Helper function to validate username
function isValidUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)
}

// POST handler - explicitly typed to avoid params issue
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const authType = getAuthType(request)
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"

  try {
    switch (authType) {
      case "web3-login": {
        const body: Web3LoginRequest = await request.json()

        // Validate required fields
        if (!body.walletAddress || !body.signature || !body.nonce) {
          return NextResponse.json(
            { error: "Missing required fields: walletAddress, signature, and nonce are required" },
            { status: 400 },
          )
        }

        // Validate formats
        if (!isValidEthereumAddress(body.walletAddress)) {
          return NextResponse.json({ error: "Invalid Ethereum address format" }, { status: 400 })
        }

        if (!isValidSignature(body.signature)) {
          return NextResponse.json({ error: "Invalid signature format" }, { status: 400 })
        }

        if (!isValidNonce(body.nonce)) {
          return NextResponse.json({ error: "Invalid nonce format" }, { status: 400 })
        }

        const response = await fetch(`${backendUrl}/auth/web3-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            walletAddress: body.walletAddress,
            signature: body.signature,
            nonce: body.nonce,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Web3 authentication failed" },
            { status: response.status },
          )
        }

        return NextResponse.json(data as AuthResponse, { status: 200 })
      }

      case "login": {
        const body: LoginRequest = await request.json()

        // Validate required fields
        if (!body.email || !body.password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        // Validate email format
        if (!isValidEmail(body.email)) {
          return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
        }

        // Validate password length
        if (body.password.length < 6) {
          return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
        }

        const response = await fetch(`${backendUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: body.email,
            password: body.password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Authentication failed" },
            { status: response.status },
          )
        }

        return NextResponse.json(data as AuthResponse, { status: 200 })
      }

      case "register": {
        const body: RegisterRequest = await request.json()

        // Validate required fields
        if (!body.email || !body.password || !body.username) {
          return NextResponse.json({ error: "Email, password, and username are required" }, { status: 400 })
        }

        // Validate email format
        if (!isValidEmail(body.email)) {
          return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 })
        }

        // Validate password length
        if (body.password.length < 6 || body.password.length > 50) {
          return NextResponse.json({ error: "Password must be between 6 and 50 characters long" }, { status: 400 })
        }

        // Validate username
        if (!isValidUsername(body.username)) {
          return NextResponse.json(
            { error: "Username must be 3-20 characters and contain only letters, numbers, and underscores" },
            { status: 400 },
          )
        }

        const response = await fetch(`${backendUrl}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: body.email,
            password: body.password,
            username: body.username,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Registration failed" },
            { status: response.status },
          )
        }

        return NextResponse.json(data as RegisterResponse, { status: 201 })
      }

      case "nonce": {
        const response = await fetch(`${backendUrl}/auth/nonce`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Failed to generate nonce" },
            { status: response.status },
          )
        }

        return NextResponse.json(data as NonceResponse, { status: 200 })
      }

      case "refresh-token": {
        const body: RefreshTokenRequest = await request.json()

        // Validate required fields
        if (!body.refreshToken) {
          return NextResponse.json({ error: "Refresh token is required" }, { status: 400 })
        }

        // Validate refresh token format
        if (typeof body.refreshToken !== "string" || body.refreshToken.trim().length === 0) {
          return NextResponse.json({ error: "Invalid refresh token format" }, { status: 400 })
        }

        const response = await fetch(`${backendUrl}/auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: body.refreshToken,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Failed to refresh token" },
            { status: response.status },
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      default:
        return NextResponse.json({ error: "Invalid auth endpoint" }, { status: 400 })
    }
  } catch (error: any) {
    console.error(`Auth ${authType} error:`, error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// GET handler - explicitly typed to avoid params issue
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const authType = getAuthType(request)
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"

  try {
    switch (authType) {
      case "profile": {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
        }

        const token = authHeader.split(" ")[1]

        if (!token) {
          return NextResponse.json({ error: "Invalid authorization token" }, { status: 401 })
        }

        const response = await fetch(`${backendUrl}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.message || data.error || "Failed to fetch profile" },
            { status: response.status },
          )
        }

        return NextResponse.json(data as User, { status: 200 })
      }

      default:
        return NextResponse.json({ error: "Invalid auth endpoint for GET method" }, { status: 400 })
    }
  } catch (error: any) {
    console.error(`Auth GET ${authType} error:`, error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
