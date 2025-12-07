import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/mainlogo.png"        // your logo path
                alt="SmartScribe Logo"
                width={40}
                height={40}
                className="object-contain"
              />
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
              href="/contactUS"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SmartScribe — Built with passion by 
            <span className="text-white font-semibold"> Adan Fatima</span>, 
            <span className="text-white font-semibold"> Imaan Adrees</span> &
            <span className="text-white font-semibold"> Maria Zaman</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
