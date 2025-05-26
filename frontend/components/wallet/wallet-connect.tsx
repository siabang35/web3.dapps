"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "@/components/ui/avatar"
import { Wallet, LogOut, CreditCard, Coins, ChevronRight, Mail, UserPlus } from "lucide-react"
import { truncateAddress } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnect({ open, onOpenChange }: WalletConnectProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const { toast } = useToast()
  const { user, loginWithWalletConnect, loginWithEmail, logout, isLoggedIn, getNonceForWallet, registerUser } =
    useAuth()

  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("connect")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form state
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerUsername, setRegisterUsername] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [nonce, setNonce] = useState<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      if (isLoggedIn) {
        setActiveTab("account")
      } else if (isConnected) {
        setActiveTab("web3login")
        // Get nonce when wallet is connected and tab is opened
        if (address) {
          getNonceForWallet(address).then(setNonce)
        }
      } else {
        setActiveTab("connect")
      }
    }
  }, [open, isConnected, isLoggedIn, address, getNonceForWallet])

  if (!mounted) return null

  const walletOptions = [
    { id: "metamask", name: "MetaMask", icon: "🦊" },
    { id: "coinbase", name: "Coinbase Wallet", icon: "🔵" },
    { id: "walletconnect", name: "WalletConnect", icon: "🔗" },
    { id: "ledger", name: "Ledger", icon: "🔒" },
  ]

  const handleConnect = async () => {
    if (typeof window !== "undefined" && (window as any).web3modal) {
      try {
        await (window as any).web3modal.open()
      } catch (e) {
        console.error("Wallet connection cancelled")
      }
    } else {
      console.warn("Web3Modal not available")
    }
  }

  const handleWalletLogin = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Get nonce if not already set
      let currentNonce = nonce
      if (!currentNonce && address) {
        currentNonce = await getNonceForWallet(address)
        setNonce(currentNonce)
      }

      // Pesan untuk ditandatangani (include nonce for security)
      const message = `Login to DApp with wallet: ${address}\nNonce: ${currentNonce}`

      // Minta pengguna untuk menandatangani pesan
      const signature = await signMessageAsync({ message })

      // Kirim signature dan nonce ke backend untuk verifikasi dan login
      await loginWithWalletConnect(signature, currentNonce)

      toast({
        title: "Login berhasil",
        description: "Anda berhasil login dengan wallet",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login gagal",
        description: "Gagal login dengan wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginEmail || !loginPassword) {
      toast({
        title: "Input tidak lengkap",
        description: "Silakan isi email dan password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await loginWithEmail(loginEmail, loginPassword)

      toast({
        title: "Login berhasil",
        description: "Anda berhasil login dengan email",
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login gagal",
        description: "Email atau password salah",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerEmail || !registerPassword || !registerUsername || !confirmPassword) {
      toast({
        title: "Input tidak lengkap",
        description: "Silakan isi semua field yang diperlukan",
        variant: "destructive",
      })
      return
    }

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password dan konfirmasi password harus sama",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await registerUser(registerEmail, registerPassword, registerUsername)

      toast({
        title: "Registrasi berhasil",
        description: "Akun Anda telah dibuat. Silakan login.",
      })

      // Reset form
      setRegisterEmail("")
      setRegisterPassword("")
      setRegisterUsername("")
      setConfirmPassword("")

      // Switch to login tab
      setActiveTab("email")
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registrasi gagal",
        description: "Gagal membuat akun. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    disconnect()
    logout()
    onOpenChange(false)
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari akun",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLoggedIn ? "Akun Anda" : isConnected ? "Login dengan Wallet" : "Hubungkan Wallet"}
          </DialogTitle>
          <DialogDescription>
            {isLoggedIn
              ? "Kelola akun dan aset Anda"
              : "Hubungkan wallet atau login dengan email untuk mengakses fitur DeFi"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="connect" disabled={isLoggedIn}>
              Wallet
            </TabsTrigger>
            <TabsTrigger value="email" disabled={isLoggedIn}>
              Login
            </TabsTrigger>
            
          </TabsList>

          <TabsContent value="connect" className="space-y-4 py-4">
            <div className="grid gap-2">
              {walletOptions.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="w-full justify-start h-12 text-base"
                  onClick={handleConnect}
                >
                  <span className="mr-2 text-xl">{wallet.icon}</span>
                  <span>{wallet.name}</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              Dengan menghubungkan wallet, Anda menyetujui Syarat dan Ketentuan kami
            </div>

            <div className="flex items-center gap-2 pt-4">
              <div className="h-px flex-1 bg-muted"></div>
              <span className="text-xs text-muted-foreground">ATAU</span>
              <div className="h-px flex-1 bg-muted"></div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => setActiveTab("email")}>
                <Mail className="mr-2 h-4 w-4" />
                Login dengan Email
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("register")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Daftar Akun Baru
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="web3login" className="space-y-4 py-4">
            {isConnected && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 pb-4">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <Wallet className="h-6 w-6" />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Wallet Terhubung</h4>
                    <p className="text-xs text-muted-foreground">{truncateAddress(address || "")}</p>
                  </div>
                </div>

                <Button className="w-full" onClick={handleWalletLogin} disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Login dengan Wallet Ini"}
                </Button>

                <div className="flex items-center gap-2 pt-2">
                  <div className="h-px flex-1 bg-muted"></div>
                  <span className="text-xs text-muted-foreground">ATAU</span>
                  <div className="h-px flex-1 bg-muted"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={() => setActiveTab("email")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Login dengan Email
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("register")}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Daftar Akun Baru
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4 py-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Belum punya akun? </span>
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                  Daftar di sini
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 py-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="email@example.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-username">Username</Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Sudah punya akun? </span>
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("email")}>
                  Login di sini
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 py-4">
            {isLoggedIn && user && (
              <>
                <div className="flex items-center space-x-4 pb-4">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    {user.walletAddress ? <Wallet className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{user.username || "Pengguna"}</h4>
                    <p className="text-xs text-muted-foreground">
                      {user.walletAddress ? truncateAddress(user.walletAddress) : user.email || ""}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => console.log("View assets")}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    Lihat Aset
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => console.log("View on explorer")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Lihat di Explorer
                  </Button>

                  <Button variant="destructive" className="w-full mt-4" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
