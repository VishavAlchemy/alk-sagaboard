import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storageId, fileName, companyId } = body;

    if (!storageId || !fileName || !companyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await convex.mutation(api.files.uploadFile, { storageId, fileName });
    
    // Update company with new image storageId
    await convex.mutation(api.companies.updateCompany, {
      companyId,
      storageId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering file:', error);
    return NextResponse.json(
      { error: 'Failed to register file' },
      { status: 500 }
    );
  }
} 