import { Users, Sparkles, Shield } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a thriving community of fitness enthusiasts supporting each other's journey to wellness.",
      color: "lavender",
      gradient: "from-lavender-500 to-lavender-600",
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description:
        "Cutting-edge features and AI-powered insights to optimize your fitness experience.",
      color: "lime",
      gradient: "from-lime-500 to-lime-600",
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description:
        "Your data is secure and private. We prioritize transparency and user trust above all.",
      color: "aqua",
      gradient: "from-aqua-500 to-aqua-600",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-20 px-6 md:px-12 lg:px-20 bg-base overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-aqua-100 dark:bg-aqua-900/30 rounded-full mb-4">
            <span className="p4 font-semibold text-aqua-700 dark:text-aqua-300">
              ABOUT NOVAFIT
            </span>
          </div>
          <h2 className="h2 mb-4">
            Built for{" "}
            <span className="text-lavender-600 dark:text-lavender-400">
              Your Success
            </span>
          </h2>
          <p className="p2 text-tertiary max-w-2xl mx-auto text-balance">
            We're on a mission to make fitness tracking simple, effective, and
            accessible for everyone on their wellness journey.
          </p>
        </div>

        {/* Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-base border border-stroke transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-white" size={32} />
                  </div>

                  <h3 className="h3 mb-3">{value.title}</h3>
                  <p className="p3 text-tertiary">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
