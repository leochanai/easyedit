"use server";

import dedent from "dedent";
import invariant from "tiny-invariant";
import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";

const schema = z.array(z.string());
// const jsonSchema = zodToJsonSchema(schema, { target: "openAi" });

export async function getSuggestions(
  imageUrl: string,
  userAPIKey: string | null,
) {
  invariant(typeof imageUrl === "string");

  // 暂时禁用建议提示功能，因为 fal.ai 主要专注于图像生成
  // 如果需要此功能，需要集成额外的文本生成 API（如 OpenAI）
  console.log("=== 建议提示功能已禁用 ===");
  console.log("图片 URL:", imageUrl);
  console.log("原因: fal.ai 不支持文本生成，需要额外的文本生成 API");
  console.log("============================");
  
  return [];
}
