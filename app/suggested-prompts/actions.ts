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

  const baseUrl = process.env.BASE_URL || "https://api.katonai.com";

  // 强制要求用户提供 API 密钥
  if (!userAPIKey) {
    return [];
  }

  const apiKey = userAPIKey;

  try {
    const requestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: dedent`
            # General Instructions
              You will be shown an image that a user wants to edit using AI-powered prompting. Analyze the image and suggest exactly 3 simple, practical edits that would improve or meaningfully change the image. Each suggestion should be:

            - Specific and actionable (not vague)
            - Achievable with standard image editing AI
            - Varied in type (e.g., lighting, objects, style, composition)

            Please keep the suggestions short and concise, about 5-8 words each.

            Format your response as valid JSON with this structure:
              [
                "specific description of edit 1",
                "specific description of edit 2",
                "specific description of edit 3"
              ]

            Provide only the JSON response, no additional text.

            # Additional Context

            Here's some additional information about the image model that will be used to edit the image based on the prompt:

            With FLUX.1 Kontext you can modify an input image via simple text instructions, enabling flexible and instant image editing - no need for finetuning or complex editing workflows. The core capabilities of the the FLUX.1 Kontext suite are:

            - Character consistency: Preserve unique elements of an image, such as a reference character or object in a picture, across multiple scenes and environments.
            - Local editing: Make targeted modifications of specific elements in an image without affecting the rest.
            - Style Reference: Generate novel scenes while preserving unique styles from a reference image, directed by text prompts.
            - Interactive Speed: Minimal latency for both image generation and editing.
            - Iterate: modify step by step

            Flux.1 Kontext allows you to iteratively add more instructions and build on previous edits, refining your creation step-by-step with minimal latency, while preserving image quality and character consistency.

            # Final instructions.

            ONLY RESPOND IN JSON. NOTHING ELSE.
              `,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      // response_format: { type: "json_schema", schema: jsonSchema },
    };

    console.log("=== 建议提示 API 请求信息 ===");
    console.log("URL:", `${baseUrl}/v1/chat/completions`);
    console.log("图片 URL:", imageUrl);
    console.log("模型:", requestBody.model);
    console.log("============================");

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("=== 建议提示 API 响应信息 ===");
    console.log("状态码:", response.status);
    console.log("状态文本:", response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("错误响应内容:", errorText);
      console.log("============================");
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`,
      );
    }

    const responseData = await response.json();
    console.log("成功响应内容:", JSON.stringify(responseData, null, 2));
    console.log("============================");

    if (!responseData?.choices?.[0]?.message?.content) {
      console.log("=== 解析失败 ===");
      console.log("响应中缺少 choices[0].message.content");
      console.log("===============");
      return [];
    }

    const json = JSON.parse(responseData?.choices?.[0]?.message?.content);
    const result = schema.safeParse(json);

    if (result.error) {
      console.log("=== 验证失败 ===");
      console.log("解析的 JSON:", json);
      console.log("验证错误:", result.error);
      console.log("===============");
      return [];
    }

    console.log("=== 建议提示生成成功 ===");
    console.log("生成的建议:", result.data);
    console.log("======================");
    return result.data;
  } catch (error) {
    console.log("=== 建议提示 API 请求异常 ===");
    console.log("错误信息:", error instanceof Error ? error.message : error);
    console.log(
      "错误堆栈:",
      error instanceof Error ? error.stack : "无堆栈信息",
    );
    console.log("============================");
    return [];
  }
}
