import Image from "next/image";

const sampleImages = [
  {
    url: "/image1.webp",
    height: 1752,
    width: 986,
  },
  {
    url: "/image2.webp",
    height: 1365,
    width: 2048,
  },
  {
    url: "/image3.webp",
    width: 1408,
    height: 792,
  },
];

export function SampleImages({
  onSelect,
}: {
  onSelect: ({
    url,
    width,
    height,
  }: {
    url: string;
    width: number;
    height: number;
  }) => void;
}) {
  return (
    <div className="rounded-xl bg-gray-900 p-4">
      <p className="text-gray-500">
        没有要上传的图片？ <span className="text-gray-300">试试示例图片：</span>
      </p>
      <div className="mt-3 flex gap-4 overflow-x-auto max-md:-mx-4 max-md:px-4 max-md:pb-4">
        {sampleImages.map((sample) => (
          <button
            key={sample.url}
            className="group relative shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-700"
            onClick={() => {
              onSelect({
                url: sample.url,
                width: sample.width,
                height: sample.height,
              });
            }}
          >
            <Image
              src={sample.url}
              width={sample.width}
              height={sample.height}
              alt=""
              className="aspect-[4/3] w-[110px] object-contain"
            />

            <div className="absolute inset-px rounded-lg ring-1 ring-white/5 group-hover:ring-white/15" />
          </button>
        ))}
      </div>
    </div>
  );
}
