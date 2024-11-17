/**
 * Removes the original file extension and adds .webm
 * @param fileName - The original file name (e.g., "video.mp4")
 * @returns The new file name with .webm extension (e.g., "video.webm")
 */
export const convertToWebMFileName = (fileName: string): string => {
  // Remove the existing extension and add .webm
  return fileName.replace(/\.[^/.]+$/, "") + ".webm";
};