import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");
  
  if (!imageUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      }
    });

    if (!response.ok) throw new Error("Source image fetch failed");

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/webp";

    let extension = "webp";
    if (contentType.includes("png")) extension = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) extension = "jpg";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", blob.size.toString());
    headers.set("Content-Disposition", `attachment; filename=pixel-forge-art.${extension}`);

    return new Response(blob, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error("Download Proxy Error:", error);
    return NextResponse.json({ error: "Failed to download clean image" }, { status: 500 });
  }
}
