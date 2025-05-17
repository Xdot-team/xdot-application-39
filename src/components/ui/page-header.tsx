
import * as React from "react";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  heading,
  subheading,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-2 pb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
          {subheading && (
            <p className="text-muted-foreground">{subheading}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
