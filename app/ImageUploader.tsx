import clsx from "clsx";
import { useRef, useState, useTransition } from "react";
import Spinner from "./Spinner";

// 自定义 hook 来处理 R2 上传
function useR2Upload() {
  const uploadToR2 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/s3-upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("上传失败");
    }

    return await response.json();
  };

  return { uploadToR2 };
}

// 获取图片信息的函数
function getImageData(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUploader({
  onUpload,
}: {
  onUpload: ({
    url,
    width,
    height,
  }: {
    url: string;
    width: number;
    height: number;
  }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadToR2 } = useR2Upload();
  const [pending, startTransition] = useTransition();

  async function handleUpload(file: File) {
    startTransition(async () => {
      try {
        const [result, data] = await Promise.all([
          uploadToR2(file),
          getImageData(file),
        ]);

        console.log(result.url);
        console.log(data);

        onUpload({
          url: result.url,
          width: data.width ?? 1024,
          height: data.height ?? 768,
        });
      } catch (error) {
        console.error("上传失败:", error);
        // 可以在这里添加错误处理，比如显示错误提示
      }
    });
  }

  return (
    <button
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const data = e.dataTransfer;
        const file = data?.files?.[0];
        if (file) {
          handleUpload(file);
        }
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onClick={() => {
        fileInputRef.current?.click();
      }}
      className={clsx(
        isDragging && "text-gray-400",
        !isDragging && !pending && "text-gray-700 hover:text-gray-400",
        "relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-gray-900 focus-visible:text-gray-400 focus-visible:outline-none",
      )}
    >
      <svg
        className={clsx("absolute inset-0 transition-colors")}
        viewBox="0 0 400 300"
      >
        <rect
          x=".5"
          y=".5"
          width="399"
          height="299"
          rx="6"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8,10"
        />
      </svg>

      {!pending ? (
        <>
          <div className="flex grow flex-col justify-center">
            <p className="text-xl text-white">拖放图片</p>
            <p className="mt-1 text-gray-500">或点击上传</p>
          </div>

          <div className="pb-3">
            <p className="text-sm text-gray-500">
              Powered by <span className="text-white">KatonAI</span>
            </p>
          </div>
        </>
      ) : (
        <div className="text-white">
          <Spinner />
          <p className="mt-2 text-lg">上传中...</p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleUpload(file);
          }
        }}
        ref={fileInputRef}
      />
    </button>
  );
}
