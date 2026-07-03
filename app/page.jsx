"use client";
import { useState } from "react";
import ImageDownload from '@/components/ImageDownload'

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImages([]);
    setMessage(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt }),
      });
      
      const result = await response.json();
      console.log("API Raw Response:", result); // Console check karein

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch");
      }

      // --- MASTER EXTRACTOR LOGIC ---
      let targetArray = [];

      if (result.results && Array.isArray(result.results)) {
        targetArray = result.results;
      } else if (result.final_result && Array.isArray(result.final_result)) {
        targetArray = result.final_result; 
      } else if (result.data && Array.isArray(result.data)) {
        targetArray = result.data;
      } else if (result.data?.results && Array.isArray(result.data.results)) {
        targetArray = result.data.results;
      } else if (Array.isArray(result)) {
        targetArray = result;
      } else if (typeof result === 'object' && (result.origin || result.url || result.thumb)) {
        targetArray = [result];
      }

      console.log("Found Image List:", targetArray);

      // Clean URLs extract karein
      const imgs = targetArray
        .map((item) => item.origin || item.url || item.thumb || (typeof item === 'string' ? item : null))
        .filter(Boolean); // Null values hatayein

      if (imgs.length > 0) {
        setImages(imgs);
        setMessage("success");
      } else {
        console.warn("Extraction Failed. Keys found:", Object.keys(result));
        setMessage("No images found in response.");
      }

    } catch (error) {
      console.error("Error:", error);
      setMessage("failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4" style={{ backgroundImage: "url('/bg.webp')" }}>
      <h1 className="text-4xl font-bold mb-6">Pixel Forge</h1>

      <div className="flex gap-2 w-full max-w-xl">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-white"
        />
        <button
          onClick={generateImage}
          disabled={loading}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-gray-600 animate-pulse">Generating image...</p>
      )}
      
      {message && (
        <div className="mt-6 w-full max-w-xl text-center">
          <p className={`text-sm font-semibold p-2 rounded ${message === "success" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}>
            Status: {message}
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-10 w-full max-w-5xl">
          <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow">Results:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={i} className="bg-white shadow-md rounded-lg overflow-hidden border">
                <img
                  src={img}
                  alt={`Generated ${i}`}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    console.log("Image load fail, using fallback");
                    e.currentTarget.src = "https://pub-static.aiease.ai/cf/2026/07/04/origin/aiease_art_v1_816b0e87-fcb4-414a-ada3-9a08b5178aad_1.webp"; // Using your working link as default asset
                  }}
                />
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Image {i + 1}</span>
                  <ImageDownload img={img} i={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="text-slate-100 py-16 px-6 mt-12 bg-slate-900/80 backdrop-blur rounded-xl max-w-5xl w-full">
        <div>
          <h2 className="text-4xl font-bold text-cyan-400 mb-6">About This Project</h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="font-semibold">ArPixelForge</span> is a modern <span className="font-semibold">AI powered Text-to-Image Generator</span> built with <span className="font-semibold">Next.js, TailwindCSS, and RapidAPI</span>.
          </p>
          <h3 className="text-2xl font-semibold text-amber-400 mb-3">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 mb-8">
            <li>Prompt-based Image Generation</li>
            <li>Multiple Results for each prompt</li>
            <li>Responsive UI with TailwindCSS</li>
            <li>Download Option for generated images</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
