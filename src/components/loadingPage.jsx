export default function LoadingPage({ fullScreen = false, message = "DECRYPTING ARCHIVE" }) {
  const containerClasses = fullScreen 
    ? "min-h-screen w-full flex flex-col items-center justify-center bg-black/80 fixed inset-0 z-[100] p-4"
    : "min-h-[50vh] w-full flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center justify-center space-y-6 bg-base-200 p-8 sm:p-12 border-2 border-base-content brutal-shadow-xl max-w-sm w-full text-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer rotating square */}
          <div className="absolute inset-0 border-2 border-primary animate-spin"></div>
          
          {/* Middle counter-rotating square */}
          <div className="absolute inset-2 border-2 border-accent animate-[spin_3s_linear_infinite_reverse]"></div>
          
          {/* Inner pulsating square */}
          <div className="w-6 h-6 bg-secondary border border-black animate-ping opacity-60"></div>
          <div className="absolute w-4 h-4 bg-primary border border-black"></div>
        </div>
        
        <div className="space-y-2">
          <div className="font-mono text-[10px] font-bold tracking-widest text-primary uppercase">
            // OCCULT DIVINATION //
          </div>
          <h2 className="text-base font-mono font-black tracking-wider text-base-content uppercase">
            [ {message} ]
          </h2>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="w-2 h-2 bg-primary border border-black animate-pulse"></span>
            <span className="w-2 h-2 bg-accent border border-black animate-pulse" style={{ animationDelay: "150ms" }}></span>
            <span className="w-2 h-2 bg-secondary border border-black animate-pulse" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
