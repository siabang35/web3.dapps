import { type NextRequest, NextResponse } from "next/server"

// Fungsi untuk menangani login dengan wallet
export async function POST(request: NextRequest, { params }: { params: { nextauth: string[] } }) {
  const authType = params.nextauth[0]

  if (authType === "web3-login") {
    try {
      const { walletAddress, signature, nonce } = await request.json()

      // Kirim data ke backend NestJS
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/auth/web3-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature, nonce }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ error: error.message || "Authentication failed" }, { status: response.status })
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
  } else if (authType === "login") {
    try {
      const { email, password } = await request.json()

      // Kirim data ke backend NestJS
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ error: error.message || "Authentication failed" }, { status: response.status })
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
  } else if (authType === "register") {
    try {
      const { email, password, username } = await request.json()

      // Kirim data ke backend NestJS
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ error: error.message || "Registration failed" }, { status: response.status })
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
  } else if (authType === "profile") {
    try {
      const authHeader = request.headers.get("Authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.split(" ")[1]

      // Kirim data ke backend NestJS
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
  } else if (authType === "nonce") {
    try {
      // Kirim data ke backend NestJS
      const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/auth/nonce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        return NextResponse.json({ error: error.message || "Failed to get nonce" }, { status: response.status })
      }

      const data = await response.json()
      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
  }

  return NextResponse.json({ error: "Invalid auth endpoint" }, { status: 400 })
}
