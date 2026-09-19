"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Student Portal", href: "/student" },
  { label: "Depot Desk", href: "/depot" },
  { label: "Conductor Terminal", href: "/conductor" },
  { label: "Sign In", href: "/login" },
];

export default function NavHeader() {
  const pathname = usePathname();
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand: Prominent Elephant Artwork */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-20 h-16 sm:w-24 sm:h-18 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="VandiPass Logo"
              width={120}
              height={80}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight leading-none block">
              VandiPass
            </span>
            <span className="text-xs text-slate-500 font-medium tracking-normal mt-1 block">
              Digital Student Concession
            </span>
          </div>
        </Link>

        {/* Dynamic Sliding Magnetic Nav Tabs */}
        <ul
          className="relative hidden sm:flex items-center rounded-full border border-slate-200 bg-slate-100/80 p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tab
                key={item.href}
                href={item.href}
                isActive={isActive}
                setPosition={setPosition}
              >
                {item.label}
              </Tab>
            );
          })}
          <Cursor position={position} />
        </ul>

      </div>
    </header>
  );
}

const Tab = ({
  children,
  href,
  isActive,
  setPosition,
}: {
  children: React.ReactNode;
  href: string;
  isActive: boolean;
  setPosition: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block"
    >
      <Link
        href={href}
        className={`block px-4 py-1.5 text-xs font-bold transition-colors ${
          isActive ? "text-emerald-700" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 h-7 rounded-full bg-white shadow-sm border border-slate-200/80 pointer-events-none"
    />
  );
};
