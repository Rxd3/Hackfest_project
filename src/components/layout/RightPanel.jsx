import { cn } from "../../lib/classNames";

export function RightPanel({ children, className }) {
  if (!children) {
    return null;
  }

  return <aside className={cn("space-y-5 xl:w-[310px] xl:shrink-0", className)}>{children}</aside>;
}
