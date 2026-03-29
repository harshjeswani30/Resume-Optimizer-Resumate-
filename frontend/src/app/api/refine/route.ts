import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const jobId = formData.get('job_id');
    console.log("NEXT_JS_PROXY: Received refinement request for Job ID:", jobId);
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log("NEXT_JS_PROXY: Forwarding to:", `${backendUrl}/api/refine-to-one-page`);
    
    // Forward to the refactored refinement API endpoint
    const response = await fetch(`${backendUrl}/api/refine-to-one-page`, {
      method: 'POST',
      body: formData,
    });
    
    console.log("NEXT_JS_PROXY: Backend response status:", response.status);
    
    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
