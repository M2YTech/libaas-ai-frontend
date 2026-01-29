export default function HowItWorksSection() {
  const steps = [
    {
      title: "Capture Your Wardrobe",
      description:
        "Take photos of your clothes, traditional wear, and accessories. Our AI recognizes patterns, colors, and styles instantly.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: "AI Learns Your Style",
      description:
        "LibassAI analyzes your wardrobe, understanding your preferences, body type, and personal fashion sense.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    {
      title: "Get Perfect Matches",
      description:
        "Receive personalized outfit suggestions for any occasion. Shop smarter with product recommendations that match your wardrobe.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full bg-background py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl relative">
        {/* Header */}
        <div className="mb-16 sm:mb-20 lg:mb-24 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="mx-auto max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground px-4 sm:px-0">
            Three simple steps to transform your style experience with
            AI-powered fashion intelligence.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-12 sm:gap-16 md:grid-cols-3 lg:gap-16 relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="relative group flex flex-col items-center">
              {/* Connector (Desktop Only) */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[70%] top-[40px] hidden w-full h-[2px] bg-gradient-to-r from-emerald-500/50 via-emerald-500/10 to-transparent md:block z-0"
                />
              )}

              {/* Step Number Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-500 text-lg font-black text-white shadow-2xl ring-4 ring-background transform transition-transform group-hover:scale-110">
                  {index + 1}
                </span>
              </div>

              {/* Card Container */}
              <div className="w-full h-full bg-card p-10 rounded-3xl shadow-lg border border-border group-hover:border-emerald-500/50 transition-all duration-500 relative z-10 hover:shadow-2xl">
                {/* Icon Container with Glow */}
                <div className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-yellow-400 text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 mx-auto">
                  <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="mb-4 text-2xl font-black text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      </div>
    </section>
  );
}
