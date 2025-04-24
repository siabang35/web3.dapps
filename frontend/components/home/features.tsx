import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Landmark, PieChart, Shield } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <ArrowUpDown className="h-10 w-10 text-primary" />,
      title: "Swap Tokens",
      description: "Exchange any supported tokens with minimal slippage and low fees across multiple chains.",
    },
    {
      icon: <Landmark className="h-10 w-10 text-primary" />,
      title: "Stake & Earn",
      description: "Earn rewards by staking your assets in verified liquidity pools with competitive APYs.",
    },
    {
      icon: <PieChart className="h-10 w-10 text-primary" />,
      title: "Track Portfolio",
      description: "Monitor your assets, view historical performance, and track your DeFi positions.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Protocols",
      description: "All smart contracts are audited and secured with the highest standards in the industry.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Powerful DeFi Tools in One Place
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to manage your crypto assets and maximize your returns.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}