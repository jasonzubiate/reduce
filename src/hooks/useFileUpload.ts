import { useState } from "react";

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setFile(file);
    }
  };

  return {
    file,
    handleFileChange,
  };
};
