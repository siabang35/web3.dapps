import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Decentralized Finance for Everyone
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Swap, stake, and manage your crypto assets with a seamless, secure interface. 
              No hidden fees, no complicated processes.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/swap">
                Start Swapping <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/portfolio">
                View Portfolio
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="text-2xl font-bold">$4.2B+</div>
              <p className="text-xs text-muted-foreground">Total Volume</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="text-2xl font-bold">500K+</div>
              <p className="text-xs text-muted-foreground">Users</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="text-2xl font-bold">35+</div>
              <p className="text-xs text-muted-foreground">Chains</p>
            </div>
            <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
              <div className="text-2xl font-bold">12.5%</div>
              <p className="text-xs text-muted-foreground">Avg. APY</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}