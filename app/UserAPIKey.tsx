"use client";

import { useEffect, useState } from "react";

export function UserAPIKey() {
  const [userAPIKey, setUserAPIKey] = useState(() => {
    // Only run in browser
    if (typeof window !== "undefined") {
      return localStorage.getItem("katonaiApiKey") || "";
    }
    return "";
  });

  useEffect(() => {
    if (userAPIKey) {
      localStorage.setItem("katonaiApiKey", userAPIKey);
    } else {
      localStorage.removeItem("katonaiApiKey");
    }
  }, [userAPIKey]);

  return (
    <div className="flex gap-3">
      <div className="text-left text-xs max-md:hidden">
        <p className="text-gray-600">[必需] 添加您的</p>
        <a
          href="https://api.katonai.dev/settings/api-keys"
          target="_blank"
          className="text-gray-300 underline"
        >
          KatonAI API 密钥:
        </a>
      </div>
      <input
        type="password"
        value={userAPIKey}
        autoComplete="off"
        onChange={(e) => setUserAPIKey(e.target.value)}
        placeholder="API 密钥"
        className="h-8 rounded border-[0.5px] border-gray-700 bg-gray-900 px-2 text-sm focus-visible:outline focus-visible:outline-gray-200"
      />
    </div>
  );
}
