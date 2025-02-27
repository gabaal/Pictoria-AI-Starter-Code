import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const WEBHOOK_URL = process.env.SITE_URL ?? process.env.NGROK_HOST;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("The replicate API Token is not set");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorised",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const input = {
      fileKey: formData.get("fileKey") as string,
      modelName: formData.get("modelName") as string,
      gender: formData.get("gender") as string,
    };
    console.log("inputs for route: ", input);

    if (!input.fileKey || !input.modelName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileName = input.fileKey.replace("training_data/", "");
    const { data: fileUrl } = await supabaseAdmin.storage
      .from("training_data")
      .createSignedUrl(fileName, 3600);

    if (!fileUrl?.signedUrl) {
      throw new Error("Failed to get the file Url");
    }
    console.log("File URL: ", fileUrl);

    // Create replicate model

    const hardware = await replicate.hardware.list();
    console.log(hardware);

    const modelId = `${user.id}_${Date.now()}_${input.modelName
      .toLowerCase()
      .replaceAll(" ", "_")}`;
    console.log("Model ID: ", modelId);
    await replicate.models.create("gabaal", modelId, {
      visibility: "private",
      hardware: "gpu-l40s",
    });

    // Start training
    const training = await replicate.trainings.create(
      "ostris",
      "flux-dev-lora-trainer",
      "b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef",
      {
        // You need to create a model on Replicate that will be the destination for the trained version.
        destination: `gabaal/${modelId}`,
        input: {
          steps: 1000,
          resolution: "1024",
          input_images: fileUrl.signedUrl,
          trigger_word: "ohwx",
        },
        webhook: `${WEBHOOK_URL}/api/webhooks/training`,
        webhook_events_filter: ["completed"], // optional
      }
    );

    // add model data to supabase

    await supabaseAdmin.from("models").insert({
      model_id: modelId,
      user_id: user.id,
      model_name: input.modelName,
      gender: input.gender,
      training_status: training.status,
      trigger_word: "ohwx",
      training_steps: 1200,
      training_id: training.id,
    });

    // console.log("Training: ", training);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Training error: ", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to start the model training";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
