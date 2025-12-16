import PrimaryButton from "../../../components/buttons/PrimaryButton";
import SecondaryButton from "../../../components/buttons/SecondaryButton";
import { ArrowRight, Activity, Apple, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

// Import the images used in the design
import runningImage from "../../../assets/images/hero-running.png";
import foodImage from "../../../assets/images/hero-food.png";

export default function Hero() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center py-12 md:py-20 px-6 md:px-12 lg:px-20 bg-base overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-lime-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-lavender-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aqua-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-100 dark:bg-lime-900/30 rounded-full border border-lime-300 dark:border-lime-700">
              <Activity
                className="text-lime-600 dark:text-lime-400"
                size={18}
              />
              <span className="p4 font-semibold text-lime-700 dark:text-lime-300">
                Your Fitness Journey Starts Here
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="mb-4">
                Unlock Your Potential,{" "}
                <span className="text-lavender-600 dark:text-lavender-400">
                  Fitness
                </span>{" "}
                &{" "}
                <span className="text-aqua-600 dark:text-aqua-400">Health</span>{" "}
                Hub
              </h1>
              <p className="block p2 text-secondary max-w-xl">
                Transform your lifestyle with our comprehensive wellness
                platform. Track workouts, monitor nutrition, and achieve your
                fitness goals—all in one place.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-2">
              <Link to="/auth/create-profile">
                <PrimaryButton className="flex items-center gap-2">
                  GET STARTED
                  <ArrowRight size={20} />
                </PrimaryButton>
              </Link>
              <div className="hidden md:block">
                <SecondaryButton href="#features" onClick={scrollToFeatures}>
                  LEARN MORE
                </SecondaryButton>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden md:grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="h3 text-lavender-600 dark:text-lavender-400">
                  120K+
                </div>
                <div className="p4 text-tertiary">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="h3 text-lime-600 dark:text-lime-400">4.8★</div>
                <div className="p4 text-tertiary">User Rating</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="h3 text-aqua-600 dark:text-aqua-400">100+</div>
                <div className="p4 text-tertiary">Workouts</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative">
            {/* Main large image */}
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={runningImage}
                alt="Fitness lifestyle"
                className="w-full h-[400px] md:h-[600px] object-cover object-top"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='600' height='600' fill='%23B389C5'/%3E%3C/svg%3E";
                }}
              />
              {/* Floating card on image */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-stroke">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="p3 text-white mb-1">Daily Achievement</div>
                    <h4 className="text-lime-300">87% Complete</h4>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                    <TrendingUp
                      className="text-lime-600 dark:text-lime-400"
                      size={28}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller accent image */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-2 border-white hidden lg:block">
              <img
                src={foodImage}
                alt="Healthy nutrition"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating feature icons */}
            <div className="absolute top-6 -left-6 w-16 h-16 rounded-2xl bg-lavender-500 shadow-xl hidden lg:flex items-center justify-center animate-bounce">
              <Activity className="text-white" size={32} />
            </div>
            <div className="absolute top-24 -right-6 w-14 h-14 rounded-xl bg-aqua-500 shadow-xl hidden lg:flex items-center justify-center">
              <Apple className="text-white" size={28} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
