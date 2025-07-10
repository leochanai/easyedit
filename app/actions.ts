/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAdjustedDimensions } from "@/lib/get-adjusted-dimentions";
import { z } from "zod";
import { fal } from "@fal-ai/client";

const schema = z.object({
  imageUrl: z.string(),
  prompt: z.string(),
  width: z.number(),
  height: z.number(),
  userAPIKey: z.string().nullable(),
  model: z
    .enum(["flux-pro/kontext"])
    .default("flux-pro/kontext"),
});

export async function generateImage(
  unsafeData: z.infer<typeof schema>,
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const { imageUrl, prompt, width, height, userAPIKey } =
    schema.parse(unsafeData);

  // 强制要求用户提供 API 密钥
  if (!userAPIKey) {
    return {
      success: false,
      error: "此版本需要 fal.ai API 密钥。请添加您的 API 密钥。",
    };
  }

  // 配置 fal.ai 客户端
  fal.config({
    credentials: userAPIKey,
  });

  const adjustedDimensions = getAdjustedDimensions(width, height);

  try {
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        width: adjustedDimensions.width,
        height: adjustedDimensions.height,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    if (result.data?.image?.url) {
      return { success: true, url: result.data.image.url };
    } else {
      return {
        success: false,
        error: "无法生成图片。请重试。",
      };
    }
  } catch (e: any) {
    if (e.message?.includes("403") || e.message?.includes("unauthorized")) {
      return {
        success: false,
        error: "您需要付费的 fal.ai 账户才能使用此模型。请通过购买积分升级。",
      };
    }

    return {
      success: false,
      error: `请求失败: ${e.message}`,
    };
  }
}
