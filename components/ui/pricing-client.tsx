'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function PricingClient({ tier }: { tier: string }) {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Enrollment Coming Soon!",
      description: `You'll be notified when the ${tier} plan is available.`,
    });
  };

  return (
    <Button onClick={handleClick} className="w-full bg-purple-600 hover:bg-purple-700">
      Get Started
    </Button>
  );
}
