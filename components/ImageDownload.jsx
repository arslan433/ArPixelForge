"use client";

const handleDownload = async (url, filename) => {
  try {
    const res = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Failed to fetch image");

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download error:", err);
  }
};

export default function ImageCard({ img, i }) {
  return (
    <button
      onClick={() => handleDownload(img, `arpixelforge_${i + 1}.png`)}
      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
    >
      Download
    </button>
  );
}
