import { SparklesIcon } from "lucide-react";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex item-center gap-2">
      <SparklesIcon className="size-8" strokeWidth={1.5} />
      <span className="text-lg font-semibold">Pictoria AI</span>
    </Link>
  );
};
