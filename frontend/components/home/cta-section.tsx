import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Start Your DeFi Journey?
            </h2>
            <p className="mx-auto max-w-[700px] md:text-xl text-primary-foreground/80">
              Join thousands of users who are already earning, swapping, and growing their crypto portfolio.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link href="/swap">
                Start Trading <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8">
              <Link href="/stake">
                Explore Staking
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}