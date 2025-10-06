"use client";
import { useState } from "react";
import ImageDownload from '@/components/ImageDownload'

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImages([]);

    const url =
      "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php";

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "4b7c6d58fbmshe4fa6c2cf4656b5p1cf76djsn3c6c2ded85c6",
        "x-rapidapi-host":
          "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        style_id: 4,
        size: "1-1",
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("API Response:", result);
      const imgs = result?.result?.data?.results?.map((item: any) => item.thumb) || [];
      setImages(imgs);
    } catch (error) {
      console.error("Error:", error);
      alert("Image generation failed.");
    }

    setLoading(false);
  };

  const handleDownload = (url: any) => {
    const link = document.createElement("a");
    link.href = `/api/download?url=${encodeURIComponent(url)}`;
    link.setAttribute("download", "ai_image.png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4" style={{ backgroundImage: "url('/bg.webp')" }}>
      <h1 className="text-4xl font-bold mb-6">Ar Pixel Forge</h1>

      <div className="flex gap-2 w-full max-w-xl">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <button
          onClick={generateImage}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Generate
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-gray-600 animate-pulse">Generating image...</p>
      )}

      {images.length > 0 && (
        <div className="mt-10 w-full max-w-5xl">
          <h3 className="text-2xl font-semibold mb-4">Results:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-lg overflow-hidden border"
              >
                <img
                  src={img}
                  alt={`Generated ${i}`}
                  className="w-full h-64 object-cover"
                  onError={(e) => (e.currentTarget.src = "/fallback.png")}
                />
                <div className="p-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Image {i + 1}
                  </span>
                  <ImageDownload key={i} img={img} i={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <section className=" text-slate-100 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-can-400 mb-6">
            About This Project
          </h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="font-semibold">ArPixelForge</span> is a modern
            <span className="font-semibold"> AI powered Text-to-Image Generator</span>
            built with <span className="font-semibold">Next.js, TailwindCSS, and RapidAPI</span>.
            The project transforms simple text prompts into unique, high-quality images using advanced AI models.
            Designed with a clean and responsive UI, it provides a smooth user experience for experimenting with
            creative ideas and generating visuals instantly.<br /> But i am using free version so its limited.
          </p>

          <h3 className="text-2xl font-semibold text--400 mb-3">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 mb-8">
            <li>Prompt-based Image Generation</li>
            <li>Multiple Results for each prompt</li>
            <li>Responsive UI with TailwindCSS</li>
            <li>Download Option for generated images</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3">Tech Stack</h3>
          <ul className="list-disc list-inside space-y-2 mb-8">
            <li><span className="font-semibold">Frontend:</span> Next.js (React Framework)</li>
            <li><span className="font-semibold">Styling:</span> TailwindCSS</li>
            <li><span className="font-semibold">API Integration:</span> RapidAPI (AI Text-to-Image Generator)</li>
            <li><span className="font-semibold">Deployment:</span> Vercel</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3">Purpose</h3>
          <p className="text-lg leading-relaxed">
            This project demonstrates how <span className="font-semibold">AI APIs can be integrated into modern web apps</span>
            to create real-world tools. It also serves as a <span className="font-semibold">portfolio highlight</span>
            for showcasing skills in API integration, scalable Next.js architecture, UI/UX design, and branding.
          </p>
        </div>
      </section>

    </div>
  );
}
