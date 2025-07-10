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
  console.log("=== 开始图片生成 ===");
  console.log("原始数据:", unsafeData);
  
  const { imageUrl, prompt, width, height, userAPIKey } =
    schema.parse(unsafeData);

  console.log("解析后的数据:", { imageUrl, prompt, width, height, userAPIKey: userAPIKey ? "已提供" : "未提供" });

  // 强制要求用户提供 API 密钥
  if (!userAPIKey) {
    console.log("错误: 缺少 API 密钥");
    return {
      success: false,
      error: "此版本需要 fal.ai API 密钥。请添加您的 API 密钥。",
    };
  }

  // 配置 fal.ai 客户端
  console.log("配置 fal.ai 客户端");
  fal.config({
    credentials: userAPIKey,
  });

  const adjustedDimensions = getAdjustedDimensions(width, height);
  console.log("调整后的尺寸:", adjustedDimensions);

  try {
    console.log("准备调用 fal.ai API");
    const requestInput = {
      prompt: prompt,
      image_url: imageUrl,
      width: adjustedDimensions.width,
      height: adjustedDimensions.height,
    };
    console.log("请求参数:", requestInput);
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
      input: requestInput,
      logs: true,
      onQueueUpdate: (update) => {
        console.log("队列更新:", update.status);
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("fal.ai API 响应:", result);
    console.log("响应数据结构:", JSON.stringify(result.data, null, 2));

    if (result.data?.images?.[0]?.url) {
      console.log("图片生成成功, URL:", result.data.images[0].url);
      console.log("=== 图片生成结束 ===");
      return { success: true, url: result.data.images[0].url };
    } else {
      console.log("图片生成失败: 响应中没有图片URL");
      console.log("期望的结构: result.data.images[0].url");
      console.log("=== 图片生成结束 ===");
      return {
        success: false,
        error: "无法生成图片。请重试。",
      };
    }
  } catch (e: any) {
    console.log("=== 图片生成异常 ===");
    console.log("错误类型:", e.constructor.name);
    console.log("错误信息:", e.message);
    console.log("错误堆栈:", e.stack);
    console.log("完整错误对象:", e);
    console.log("========================");
    
    if (e.message?.includes("403") || e.message?.includes("unauthorized")) {
      return {
        success: false,
        error: "您需要付费的 fal.ai 账户才能使用此模型。请通过购买积分升级。",
      };
    }

    console.log("=== 图片生成结束 ===");
    return {
      success: false,
      error: `请求失败: ${e.message}`,
    };
  }
}
