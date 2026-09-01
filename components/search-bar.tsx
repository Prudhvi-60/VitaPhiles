'use client';

import { Search } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder = 'Search movies, books, lists, people...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="flex w-full items-center gap-3 rounded-full border border-white/10 bg-[#10151b]/90 px-4 py-3 text-sm text-[#d8d2c9] shadow-[0_10px_40px_rgba(0,0,0,0.2)] focus-within:border-[#d6b77a]/60 focus-within:ring-2 focus-within:ring-[#d6b77a]/20">
      <Search className="h-4 w-4 text-[#d6b77a]" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full bg-transparent text-sm text-[#f5efe7] placeholder:text-[#8f8779] focus:outline-none"
      />
    </div>
  );
}
