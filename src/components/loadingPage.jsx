import React from "react";

export default function LoadingPage({ fullScreen = false }) {
  const containerClasses = fullScreen 
    ? "min-h-screen w-full flex flex-col items-center justify-center bg-base-300/20 backdrop-blur-sm fixed inset-0 z-[100]"
    : "min-h-[60vh] w-full flex flex-col items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center space-y-6 bg-base-100/90 p-12 rounded-[2rem] shadow-2xl border border-primary/30 backdrop-blur-md transition-all duration-500 hover:shadow-primary/20 hover:border-primary/50">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-t-4 border-primary border-r-4 border-r-transparent animate-spin"></div>
          
          {/* Middle rotating ring (reverse) */}
          <div className="absolute inset-2 rounded-full border-b-4 border-accent border-l-4 border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
          
          {/* Inner rotating ring */}
          <div className="absolute inset-4 rounded-full border-t-4 border-secondary border-l-4 border-l-transparent animate-[spin_2s_linear_infinite]"></div>
          
          {/* Center glowing orb */}
          <div className="absolute inset-8 bg-secondary rounded-full animate-pulse blur-md opacity-70"></div>
          <div className="absolute inset-9 bg-accent rounded-full shadow-[0_0_15px_rgba(var(--color-accent),0.8)]"></div>
        </div>
        
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold tracking-widest bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
            DIVINING SECRETS
          </h2>
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
