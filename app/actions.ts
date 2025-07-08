/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAdjustedDimensions } from "@/lib/get-adjusted-dimentions";
import { z } from "zod";

const schema = z.object({
  imageUrl: z.string(),
  prompt: z.string(),
  width: z.number(),
  height: z.number(),
  userAPIKey: z.string().nullable(),
  model: z
    .enum(["flux-kontext-pro", "flux-kontext-max"])
    .default("flux-kontext-pro"),
});

export async function generateImage(
  unsafeData: z.infer<typeof schema>,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const { imageUrl, prompt, width, height, userAPIKey, model } =
    schema.parse(unsafeData);

  const baseUrl = process.env.BASE_URL || "https://api.katonai.com";

  // 强制要求用户提供 API 密钥
  if (!userAPIKey) {
    return {
      success: false,
      error: "此版本需要 KatonAI API 密钥。请添加您的 API 密钥。",
    };
  }

  const apiKey = userAPIKey;

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
            "您需要付费的 KatonAI 账户才能使用此模型。请通过购买积分升级。",
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
        error: "您需要付费的 KatonAI 账户才能使用此模型。请通过购买积分升级。",
      };
    }
  }

  if (url) {
    return { success: true, url };
  } else {
    return {
      success: false,
      error: "无法生成图片。请重试。",
    };
  }
}
