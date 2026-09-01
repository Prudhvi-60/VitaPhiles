import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Star } from 'lucide-react';

export function MediaCard({
  title,
  subtitle,
  description,
  image,
  rating,
  href,
}: {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  rating: number;
  href: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[26px] border border-white/10 bg-[#11161b]/85 transition hover:-translate-y-1 hover:border-[#d6b77a]/60">
      <div className="relative overflow-hidden">
        <Image src={image} alt={`${title} cover`} width={900} height={1200} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#d6b77a]/30 bg-[#0d1117]/80 px-2.5 py-1 text-xs text-[#f7e7b9]">
          <Star className="h-3.5 w-3.5 fill-current" />
          {rating.toFixed(1)}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#f5efe7]">{title}</h3>
            <p className="mt-1 text-sm text-[#b8af9d]">{subtitle}</p>
          </div>
          <Link href={href} aria-label={`Open ${title}`} className="rounded-full border border-white/10 p-2 text-[#d6b77a] transition hover:border-[#d6b77a]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b77a]">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="text-sm leading-6 text-[#c7bdab]">{description}</p>
      </div>
    </article>
  );
}
