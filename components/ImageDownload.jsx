export default function ImageDownload({ img, i }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(img)}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `pixel-forge-${i + 1}`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Could not process download.");
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="px-3 py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-600 transition"
    >
      Download
    </button>
  );
}
