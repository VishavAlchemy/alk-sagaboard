import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UploadResult {
  companyImageUrl: string;
  storageId: string;
}

// Create a Convex HTTP client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function uploadCompanyImage({
  file,
  companyId,
}: {
  file: File;
  companyId: Id<"companies">;
}): Promise<UploadResult> {
  try {
    // 1. Get the upload URL from Convex
    const uploadUrl = await convex.mutation(api.files.generateUploadUrl, {});

    if (!uploadUrl) {
      throw new Error('Failed to get upload URL');
    }

    // 2. Upload the file to the URL
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!result.ok) {
      throw new Error(`Failed to upload file: ${result.statusText}`);
    }

    // 3. Get the storageId from the response
    const { storageId } = await result.json();
    
    if (!storageId) {
      throw new Error('Failed to get storage ID from response');
    }

    // 4. Register the file in the database using Convex mutation
    await convex.mutation(api.files.uploadFile, {
      storageId,
      fileName: file.name,
    });

    // 5. Get the URL for the uploaded image using Convex query
    const companyImageUrl = await convex.query(api.getStorageUrl.default, { storageId });

    if (!companyImageUrl) {
      throw new Error('Failed to get storage URL');
    }

    // 6. Update the company record with the new image
    const company = await convex.query(api.companies.getCompany, { companyId });
    if (!company || Array.isArray(company)) {
      throw new Error('Company not found');
    }

    // Delete old image if it exists
    if (company.storageId) {
      try {
        await convex.mutation(api.files.deleteFile, { storageId: company.storageId });
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    // Update company with new image
    await convex.mutation(api.companies.updateCompany, {
      companyId,
      name: company.name,
      role: company.role,
      location: company.location,
      image: companyImageUrl,
      storageId,
      color: company.color,
      type: company.type || '',
      description: company.description || '',
      socialLinks: company.socialLinks,
      vision: company.vision,
      mission: company.mission,
      principles: company.principles,
      values: company.values,
    });

    return {
      companyImageUrl,
      storageId,
    };
  } catch (error) {
    console.error('Error in uploadCompanyImage:', error);
    throw error;
  }
} 