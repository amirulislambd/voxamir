import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-950 to-slate-800 opacity-95" />
        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <header className="flex items-center justify-between gap-6 pb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                Voxamir
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Ultra-low-bandwidth AI voice calling.
              </h1>
            </div>
            <Link
              href="/mvp"
              className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              Open MVP Demo
            </Link>
          </header>

          <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <div className="max-w-2xl space-y-5">
                <p className="inline-flex rounded-full bg-cyan-500/15 px-4 py-1 text-sm font-medium text-cyan-200 ring-1 ring-cyan-500/20">
                  Phase 1: Browser-native codec + WebRTC demo
                </p>
                <p className="text-lg leading-8 text-slate-300">
                  Voxamir aims to make real-time voice calls possible even on
                  weak networks by compressing live audio using AI-based latent
                  transmission and next-generation peer-to-peer transport.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Live mic capture",
                    "Local WebRTC prototype",
                    "Latent payload simulation",
                    "Fast MVP landing page",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30"
                    >
                      <p className="text-sm text-slate-400">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                Quick Start
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Get the prototype running now
              </h2>
              <p className="mt-4 text-slate-300">
                Open the MVP demo to test microphone capture, local WebRTC
                setup, and initial latent data flow inside the browser.
              </p>
              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-medium text-white">Step 1</p>
                  <p className="mt-2">
                    Click the demo button and allow mic access.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-medium text-white">Step 2</p>
                  <p className="mt-2">
                    Start capture to see WebRTC local DataChannel stats.
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="font-medium text-white">Step 3</p>
                  <p className="mt-2">
                    Inspect latency and transmitted packet counters.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
