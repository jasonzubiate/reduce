import { useState } from "react";
import { convertToWebMFileName } from "@/utils/fileName";

interface UseVideoConverter {
  convertToWebM: (file: File) => Promise<File>;
  isConverting: boolean;
  error: string | null;
  progress: number;
}

export const useVideoConverter = (): UseVideoConverter => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const convertToWebM = async (file: File): Promise<File> => {
    setIsConverting(true);
    setError(null);
    setProgress(0);

    try {
      // Create video element
      const video = document.createElement("video");
      video.muted = true;
      const mediaSource = URL.createObjectURL(file);
      video.src = mediaSource;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(null);
        video.load();
      });

      // Set canvas dimensions to match video
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;

      // Create MediaRecorder with appropriate settings
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8",
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms

      // Draw frames to canvas
      const drawFrame = () => {
        if (video.ended || video.paused) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Update progress
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(Math.round(progressPercent));

        requestAnimationFrame(drawFrame);
      };

      // Create promise to handle conversion completion
      const convertedFile = new Promise<File>((resolve) => {
        video.onended = () => {
          mediaRecorder.stop();
          setTimeout(() => {
            const webmBlob = new Blob(chunks, { type: "video/webm" });
            const newFileName = convertToWebMFileName(file.name);
            const webmFile = new File([webmBlob], newFileName, {
              type: "video/webm",
            });
            resolve(webmFile);
          }, 250); // Give time for last chunks to be processed
        };
      });

      // Start the conversion process
      video.play();
      drawFrame();

      const result = await convertedFile;
      URL.revokeObjectURL(mediaSource);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error converting video");
      throw err;
    } finally {
      setIsConverting(false);
      setProgress(100);
    }
  };

  return {
    convertToWebM,
    isConverting,
    error,
    progress,
  };
};
