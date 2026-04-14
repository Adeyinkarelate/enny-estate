'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Home, Info, Building2, Phone } from 'lucide-react';
import type { NavLinkItem } from '@/types';

const navLinks: NavLinkItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/properties', label: 'Properties', icon: Building2 },
  { href: '/contact', label: 'Contact', icon: Phone },
];

function isPathActive(pathname: string, path: string): boolean {
  if (path === '/') {
    return pathname === '/';
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3c2c]">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e3c2c] md:text-2xl font-heading">Enny Estate</h1>
              <p className="hidden text-xs text-gray-500 sm:block">Premium Properties · Nigeria</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                  isPathActive(pathname, href)
                    ? 'bg-[#1e3c2c] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-100 py-4 transition-all duration-300 md:hidden">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                  isPathActive(pathname, href)
                    ? 'bg-[#1e3c2c] text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} aria-hidden />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
