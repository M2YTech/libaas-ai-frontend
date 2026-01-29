"use client";

// import Image from "next/image";
import Link from "next/link";
import heroImage from "../../public/assets/hero-wardrobe.jpg";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-emerald-700 via-emerald-600 to-yellow-400 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 overflow-hidden transition-colors duration-500">
      <div className="mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white tracking-tight">
                Your Wardrobe,
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-yellow-400 dark:text-emerald-400">
                Reimagined
              </h1>
            </div>

            <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-white/90 dark:text-gray-300">
              Transform your style with LibassAI - the intelligent wardrobe
              assistant that understands your personal fashion, Pakistani
              heritage, and creates perfect outfit combinations for every
              occasion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-emerald-600 px-8 py-4 text-lg font-bold text-emerald-700 dark:text-white hover:gap-4 transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-95"
              >
                Get Started
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400/90 dark:bg-gray-800 backdrop-blur-sm px-8 py-4 text-lg font-bold text-gray-900 dark:text-white border-2 border-transparent dark:border-gray-700 transition-all hover:bg-yellow-400 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 shadow-xl"
              >
                Try a demo
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <img
                src={heroImage.src}
                alt="Beautiful wardrobe with Pakistani traditional clothing"
                className="w-full rounded-2xl object-cover object-center shadow-2xl border-4 border-white/20 dark:border-gray-800"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white/10">
                <svg className="w-24 h-24 md:w-32 md:h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}

