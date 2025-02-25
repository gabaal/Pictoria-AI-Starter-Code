"use server";

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: unknown | null;
}

export async function generateImage(input): ImageResponse {}
