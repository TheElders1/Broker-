import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 ${className}`}
      aria-label="Genesis Pro LTD home"
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-gold-500/40">
        <Image
          src="/logo.png"
          alt="Genesis Pro LTD"
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-white">
          GENESIS <span className="text-gold-400">PRO</span>
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-royal-300">
          LTD
        </span>
      </span>
    </Link>
  );
}
