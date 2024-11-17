"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import { useVideoConverter } from "@/hooks/useVideoConverter";
import { useState } from "react";
import { bytesToMB } from "@/utils/fileSize";
import { ProgressBar } from "./ProgressBar";

export default function VideoUploader() {
  const { file, handleFileChange } = useFileUpload();
  const { convertToWebM, isConverting, progress } = useVideoConverter();
  const [convertedFile, setConvertedFile] = useState<File | null>(null);
  const isDisabled = !file?.name || isConverting;

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const convertedFile = await convertToWebM(file);
      setConvertedFile(convertedFile);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-4/5 max-w-[600px]">
      <div className="flex rounded-md w-full bg-neutral-900 border border-neutral-800">
        <label className="flex items-center justify-center px-4 py-2 border-r border-neutral-800 hover:bg-neutral-800 transition-colors duration-300 cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="video/mp4,video/quicktime,video/webm"
          />
          <p className="text-sm">Browse...</p>
        </label>
        <div className="flex items-center px-4 py-2">
          <p className="text-sm whitespace-nowrap">
            {file?.name ? file.name : ""}
          </p>
        </div>
      </div>

      {isConverting && <ProgressBar progress={progress} />}

      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`${
          isDisabled ? "bg-neutral-700" : "bg-neutral-100"
        } text-neutral-950 w-full rounded-md py-2 text-sm transition-colors duration-300`}
      >
        {isConverting ? "Converting..." : "Convert to WebM"}
      </button>

      {convertedFile && (
        <div className="flex flex-col">
          <p className="text-sm mb-2">Download Complete</p>

          <p className="text-sm">
            <span className="text-neutral-500">Original File Size:</span>{" "}
            {bytesToMB(file?.size as number)}
          </p>
          <p className="text-sm mb-2">
            <span className="text-neutral-500">Converted File Size:</span>{" "}
            {bytesToMB(convertedFile?.size as number)}
          </p>

          <a
            href={URL.createObjectURL(convertedFile)}
            download={convertedFile.name}
            className="text-sm text-blue-500 underline"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}
