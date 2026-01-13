"use client";

import { useState } from "react";
import Image from "next/image";

export default function AuthenticationPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Dummy handler for now, replace with Excel check logic
  const handleVerify = async () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate Excel check: only '010050' is valid
      if (code === "010050") {
        setResult("Code is valid and product is authentic.");
      } else {
        setResult("Invalid or already used code.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 sm:px-8 md:px-12 lg:px-12 xl:px-12 2xl:px-48 py-12">
        <h1 className="text-6xl font-extrabold text-gray-900 text-center mb-12">Authentication</h1>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow border">
            <div className="font-bold text-base md:text-lg mb-1">Scan the QR code</div>
            <div className="text-xs text-gray-700 mb-4">Scan the QR code on the back of the package</div>
            <img src="/step1.webp" alt="Step 1" className="w-full max-w-xs rounded-lg" />
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow border">
            <div className="font-bold text-base md:text-lg mb-1">Enter verification code</div>
            <div className="text-xs text-gray-700 mb-4">Scratch the QR code and enter the code in the box to check whether the product is verified or not</div>
            <img src="/step2.webp" alt="Step 2" className="w-full max-w-xs rounded-lg" />
          </div>
        </div>
        {/* Important Notice and Form */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 bg-black text-white rounded-2xl p-6 flex flex-col justify-center items-start min-w-[260px]">
            <div className="font-bold text-lg mb-2">IMPORTANT</div>
            <div className="text-xs mb-1">Each code can only be used <span className="font-bold">ONCE</span>.</div>
            <div className="text-xs">Once a code is verified and used, it <span className="text-red-500 font-bold">CANNOT BE VERIFIED AGAIN.</span></div>
          </div>
          <div className="flex-1 flex flex-col gap-4 justify-center">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="ENTER CODE"
              className="w-full bg-black text-white text-center text-lg tracking-widest rounded-2xl py-4 px-6 font-mono border-4 border-transparent outline-none placeholder-gray-400 mb-2 focus:bg-white focus:text-gray-900 focus:border-black"
              maxLength={12}
              style={{ letterSpacing: '0.2em' }}
            />
            <button
              onClick={handleVerify}
              disabled={loading || !code}
              className="w-full border-2 border-black text-black text-lg font-bold rounded-2xl py-4 px-6 bg-white hover:bg-black hover:text-white transition-colors duration-200"
            >
              {loading ? 'VERIFYING...' : 'VERIFY CODE'}
            </button>
            {result && (
              <div className={`mt-2 text-center text-lg font-bold ${result.includes('valid') ? 'text-green-600' : 'text-red-500'}`}>{result}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
