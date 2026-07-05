import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-950 to-slate-800 opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <header className="flex flex-col gap-6 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">
                Voxamir
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                AI voice calls for weak networks.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Voxamir compresses live voice into lightweight latent data and
                streams it over browser WebRTC for smoother calling on low
                bandwidth.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/mvp"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                Open MVP Demo
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                View features
              </Link>
            </div>
          </header>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_0.9fr]">
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Ultra-low bandwidth",
                    subtitle: "Less than 2 kbps goal for voice payload.",
                  },
                  {
                    title: "Browser-native",
                    subtitle: "No native install, runs directly in web apps.",
                  },
                  {
                    title: "Live call UX",
                    subtitle:
                      "Pocket-friendly call screen with realtime stats.",
                  },
                  {
                    title: "Privacy-first",
                    subtitle:
                      "Local audio handling and consent-based voice profiles.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-4xl border border-slate-700/70 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                  MVP preview
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Call screen, stats, and local WebRTC transport.
                </h2>
                <p className="mt-4 text-slate-300">
                  The live demo page shows a contact-style call UI with mic
                  capture, peer state, and latent transmission metrics.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Live metrics
                    </p>
                    <p className="mt-3 text-base font-semibold text-white">
                      Connection, DataChannel, latent packets
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/80 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Call controls
                    </p>
                    <p className="mt-3 text-base font-semibold text-white">
                      Start/Stop, mute, speaker, and strong mobile layout.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/30">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-cyan-500/20 to-slate-700 text-4xl font-semibold text-white">
                  V
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                    Next demo
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">
                    Voxamir call prototype
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    What it includes
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li>• Mic capture with AudioContext</li>
                    <li>• Local WebRTC DataChannel</li>
                    <li>• Latent packet simulation</li>
                    <li>• Modern call-style UI</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Ready for testing
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Click the demo and use your browser mic to validate the
                    current prototype flow.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="mt-12 space-y-6">
            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/30 sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
                Features
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Real-time stats",
                    description:
                      "Monitor bandwidth, packet flow and connection status.",
                  },
                  {
                    title: "Call-style UX",
                    description:
                      "A modern interface with avatar, call actions, and mobile-ready layout.",
                  },
                  {
                    title: "Browser-first",
                    description:
                      "No install required; works inside Next.js and web apps.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5"
                  >
                    <p className="text-lg font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
