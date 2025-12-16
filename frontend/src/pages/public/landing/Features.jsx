import NutritionIllustration from "../../../assets/images/eating.png";
import WorkoutIllustration from "../../../assets/images/workout.png";
import GoalIllustration from "../../../assets/images/goal.png";
import ProgressIllustration from "../../../assets/images/insights.png";

export default function Features() {
  const features = [
    {
      title: "Nutrition Tracking",
      description:
        "Log your meals and track your daily calorie intake with detailed macro breakdowns for optimal nutrition.",
      illustration: NutritionIllustration,
      color: "lime",
      bgColor: "bg-white",
      darkBgColor: "dark:bg-lime-900/10",
    },
    {
      title: "Workout Logging",
      description:
        "Record your exercises, sets, reps, and track your progress over time with comprehensive workout analytics.",
      illustration: WorkoutIllustration,
      color: "lavender",
      bgColor: "bg-lavender-50",
      darkBgColor: "dark:bg-lavender-900/10",
    },
    {
      title: "Goal Setting",
      description:
        "Set personalized goals for calories, weight, and workout frequency to stay motivated and on track.",
      illustration: GoalIllustration,
      color: "aqua",
      bgColor: "bg-white",
      darkBgColor: "dark:bg-aqua-900/10",
    },
    {
      title: "Progress Insights",
      description:
        "Visualize your journey with interactive charts and analytics to understand your fitness trends.",
      illustration: ProgressIllustration,
      color: "lime",
      bgColor: "bg-lavender-50",
      darkBgColor: "dark:bg-lime-900/10",
    },
  ];

  return (
    <section
      id="features"
      className="relative py-20 px-6 md:px-12 lg:px-20 bg-aqua-100 bg-opacity-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-aqua-800 bg-opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-aqua-800 bg-opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-lavender-100 dark:bg-lavender-900/30 rounded-full mb-4">
            <span className="p4 font-semibold text-lavender-700 dark:text-lavender-300">
              POWERFUL FEATURES
            </span>
          </div>
          <h2 className="h2 mb-4">
            Everything You Need in{" "}
            <span className="text-lime-600">One Place</span>
          </h2>
          <p className="p2 text-tertiary max-w-2xl mx-auto text-balance">
            Comprehensive tools to track, analyze, and improve your fitness
            journey with precision and ease.
          </p>
        </div>

        {/* Features Grid - Illustration-First Layout */}
        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-12 lg:gap-20`}
              >
                {/* Illustration Section */}
                <div className="flex-shrink-0 w-full lg:w-1/2 group">
                  <div className="relative">
                    {/* Large Number Background */}
                    <div
                      className={`absolute -top-8 ${
                        isEven ? "-left-8" : "-right-8"
                      } text-[120px] md:text-[160px] lg:text-[200px] font-black opacity-5 select-none pointer-events-none`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    {/* Illustration Container */}
                    <div
                      className={`relative rounded-3xl p-8 md:p-12 lg:p-16 transition-all duration-500`}
                    >
                      <img
                        src={feature.illustration}
                        alt={feature.title}
                        className="w-full h-auto object-contain drop-shadow-2xl"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className={`flex-1 space-y-6 ${
                    isEven ? "lg:pl-8" : "lg:pr-8"
                  }`}
                >
                  {/* Small Number Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 ${
                      feature.color === "lime"
                        ? "bg-lime-100 dark:bg-lime-900/30"
                        : feature.color === "lavender"
                        ? "bg-lavender-100 dark:bg-lavender-900/30"
                        : "bg-aqua-100 dark:bg-aqua-900/30"
                    } rounded-full`}
                  >
                    <span
                      className={`p4 font-bold ${
                        feature.color === "lime"
                          ? "text-lime-700 dark:text-lime-300"
                          : feature.color === "lavender"
                          ? "text-lavender-700 dark:text-lavender-300"
                          : "text-aqua-700 dark:text-aqua-300"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="h2">{feature.title}</h3>

                  {/* Description */}
                  <p className="p2 text-tertiary leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative Line */}
                  <div
                    className={`w-24 h-1 rounded-full ${
                      feature.color === "lime"
                        ? "bg-lime-500"
                        : feature.color === "lavender"
                        ? "bg-lavender-500"
                        : "bg-aqua-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
