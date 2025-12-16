export default function HeroBanner() {
  return (
    <div
      className="card h-[300px] md:h-auto mb-6 overflow-hidden relative 
        bg-banner-light-mobile-bg md:bg-banner-light-desktop-bg 
        dark:bg-banner-dark-mobile-bg dark:md:bg-banner-dark-desktop-bg 
        bg-cover bg-center"
    >
      {/* Content */}
      <div className="relative z-10 p-2 md:p-4">
        <h3 className="text-white mb-3">Track Your Daily Activities</h3>
        <p className="p3 text-white/90 max-w-md">
          Monitor your fitness journey with detailed tracking of workouts,
          nutrition, and progress towards your goals.
        </p>
      </div>
    </div>
  );
}
