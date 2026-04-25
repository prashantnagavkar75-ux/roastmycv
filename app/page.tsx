import { Marquee } from "@/components/marquee";
import { RoastForm } from "@/components/roast-form";
import { SampleRoasts } from "@/components/sample-roasts";
import { Stats } from "@/components/stats";
import { HallOfShame } from "@/components/hall-of-shame";
import { Flame, Github, Twitter } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Marquee />

      {/* Header */}
      <header className="p-6 border-b-2 border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              ROAST<span className="text-primary">MY</span>CV
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="p-6 md:p-12 border-b-2 border-border">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            YOUR
            <br />
            <span className="bg-primary text-primary-foreground px-3">
              RESUME
            </span>
            <br />
            IS{" "}
            <span className="bg-secondary text-secondary-foreground px-3">
              MID
            </span>
            .
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Get your resume absolutely destroyed by AI. We&apos;ll find every red flag,
            cringe buzzword, and career-ending mistake. Then help you fix it.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="p-6 border-b-2 border-border bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <Stats />
        </div>
      </section>

      {/* Main Content */}
      <section className="p-6 md:p-12 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <RoastForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SampleRoasts />

              <HallOfShame />

              {/* Tips */}
              <div className="border-2 border-border bg-card p-4">
                <h3 className="font-bold mb-3 bg-warning text-warning-foreground px-2 py-1 inline-block text-sm">
                  PRO TIPS
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">*</span>
                    The more detail you paste, the better the roast
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">*</span>
                    Include your work experience, not just skills
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">*</span>
                    Upload PDF for best parsing results
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">*</span>
                    Try different tones for different perspectives
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 border-t-2 border-border bg-muted/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Built with chaos energy and questionable decisions. Not responsible
            for career crises.
          </p>
          <p className="font-mono">v1.0.0 // 2024</p>
        </div>
      </footer>
    </main>
  );
}
