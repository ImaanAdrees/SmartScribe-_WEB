import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function About() {
  const team = [
    {
      name: "Adan Fatima",
      role: "Frontend & Product Design",
      bio: "Specializes in creating intuitive user interfaces and seamless user experiences.",
      initial: "AF",
    },
    {
      name: "Imaan Adrees",
      role: "Backend & API Integration",
      bio: "Focuses on robust backend architecture and efficient API development.",
      initial: "IA",
    },
    {
      name: "Maria Zaman",
      role: "Research & Testing",
      bio: "Ensures quality through comprehensive testing and user research.",
      initial: "MZ",
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

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              About SmartScribe
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Transforming the way teams capture and organize meeting
              information
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

        {/* Mission Section */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="relative bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-12 border-2 border-indigo-100 shadow-lg overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-32 h-32 bg-indigo-300 rounded-full blur-2xl animate-float-slow top-10 left-10"></div>
              <div className="absolute w-40 h-40 bg-purple-300 rounded-full blur-2xl animate-float-medium top-20 right-20"></div>
              <div className="absolute w-36 h-36 bg-indigo-400 rounded-full blur-2xl animate-float-fast bottom-10 left-1/3"></div>
              <div className="absolute w-28 h-28 bg-purple-200 rounded-full blur-2xl animate-float-slow bottom-20 right-1/4"></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                SmartScribe is an AI-driven note-taking assistant designed to
                revolutionize how you capture and process meeting information.
                We believe that important conversations shouldn't be lost to
                poor note-taking or memory gaps.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed">
                Built for students, professionals, and teams, our platform
                combines cutting-edge AI technology with an intuitive interface
                to help you focus on what truly matters—engaging in meaningful
                discussions while we handle the documentation.
              </p>
            </div>

            <style jsx>{`
              @keyframes floatSlow {
                0%,
                100% {
                  transform: translate(0, 0) scale(1);
                }
                25% {
                  transform: translate(20px, -20px) scale(1.05);
                }
                50% {
                  transform: translate(-15px, 15px) scale(0.95);
                }
                75% {
                  transform: translate(15px, 10px) scale(1.02);
                }
              }
              @keyframes floatMedium {
                0%,
                100% {
                  transform: translate(0, 0) scale(1) rotate(0deg);
                }
                33% {
                  transform: translate(-25px, 20px) scale(1.1) rotate(120deg);
                }
                66% {
                  transform: translate(20px, -15px) scale(0.9) rotate(240deg);
                }
              }
              @keyframes floatFast {
                0%,
                100% {
                  transform: translate(0, 0) scale(1);
                }
                20% {
                  transform: translate(30px, 25px) scale(1.08);
                }
                40% {
                  transform: translate(-20px, -20px) scale(0.92);
                }
                60% {
                  transform: translate(25px, -15px) scale(1.05);
                }
                80% {
                  transform: translate(-15px, 20px) scale(0.98);
                }
              }
              .animate-float-slow {
                animation: floatSlow 8s ease-in-out infinite;
              }
              .animate-float-medium {
                animation: floatMedium 10s ease-in-out infinite;
              }
              .animate-float-fast {
                animation: floatFast 6s ease-in-out infinite;
              }
            `}</style>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-indigo-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-lg">
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Innovation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Constantly pushing boundaries with AI technology to deliver
                  smarter, faster solutions.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-lg">
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
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
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Privacy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data is yours. We prioritize security and keep your
                  information encrypted and private.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-lg">
                <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Simplicity
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Powerful features wrapped in an intuitive design that anyone
                  can use effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to build the future of
              meeting documentation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-indigo-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                  {member.initial}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
              Experience the future of meeting documentation with SmartScribe
            </p>
            <Link
              href="/demo"
              className="inline-block bg-white text-indigo-600 hover:bg-gray-50 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
            >
              Try SmartScribe Today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
