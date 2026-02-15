import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Features() {
  const features = [
    {
      title: "Real-Time meeting Recording",
      desc: "Record Real-time meetings, and generate transcriptions for you.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
    },
    {
      title: "Multi-Accent Support",
      desc: "Advanced AI handles British, American, Asian, and other English accents with precision.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Smart Summaries",
      desc: "Automatically extract key decisions, action items, and important discussion points.",
      icon: (
        <svg
          className="w-8 h-8"
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
      title: "Export & Share",
      desc: "Export transcripts as PDF or TXT files. Share easily with your team or colleagues.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      ),
    },
    {
      title: "Secure Storage",
      desc: "All recordings and transcripts are encrypted and stored securely on your device.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 py-20 px-4 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-blob top-0 -left-20"></div>
            <div className="absolute w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-blob animation-delay-2000 top-0 right-20"></div>
            <div className="absolute w-96 h-96 bg-indigo-300 rounded-full blur-3xl animate-blob animation-delay-4000 bottom-0 left-40"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Powerful Features
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Everything you need to capture, transcribe, and organize your
              meetings with intelligent AI assistance.
            </p>
          </div>

          <style jsx>{`
            @keyframes blob {
              0% {
                transform: translate(0px, 0px) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
              100% {
                transform: translate(0px, 0px) scale(1);
              }
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .animate-fade-in {
              animation: fadeIn 1s ease-out;
            }
            .animate-fade-in-delay {
              animation: fadeIn 1s ease-out 0.3s both;
            }
          `}</style>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="bg-indigo-50 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Whether you're a student, professional, or part of a growing team,
              SmartScribe adapts to your workflow and helps you stay organized.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  99%
                </div>
                <div className="text-gray-600 font-semibold">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  Multiple
                </div>
                <div className="text-gray-600 font-semibold">
                  Languages Supported
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold text-indigo-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-semibold">
                  Offline Access
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
