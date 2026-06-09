import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bohoHero from "@/assets/boho-wedding-hero.png";

export const BohoHero: React.FC = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToRegistration = () => {
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #F7F0E6 0%, #EDE3D4 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-screen py-24">

          {/* ── Left: Text Content ── */}
          <div className="space-y-7 order-2 lg:order-1">

            {/* Tag */}
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#C9973A" }}
            >
              Luxury Wedding Planning
            </p>

            {/* Headline */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none uppercase"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
            >
              Crafting
              <br />
              <span style={{ color: "#C9973A" }}>Timeless</span>
              <br />
              Memories
            </h1>

            {/* Ornamental Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "#C9973A" }} />
              <svg
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8C14 8 10 2 5 4C2 5 1 8 1 8C1 8 4 6.5 7 8C9 9 10 12 14 8Z"
                  fill="#C9973A"
                  opacity="0.7"
                />
                <path
                  d="M14 8C14 8 18 2 23 4C26 5 27 8 27 8C27 8 24 6.5 21 8C19 9 18 12 14 8Z"
                  fill="#C9973A"
                  opacity="0.7"
                />
                <circle cx="14" cy="8" r="2" fill="#C9973A" />
              </svg>
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "#C9973A" }} />
            </div>

            {/* Body */}
            <p className="text-base leading-relaxed max-w-md" style={{ color: "#6B5744" }}>
              From intimate gatherings to grand celebrations,
              we make every detail extraordinary.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={scrollToRegistration}
                className="group px-8 py-4 rounded-full font-semibold text-sm text-white flex items-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{ background: "#C9973A" }}
              >
                Schedule a Consultation
              </button>

              <button
                onClick={scrollToServices}
                className="flex items-center gap-2 text-sm font-semibold transition-colors duration-300 hover:opacity-80"
                style={{ color: "#1A1208" }}
              >
                View Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Right: Arched Image ── */}
          <div className="relative order-1 lg:order-2 flex justify-center items-center">

            {/* Arch frame wrapper */}
            <div className="relative w-full max-w-[380px] mx-auto">
              {/* SVG arch border overlay */}
              <svg
                viewBox="0 0 380 490"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              >
                <path
                  d="M14 190 C14 86 86 14 190 14 C294 14 366 86 366 190 L366 476 L14 476 Z"
                  stroke="#C9973A"
                  strokeWidth="1.5"
                  fill="none"
                  opacity="0.85"
                />
              </svg>

              {/* Image clipped to arch shape */}
              <div
                className="overflow-hidden w-full"
                style={{
                  clipPath: "path('M14 190 C14 86 86 14 190 14 C294 14 366 86 366 190 L366 476 L14 476 Z')",
                  aspectRatio: "380/490",
                }}
              >
                <img
                  src={bohoHero}
                  alt="Luxurious wedding hall with chandeliers and floral aisle"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 10%" }}
                />
              </div>
            </div>

            {/* Botanical line art decoration */}
            <svg
              className="absolute right-0 top-1/4 pointer-events-none hidden xl:block"
              width="48"
              height="180"
              viewBox="0 0 48 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.5"
            >
              <path d="M24 180 L24 0" stroke="#C9973A" strokeWidth="1" />
              <path d="M24 145 Q42 125 46 108" stroke="#C9973A" strokeWidth="1" fill="none" />
              <path d="M24 115 Q6 95 2 78" stroke="#C9973A" strokeWidth="1" fill="none" />
              <path d="M24 85 Q44 65 47 50" stroke="#C9973A" strokeWidth="1" fill="none" />
              <path d="M24 58 Q5 38 1 24" stroke="#C9973A" strokeWidth="1" fill="none" />
              <ellipse cx="46" cy="107" rx="4" ry="2.5" fill="#C9973A" transform="rotate(-30 46 107)" />
              <ellipse cx="2" cy="77" rx="4" ry="2.5" fill="#C9973A" transform="rotate(30 2 77)" />
              <ellipse cx="47" cy="49" rx="4" ry="2.5" fill="#C9973A" transform="rotate(-20 47 49)" />
              <ellipse cx="1" cy="23" rx="4" ry="2.5" fill="#C9973A" transform="rotate(20 1 23)" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BohoHero;
