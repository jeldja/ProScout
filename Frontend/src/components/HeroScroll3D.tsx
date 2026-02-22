import { useRef, useState, useEffect, useCallback } from "react";
import ScrollScene3D from "./ScrollScene3D";

const scrollSections = [
  {
    tag: "WELCOME",
    title: "THE NEXT ERA OF BASKETBALL",
    description: "AI-powered scouting and analytics to find tomorrow's stars today.",
  },
  {
    tag: "ANALYTICS",
    title: "PERFORMANCE ENGINEERED",
    description: "Deep statistical modeling combines film study, biometrics, and game data to project career trajectories with unprecedented accuracy.",
  },
  {
    tag: "SCOUTING",
    title: "BEYOND THE BOX SCORE",
    description: "Our archetype system classifies players into proven NBA molds, mapping college production to professional outcomes.",
  },
  {
    tag: "PROJECTION",
    title: "CAREER OUTCOMES",
    description: "Machine learning models trained on thousands of data to predict where each prospect lands — from All-Star to role player.",
  },
];

const HeroScroll3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    const scrollableHeight = el.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
    setScrollProgress(progress);
    setActiveSection(Math.min(scrollSections.length - 1, Math.floor(progress * scrollSections.length)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${scrollSections.length * 100}vh` }}
    >
      {/* Sticky 3D canvas + text overlay */}
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* 3D Canvas - right side */}
        <div className="absolute inset-0 z-0">
          <ScrollScene3D scrollProgress={scrollProgress} />
        </div>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-20 bg-gradient-to-b from-background to-transparent" />

        {/* Text content - left side */}
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6">
          <div className="max-w-lg">
            {scrollSections.map((section, i) => (
              <div
                key={i}
                className={`absolute transition-all duration-700 ${
                  activeSection === i
                    ? "translate-y-0 opacity-100"
                    : i < activeSection
                    ? "-translate-y-10 opacity-0"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <span className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  {section.tag}
                </span>
                <h2 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {scrollSections.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                activeSection === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        {scrollProgress < 0.05 && (
          <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 animate-bounce text-center">
            <p className="font-display text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Scroll</p>
            <div className="mx-auto mt-1 h-6 w-px bg-muted-foreground/40" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroScroll3D;
