import { useState, useEffect } from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [apkInfo, setApkInfo] = useState(null);

  useEffect(() => {
    const fetchLatestAPK = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await axios.get(`${API_URL}/api/maintenance/public-apk-history`);
        if (res.data.success && res.data.data) {
          setApkInfo(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching APK info:", error);
      }
    };
    fetchLatestAPK();
  }, []);

  // Socket.IO for real-time updates
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const socket = io(API_URL);

    socket.on("apk_list_updated", () => {
      console.log("APK list updated, refreshing...");
      const fetchLatestAPK = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/maintenance/public-apk-history`);
          if (res.data.success && res.data.data) {
            setApkInfo(res.data.data);
          }
        } catch (error) {
          console.error("Error refreshing APK info:", error);
        }
      };
      fetchLatestAPK();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const latestAPK = apkInfo && apkInfo.length > 0 ? apkInfo[0] : null;

  const handleDownload = async () => {
    if (latestAPK && latestAPK.filePath) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const downloadUrl = `${API_URL}${latestAPK.filePath}`;
        
        // Fetch as blob to force custom filename
        const response = await axios.get(downloadUrl, {
          responseType: 'blob'
        });

        // Create a blob URL for the data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        // Set the desired filename here
        link.setAttribute('download', `smartscribe-app(${latestAPK.version}).apk`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download APK. Please check your connection.");
      }
    }
  };

  const showImprovements = latestAPK?.improvements?.length > 0;
  const showBugFixes = latestAPK?.bugFixes?.length > 0;
  const isOnlyFeatures = !showImprovements && !showBugFixes;

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
              Experience SmartScribe
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Try our demo app and see how SmartScribe transforms your meeting experience 
              with intelligent transcription and summaries.
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

        {/* Demo Content */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <div className="relative bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-12 border-2 border-indigo-100 shadow-xl overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-32 h-32 bg-indigo-300 rounded-full blur-2xl animate-float-slow top-10 left-10"></div>
              <div className="absolute w-40 h-40 bg-purple-300 rounded-full blur-2xl animate-float-medium top-20 right-20"></div>
              <div className="absolute w-36 h-36 bg-indigo-400 rounded-full blur-2xl animate-float-fast bottom-10 left-1/3"></div>
              <div className="absolute w-28 h-28 bg-purple-200 rounded-full blur-2xl animate-float-slow bottom-20 right-1/4"></div>
            </div>
            
            <div className="text-center mb-12 relative z-10">
              <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Download the App {latestAPK && <span className="text-indigo-600 block text-2xl mt-2">v{latestAPK.version}</span>}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Get started with SmartScribe on your Android device. 
                Record, transcribe, and summarize meetings on the go.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 inline-flex items-center gap-3 mb-10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download APK
              </button>

              {/* Secure Login & Features Highlights */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">Secure Login</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">Real-time Sync</span>
                </div>
                <div className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-700">Smart Summaries</span>
                </div>
              </div>
            </div>

            {/* Dynamic Features / Improvements / Bug Fixes */}
            {latestAPK ? (
              <div className="grid md:grid-cols-3 gap-6 mt-16 relative z-10">
                {/* New Features */}
                {latestAPK.features && latestAPK.features.length > 0 && (
                  <div className={`text-left p-6 bg-white rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow ${isOnlyFeatures ? "md:col-span-3" : ""}`}>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">New Features</h3>
                    <ul className="space-y-2">
                       {latestAPK.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {latestAPK.improvements && latestAPK.improvements.length > 0 && (
                  <div className="text-left p-6 bg-white rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Improvements</h3>
                    <ul className="space-y-2">
                       {latestAPK.improvements.map((item, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bug Fixes */}
                {latestAPK.bugFixes && latestAPK.bugFixes.length > 0 && (
                   <div className="text-left p-6 bg-white rounded-2xl border border-indigo-100 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Bug Fixes</h3>
                    <ul className="space-y-2">
                       {latestAPK.bugFixes.map((fix, idx) => (
                        <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // Static Fallback
              <div className="grid md:grid-cols-3 gap-6 mt-16 relative z-10">
                <div className="text-center p-6 bg-white rounded-2xl border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Quick Setup</h3>
                  <p className="text-gray-600 text-sm">Install and start recording in seconds</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Secure</h3>
                  <p className="text-gray-600 text-sm">All data encrypted and stored locally</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl border border-indigo-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Full Featured</h3>
                  <p className="text-gray-600 text-sm">Access all SmartScribe capabilities</p>
                </div>
              </div>
            )}
            
            <style jsx>{`
              @keyframes floatSlow {
                0%, 100% {
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
                0%, 100% {
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
                0%, 100% {
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

          {/* System Requirements */}
          <div className="mt-12 bg-white rounded-2xl p-8 border-2 border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">System Requirements</h3>
            <div className="grid md:grid-cols-2 gap-6 text-gray-600">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Android 8.0+</strong>
                  <p className="text-sm">Compatible with most modern devices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">100MB Storage</strong>
                  <p className="text-sm">Minimal space required for app</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong className="text-gray-900">Microphone Access</strong>
                  <p className="text-sm">Required for audio recording</p>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Releases - Only shown if 2+ APKs exist */}
          {apkInfo && apkInfo.length >= 2 && (
            <div className="mt-12 bg-white rounded-2xl p-8 border-2 border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Previous Releases</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {apkInfo.slice(1).map((release, index) => (
                  <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">SmartScribe App</h4>
                        <span className="text-indigo-600 font-medium">v{release.version}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                        {new Date(release.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {release.features && release.features.length > 0 && (
                      <div className="mt-3">
                         <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Features:</p>
                         <ul className="space-y-1">
                           {release.features.slice(0, 3).map((feature, fIdx) => (
                             <li key={fIdx} className="text-sm text-gray-600 flex items-start gap-2">
                               <span className="text-green-500">•</span>
                               <span className="line-clamp-1">{feature}</span>
                             </li>
                           ))}
                           {release.features.length > 3 && (
                             <li className="text-xs text-indigo-500 mt-1 ml-3">+ {release.features.length - 3} more</li>
                           )}
                         </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          handleDownload();
          setOpen(false);
        }}
        title={`Download SmartScribe v${latestAPK?.version || ""}?`}
      >
        <div className="text-center">
            <p className="text-gray-600 mb-4">You are about to download:</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h4 className="font-bold text-xl text-indigo-600">SmartScribe App</h4>
                <p className="text-gray-500 text-sm">Version: {latestAPK?.version}</p>
            </div>
            <p className="text-gray-500 text-sm">Do you want to proceed?</p>
        </div>
      </Modal>
    </>
  );
}