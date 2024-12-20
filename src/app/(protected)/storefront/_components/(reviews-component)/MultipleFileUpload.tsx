'use client'
import { Button } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface HiddenFileUploadProps {

  setFilePreview: Dispatch<SetStateAction<string[] | null>>;
  filePreview: string[] | null;
  setFile: Dispatch<SetStateAction<File[] | null>>;
  setFileError: Dispatch<SetStateAction<string | null>>;
  file: File[] | null;
  count: number;


}

export const MutipleFileUpload = ({ setFilePreview, setFile, filePreview, file, count, setFileError }: HiddenFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // console.log("filePreview", filePreview)
  // console.log("count", count)
  // console.log("count === filePreview.length", count === filePreview.length)

  const [fileError, setUploadError] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      setUploadError(null);
      setFileError(null);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setFileError(null);
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        setFileError("File size must be less than 5MB");
        event.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        setFileError("Only image files are allowed");
        event.target.value = "";
        return;
      }

      // setFile(file);
      setFile((prevFiles) => [...prevFiles, file]);

      const fileURL = URL.createObjectURL(file);

      setFilePreview((prevFiles) => [...prevFiles, fileURL]);

      // console.log("File accepted:", file);
    }
  };

  return (
    <>
      {filePreview.length < count ?
        <div>
          <div>
            <div className="p-2 rounded-full bg-primary-100/30 w-fit cursor-pointer" onClick={handleButtonClick}>
              <div className="p-2 rounded-full bg-primary-200/30 w-fit ">
                <PlusIcon className="size-6
            "/>
              </div>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            id="file"
            name="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          {/* <p className="text-xs text-red-500">{fileError}</p> */}
        </div>
        : null
      }</>
  );
};
