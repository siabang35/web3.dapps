import { type NextRequest, NextResponse } from "next/server"

const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"

// POST Handler
export async function POST(
  request: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  const authType = params.nextauth?.[0]

  try {
    if (authType === "web3-login") {
      const { walletAddress, signature, nonce } = await request.json()
      const response = await fetch(`${backendUrl}/auth/web3-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, signature, nonce }),
      })

      const data = await response.json()
      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "Authentication failed" },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    }

    if (authType === "login") {
      const { email, password } = await request.json()
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "Authentication failed" },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    }

    if (authType === "register") {
      const { email, password, username } = await request.json()
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()
      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "Registration failed" },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    }

    if (authType === "nonce") {
      const response = await fetch(`${backendUrl}/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "Failed to get nonce" },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Invalid auth endpoint" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// GET Handler
export async function GET(
  request: NextRequest,
  { params }: { params: { nextauth: string[] } }
) {
  const authType = params.nextauth?.[0]

  if (authType === "profile") {
    try {
      const authHeader = request.headers.get("Authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.split(" ")[1]

      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (!response.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      return NextResponse.json(data)
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: "Invalid auth endpoint" }, { status: 400 })
}
