"use client";

import React, { useState, useRef } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { IoCloudDoneOutline } from "react-icons/io5";

const AccountSetup: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files && dataTransfer.files.length > 0) {
      const droppedFile = dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl bg-white p-10 rounded-md border-2 border-gray-200">
      <form className="space-y-5 mb-6 ">
        <FormControl>
          <FormLabel>License Number</FormLabel>
          <Input type="text" placeholder="Enter License Number" />
        </FormControl>
        <FormControl>
          <FormLabel>Expiry Date</FormLabel>
          <Input type="date" />
        </FormControl>

        <div className="mb-8">
          <p className="font-medium text-gray-800 mb-3">CAC Document</p>
          <div
            className="border relative p-4 rounded-md"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image_uploads"
              ref={fileInputRef}
              name="image"
              onChange={handleChange}
              accept=".jpg, .jpeg, .png, .webp, .avif, .mp4, .mov, .pdf"
              className="hidden"
            />
            <div className="flex flex-col gap-2 cursor-pointer">
              <div className="bg-gray-50 p-2 rounded-full mx-auto max-w-max mb-4">
                <IoCloudDoneOutline className="w-6 h-6 text-gray-700" />
              </div>
              <p className="text-sm font-normal text-center">
                <span className="font-semibold text-primary-500">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-gray-500 text-center">
                PDF, PNG or JPG (max. 800x400px)
              </p>
              {file && (
                <p className="text-sm text-gray-500">
                  Selected file: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>
        <button className="p-3 rounded-md bg-primary-600 text-white w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AccountSetup;
