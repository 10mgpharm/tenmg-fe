import { ChangeEvent, FC, RefObject } from "react";
import cn from "classnames";
import { Button } from "./Button";
import "./Navigation.scss";
import { BiCircleThreeQuarter, BiCrop } from "react-icons/bi";
import { BsUpload } from "react-icons/bs";
import { Text } from "@chakra-ui/react";
import { MdWaterDrop } from "react-icons/md";
import { ImBrightnessContrast, ImContrast } from "react-icons/im";
import { ModeProps } from "../ImgEditor.create.product";

interface Props {
  className?: string;
  mode?: ModeProps;
  onChange?: (mode: ModeProps) => void;
  onDownload?: () => void;
  onUpload?: () => void;
  //   onUpload?: (blob: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  onLoadImage: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Navigation: FC<Props> = ({ className, onChange, onUpload, onDownload, mode, onLoadImage, inputRef }) => {
  const setMode = (mode: ModeProps) => () => {
    onChange?.(mode);
  };

  //   const onUploadButtonClick = () => {
  //     inputRef.current?.click();
  //   };

  return (
    <div className={cn("image-editor-navigation", className)}>
      <Button className={"image-editor-navigation__button"} onClick={onUpload}>
        {/* <Button className={"image-editor-navigation__button"} onClick={onUploadButtonClick}> */}
        <BsUpload color="white" size="20px" />
        <input ref={inputRef} type="file" accept="image/*" onChange={onLoadImage} className="image-editor-navigation__upload-input" />
      </Button>
      <div className="image-editor-navigation__buttons">
        <Button className={"image-editor-navigation__button"} active={mode === "crop"} onClick={setMode("crop")}>
          <BiCrop color="white" size="25px" />
        </Button>
        <Button className={"image-editor-navigation__button"} active={mode === "saturation"} onClick={setMode("saturation")}>
          <MdWaterDrop color="white" size="25px" />
        </Button>
        <Button className={"image-editor-navigation__button"} active={mode === "brightness"} onClick={setMode("brightness")}>
          <ImBrightnessContrast color="white" size="25px" />
        </Button>
        <Button className={"image-editor-navigation__button"} active={mode === "contrast"} onClick={setMode("contrast")}>
          <ImContrast color="white" size="25px" />
        </Button>
        <Button className={"image-editor-navigation__button"} active={mode === "hue"} onClick={setMode("hue")}>
          <BiCircleThreeQuarter color="white" size="25px" />
        </Button>
      </div>
      <Button className={"image-editor-navigation__button"} onClick={onDownload}>
        <Text color={"white"} fontWeight={"600"}>
          Done
        </Text>
      </Button>
    </div>
  );
};
