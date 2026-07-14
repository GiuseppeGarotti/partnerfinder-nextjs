"use client";

import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ value, onChange, options, placeholder }) {
  const [aperto, setAperto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setAperto(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selezionata = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAperto(!aperto)}
        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:border-[#f4520a] transition"
      >
        <span className={selezionata ? "text-white" : "text-white/40"}>
          {selezionata ? selezionata.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-white/40 transition-transform ${
            aperto ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" strokeWidth="2" />
        </svg>
      </button>
      {aperto && (
        <div className="absolute z-20 mt-2 w-full bg-[#1a2535] border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto">
          {options.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setAperto(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition ${
                o.value === value
                  ? "text-[#f4520a] font-semibold bg-[#f4520a]/5"
                  : "text-white/80"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
