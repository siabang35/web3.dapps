"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Wallet, Menu } from "lucide-react";

type Route = {
  href: string;
  label: string;
};

interface MobileNavProps {
  routes: Route[];
}

export function MobileNav({ routes }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[385px]">
        <div className="flex flex-col gap-6 pt-6">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link 
                key={route.href} 
                href={route.href} 
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center py-3 px-4 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <div className="border-t pt-4">
            <Button className="w-full" size="lg">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}