import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  children,
  className,
}: SectionHeadingProps) {
  return (
    <h1
      className={cn(
        "heading-display",
        className
      )}
    >
      {children}
    </h1>
  );
}
