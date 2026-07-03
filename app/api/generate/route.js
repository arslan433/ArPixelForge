import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const url = "https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_IMAGE_KEY ,
        "x-rapidapi-host": "ai-text-to-image-generator-flux-free-api.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        style_id: 4,
        size: "1-1",
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `API error status: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
