/**
 * Converts bytes to megabytes
 * @param bytes - The number of bytes to convert
 * @param decimals - Number of decimal places (default: 2)
 * @returns The size in MB as a string with unit
 */
export const bytesToMB = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 MB';
  
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(decimals)} MB`;
};

// Optional: If you want just the number without the unit
export const bytesToMBNumber = (bytes: number, decimals: number = 2): number => {
  return Number((bytes / (1024 * 1024)).toFixed(decimals));
};