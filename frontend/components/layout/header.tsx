"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Wallet } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WalletConnect } from "@/components/wallet/wallet-connect";

const routes = [
  { href: "/", label: "Dashboard" },
  { href: "/swap", label: "Swap" },
  { href: "/stake", label: "Stake" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b" 
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-xl">DeFi Hub</span>
          </Link>
          
          <nav className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <NavigationMenuLink 
                    href={route.href} className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50", pathname === route.href ? "bg-accent text-accent-foreground" : "text-foreground")}>
                      {route.label}
                   </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex"
            onClick={() => setIsWalletOpen(true)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
          
          <MobileNav routes={routes} />
        </div>
        
        <WalletConnect 
          open={isWalletOpen} 
          onOpenChange={setIsWalletOpen} 
        />
      </div>
    </header>
  );
}