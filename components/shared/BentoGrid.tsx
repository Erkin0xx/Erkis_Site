import { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      {children}
    </div>
  );
}
