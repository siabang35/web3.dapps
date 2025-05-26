"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useAccount } from "wagmi"
import {
  loginWithWallet,
  loginWithEmail,
  logout as logoutAuth,
  getCurrentUser,
  isAuthenticated,
  getNonce,
  registerWithEmail,
} from "@/lib/auth"

interface User {
  id: string
  walletAddress?: string
  email?: string
  username?: string
  isAdmin: boolean
}

// Update the AuthContextType interface to include registerUser function
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  loginWithEmail: (email: string, password: string) => Promise<void>
  loginWithWalletConnect: (signature: string, nonce: string) => Promise<void>
  registerUser: (email: string, password: string, username: string) => Promise<void>
  getNonceForWallet: (walletAddress: string) => Promise<string>
  logout: () => void
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  // Cek status autentikasi saat komponen dimuat
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login dengan email dan password
  const handleLoginWithEmail = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await loginWithEmail(email, password)
      setUser(response.user)
    } catch (err: any) {
      setError(err.message || "Login gagal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register dengan email, password, dan username
  const handleRegisterUser = async (email: string, password: string, username: string) => {
    setLoading(true)
    setError(null)
    try {
      await registerWithEmail(email, password, username)
    } catch (err: any) {
      setError(err.message || "Registrasi gagal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login dengan wallet
  const handleLoginWithWalletConnect = async (signature: string, nonce: string) => {
    if (!address) {
      setError("Wallet tidak terhubung")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await loginWithWallet(address, signature, nonce)
      setUser(response.user)
    } catch (err: any) {
      setError(err.message || "Login gagal")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Add a function to get nonce for wallet
  const handleGetNonceForWallet = async (walletAddress: string) => {
    try {
      return await getNonce(walletAddress)
    } catch (err) {
      console.error("Error getting nonce:", err)
      return Math.floor(Math.random() * 1000000000).toString()
    }
  }

  // Logout
  const handleLogout = () => {
    logoutAuth()
    setUser(null)
  }

  // Update the AuthContext.Provider value to include the new function
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithEmail: handleLoginWithEmail,
        loginWithWalletConnect: handleLoginWithWalletConnect,
        registerUser: handleRegisterUser,
        getNonceForWallet: handleGetNonceForWallet,
        logout: handleLogout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
