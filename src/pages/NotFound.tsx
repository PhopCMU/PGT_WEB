import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Terminal,
  FileText,
  Code,
  Shield,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
          {/* Header */}
          <div className="bg-linear-to-r from-gray-800 to-gray-900 text-white p-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-bold">404 - Resource Not Found</h1>
                <p className="text-gray-300 text-sm">HTTP Status Code</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Error Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Client Error</span>
              </div>
              <p className="text-gray-600">
                The server cannot find the requested resource. This response is
                cacheable unless otherwise indicated.
              </p>
            </div>

            {/* Technical Details */}
            <div className="mb-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Code className="w-4 h-4" />
                {showDetails
                  ? "Hide Technical Details"
                  : "Show Technical Details"}
              </button>

              {showDetails && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-mono text-sm space-y-2">
                    <div>
                      <span className="text-blue-600">Status:</span> 404 Not
                      Found
                    </div>
                    <div>
                      <span className="text-blue-600">Method:</span> GET
                    </div>
                    <div>
                      <span className="text-blue-600">Path:</span>{" "}
                      {window.location.pathname}
                    </div>
                    <div>
                      <span className="text-blue-600">Timestamp:</span>{" "}
                      {new Date().toISOString()}
                    </div>
                    <div>
                      <span className="text-blue-600">User-Agent:</span>{" "}
                      {navigator.userAgent.substring(0, 50)}...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Actions */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-900">
                Recommended Actions:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Home className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Homepage</div>
                    <div className="text-xs text-blue-600">
                      Return to main dashboard
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/sign-in")}
                  className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Sign In</div>
                    <div className="text-xs text-gray-600">
                      Return to authentication
                    </div>
                  </div>
                </button>
              </div>

              {/* Documentation */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>For more information, refer to the </span>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    HTTP 404 documentation
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                PGT CMU Platform • HTTP/1.1 404 Not Found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
