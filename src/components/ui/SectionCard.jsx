import { cn } from "../../lib/classNames";

export function SectionCard({ children, className }) {
  return <section className={cn("soft-card p-5 sm:p-6", className)}>{children}</section>;
}
