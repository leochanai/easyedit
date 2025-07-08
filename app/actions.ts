/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAdjustedDimensions } from "@/lib/get-adjusted-dimentions";
import { getIPAddress, getRateLimiter } from "@/lib/rate-limiter";
import { z } from "zod";

const ratelimit = getRateLimiter();

const schema = z.object({
  imageUrl: z.string(),
  prompt: z.string(),
  width: z.number(),
  height: z.number(),
  userAPIKey: z.string().nullable(),
  model: z
    .enum(["flux-kontext-dev", "flux-kontext-pro"])
    .default("flux-kontext-dev"),
});

export async function generateImage(
  unsafeData: z.infer<typeof schema>,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const { imageUrl, prompt, width, height, userAPIKey, model } =
    schema.parse(unsafeData);

  if (ratelimit && !userAPIKey) {
    const ipAddress = await getIPAddress();

    const { success } = await ratelimit.limit(ipAddress);
    if (!success) {
      return {
        success: false,
        error:
          "No requests left. Please add your own API key or try again in 24h.",
      };
    }
  }

  const baseUrl = process.env.BASE_URL || "https://api.katonai.com";
  const apiKey = userAPIKey || process.env.API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: "API key is required. Please add your API key.",
    };
  }

  const adjustedDimensions = getAdjustedDimensions(width, height);

  // 将 image_url 拼接在 prompt 最开始
  const fullPrompt = `${imageUrl} ${prompt}`;

  let url;
  try {
    const response = await fetch(`${baseUrl}/v1/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: fullPrompt,
        width: adjustedDimensions.width,
        height: adjustedDimensions.height,
        n: 1,
      }),
    });

    if (!response.ok) {
      if (response.status === 403) {
        return {
          success: false,
          error:
            "You need a paid KatonAI account to use this model. Please upgrade by purchasing credits.",
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    url = json.data[0].url;
  } catch (e: any) {
    console.log(e);
    if (e.toString().includes("403")) {
      return {
        success: false,
        error:
          "You need a paid KatonAI account to use this model. Please upgrade by purchasing credits.",
      };
    }
  }

  if (url) {
    return { success: true, url };
  } else {
    return {
      success: false,
      error: "Image could not be generated. Please try again.",
    };
  }
}
