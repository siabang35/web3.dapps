import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Twitter, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CopyrightYear } from "@/components/layout/copyright-year";
export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-10">
      <div className="container flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">DeFi Hub</h3>
            <p className="text-sm text-muted-foreground">
              A decentralized finance platform for the modern web.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Website</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/swap" className="text-muted-foreground hover:text-foreground">
                  Token Swap
                </Link>
              </li>
              <li>
                <Link href="/stake" className="text-muted-foreground hover:text-foreground">
                  Staking
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-muted-foreground">
          <p>© <CopyrightYear /> DeFi Hub. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, and Ethereum</p>
        </div>
      </div>
    </footer>
  );
}