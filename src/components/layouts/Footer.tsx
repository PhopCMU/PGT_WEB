import { useState } from "react";
import { Policy } from "../Policys";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto hidden sm:block">
      <Policy isOpen={showPolicy} onClose={() => setShowPolicy(false)} />
      <div className="px-4 py-3">
        <div className="w-full mx-auto">
          {/* Main Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="font-bold text-gray-900">
                  Postgraduate Education Center
                </span>
              </div>
            </div>

            {/* Center Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <p className="text-sm text-gray-600">
                © {currentYear} PGT CMU. สงวนลิขสิทธิ์.
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={() => setShowPolicy(true)}
                className="text-blue-400 hover:text-blue-300 font-medium 
                 hover:underline transition-colors duration-300 
                 relative after:absolute after:left-0 after:-bottom-0.5 
                 after:w-0 after:h-0.5 after:bg-blue-400 
                 hover:after:w-full after:transition-all after:duration-300"
              >
                Terms of Service and Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
