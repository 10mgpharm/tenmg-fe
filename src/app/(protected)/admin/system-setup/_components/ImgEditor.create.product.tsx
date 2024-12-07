import { useRef, ChangeEvent, RefObject, Dispatch, SetStateAction, useState } from "react";
import { Cropper, CropperRef, ImageRestriction } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./styles.scss";
import { Flex } from "@chakra-ui/react";
import { Slider } from "./ImgEditorUtils/Slider";
import { Navigation } from "./ImgEditorUtils/Navigation";
import cn from "classnames";
import "context-filter-polyfill";
import { scaleDownImage } from "@/utils/scaleDownImage";

interface ImgEditorProps {
  UPLOAD_PRODUCT_IMAGES(files: File[]): Promise<void>;
  inputRef: RefObject<HTMLInputElement>;
  onUpload: () => void;
  onLoadImage: (event: ChangeEvent<HTMLInputElement>) => void;
  image: string;
  setImage: Dispatch<SetStateAction<string>>;
  [key: string]: any;
}
export type ModeProps = "crop" | "brightness" | "hue" | "saturation" | "contrast";

const ImgEditor = ({ UPLOAD_PRODUCT_IMAGES, inputRef, onUpload, onLoadImage, setImage, image, ...props }: ImgEditorProps) => {

  const cropperRef = useRef<CropperRef | any>(null);
  const [mode, setMode] = useState<ModeProps>("crop");
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    hue: 0,
    saturation: 0,
    contrast: 0,
  });

  const onChangeValue = (value: number) => {
    if (mode in adjustments) {
      setAdjustments((previousValue) => ({
        ...previousValue,
        [mode]: value,
      }));
    }
  };

  const onDownload = () => {
    if (cropperRef.current) {
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `<img src="${cropperRef.current.getCanvas()?.toDataURL()}"/>`;
      }
    }
  };

  const cropperEnabled = mode === "crop";

  const filename: string = "image.jpg"; // Specify the desired filename
  const mimeType: string = "image/jpeg";

  function base64toFile(base64Data: string, filename: string, mimeType: string): File {
    // Convert base64 to raw binary data held in a string
    const byteCharacters: string = atob(base64Data);
    // Convert binary to ArrayBuffer
    const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteCharacters.length);
    const uint8Array: Uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteCharacters.length; i++) {
      uint8Array[i] = byteCharacters.charCodeAt(i);
    }
    // Create Blob from ArrayBuffer
    const blob: Blob = new Blob([uint8Array], { type: mimeType });
    // Create File from Blob
    const file: File = new File([blob], filename, { type: mimeType });
    return file;
  }

  const onCrop = async () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      const base64String = canvas?.toDataURL().replace(/^data:\w+\/\w+;base64,/, "");
      const file: File = base64toFile(base64String as string, filename, mimeType);

      // IF IMAGE SIZE IS BIGGGER THAN 4MB SCALE IT DOWN,
      if (file?.size >= 4 * 1024 * 1024) {
        const scaledFile = await scaleDownImage(file);
        UPLOAD_PRODUCT_IMAGES([scaledFile]);
      } else {
        UPLOAD_PRODUCT_IMAGES([file]);
      }
    }
  };

  return (
    <div className={"image-editor"}>
      <div className="image-editor__cropper">
        <Cropper
          src={image}
          ref={cropperRef}
          style={{
            width: "100%",
            height: 400,
          }}
          stencilProps={{
            movable: cropperEnabled,
            resizable: cropperEnabled,
            lines: cropperEnabled,
            handlers: cropperEnabled,
            overlayClassName: cn("image-editor__cropper-overlay", !cropperEnabled && "image-editor__cropper-overlay--faded"),
            grid: true,
            aspectRatio: 1,
          }}
          backgroundWrapperProps={{
            scaleImage: false,
            moveImage: false,
          }}
          imageRestriction={ImageRestriction.stencil}
        />

        {/* @ts-ignore */}
        <Flex alignSelf={"center"} justifySelf={"center"} w="100%" align={"center"} justify={"center"}>
          {mode !== "crop" && <Slider className="image-editor__slider" value={adjustments[mode]} onChange={onChangeValue} />}
        </Flex>
      </div>
      <Navigation 
      inputRef={inputRef} 
      onLoadImage={onLoadImage} 
      mode={mode} 
      onChange={setMode} 
      onUpload={onUpload} onDownload={() => onCrop()} 
      />
    </div>
  );
};

export default ImgEditor;
