import { Link } from "react-router-dom";
import HeroScroll3D from "@/components/HeroScroll3D";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-foreground">
              ProScout
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-display text-xs uppercase tracking-wider">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="font-display text-xs uppercase tracking-wider">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3D Scroll Hero */}
      <HeroScroll3D />

      {/* CTA Section after scroll */}
      <section className="relative z-10 bg-background py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Ready to Discover the Next Generation of Talent?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join scouts and analysts using AI-powered insights to identify and evaluate basketball prospects with unprecedented accuracy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/login">
              <Button size="lg" className="font-display text-sm uppercase tracking-wider px-8">
                Start Scouting
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-display text-sm uppercase tracking-wider px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Advanced Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Deep statistical analysis combining traditional metrics with advanced efficiency ratings.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">AI Predictions</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Machine learning models trained on 20+ years of draft data for accurate career projections.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Player Archetypes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Classify prospects into proven NBA player molds to understand their projected role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <p className="text-center font-display text-xs uppercase tracking-widest text-muted-foreground">
          ProScout Analytics • 2026
        </p>
      </footer>
    </div>
  );
};

export default Home;
