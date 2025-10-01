"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function GamePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    // Load API key from environment
    const key = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "";
    setApiKey(key);

    console.log('API Key loaded:', key ? 'Available' : 'Missing');

    // Send API key to iframe
    const sendApiKey = () => {
      const iframe = document.getElementById('navada-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        console.log('Sending API key to iframe');
        iframe.contentWindow.postMessage({
          type: 'SET_API_KEY',
          apiKey: key
        }, '*');
      }
    };

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      console.log('Message received from iframe:', event.data);

      if (event.data.type === 'REQUEST_API_KEY') {
        console.log('API key requested by iframe');
        sendApiKey();
      }

      // Listen for API errors from iframe
      if (event.data.type === 'API_ERROR') {
        console.error('API Error in iframe:', event.data.error);
        alert('API Error: ' + event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);

    // Send API key after delays to ensure iframe is ready
    const timer1 = setTimeout(() => sendApiKey(), 500);
    const timer2 = setTimeout(() => sendApiKey(), 1000);
    const timer3 = setTimeout(() => sendApiKey(), 2000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <h1 className="text-2xl font-bold text-white">NAVADA</h1>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white hover:bg-gray-800 transition-all duration-200 hover:scale-105 p-3 rounded-lg min-w-12 min-h-12 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="transition-transform duration-200">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200">
                Solutions
              </Link>
              <Link href="/blog" className="text-white hover:text-purple-400 transition-all duration-200">
                PoC
              </Link>
              <Link href="/game" className="text-purple-400 font-semibold transition-all duration-200">
                Game
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile navigation */}
          <div className={`md:hidden mt-4 pb-4 border-t border-gray-800 pt-4 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-1">
              <Link href="/solutions" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Solutions
              </Link>
              <Link href="/blog" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                PoC
              </Link>
              <Link href="/game" className="text-purple-400 font-semibold transition-all duration-200 py-3 px-2 rounded-lg bg-gray-800/50 min-h-12 flex items-center">
                Game
              </Link>
              <Link href="/about" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                About
              </Link>
              <Link href="/agent-lee" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Agent Lee
              </Link>
              <Link href="/contact" className="text-white hover:text-purple-400 transition-all duration-200 py-3 px-2 rounded-lg hover:bg-gray-800/50 min-h-12 flex items-center">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          NAVADA AI Studio
        </h1>

        <div className="max-w-6xl mx-auto space-y-8 pb-safe">
          <article className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-400">
              Interactive AI Game
            </h2>

            <div className="w-full min-h-[500px] md:min-h-[800px]">
              <iframe
                id="navada-iframe"
                src="/navada-game.html"
                title="NAVADA AI Studio"
                className="w-full h-[500px] md:h-[800px] rounded-lg border border-gray-600"
                style={{ border: 'none' }}
                allow="clipboard-write"
                allowFullScreen
                onLoad={() => {
                  console.log('Iframe loaded, sending API key');
                  const iframe = document.getElementById('navada-iframe') as HTMLIFrameElement;
                  if (iframe && iframe.contentWindow) {
                    setTimeout(() => {
                      iframe.contentWindow?.postMessage({
                        type: 'SET_API_KEY',
                        apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || ""
                      }, '*');
                    }, 100);
                  }
                }}
              />
            </div>
          </article>

          <article className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 md:p-8 mb-8 border border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-blue-400">
              Character Design
            </h2>

            <div className="w-full min-h-[500px] md:min-h-[800px]">
              <iframe
                src="https://my.spline.design/characterdesign-Ogwx7EasOilAUxhZ2wEzTIh4/"
                title="Character Design"
                className="w-full h-[500px] md:h-[800px] rounded-lg border border-gray-600"
                style={{ border: 'none' }}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
