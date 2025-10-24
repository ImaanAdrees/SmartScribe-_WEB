export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="font-bold text-xl">SmartScribe</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered meeting notes that help you focus on what matters most.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
            <p className="text-gray-400 text-sm mb-4">
              Have questions? We'd love to hear from you.
            </p>
            <a 
              href="mailto:contact@smartscribe.com" 
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SmartScribe — Built with passion by <span className="text-white font-semibold">Adan Fatima</span>, <span className="text-white font-semibold">Imaan Adrees</span> & <span className="text-white font-semibold">Maria Zaman</span>
          </p>
        </div>
      </div>
    </footer>
  );
}