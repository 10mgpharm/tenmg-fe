"use client";
import Image from "next/image";
import { 
  Box,
  Button,
  Center, 
  Flex, 
  HStack, 
  SimpleGrid, 
  Stack, 
  Text, 
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import { X } from "lucide-react";
import { PiNotePencil } from "react-icons/pi";
import { ChangeEvent, useRef, useState } from "react";
import ModalComponent from "./ModalComponent";
import ImgEditor from "./ImgEditor.create.product";
import AskQuestions from "./AskQuestions";

const SystemConfiguration = () => {

  const imagesUrls: any[] = [];
  const { dropZoneStyle } = useStyles()
  const [file, setFile] = useState("");
  const [image, setImage] = useState<string>("");
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isOpenQuestion, onClose: onCloseQuestion, onOpen: onOpenQuestion } = useDisclosure();

  const onLoadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (event.target.files[0].size >= 5 * 1024 * 1024)
      return alert(
        "A file selected is larger than the maximum 5MB limit, Please select a file smaller than 5MB."
      );
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // setImage(URL.createObjectURL(files[0]));
      const newImageSrcs = files.map((file) => URL.createObjectURL(file)); // Create URLs for each file
      setImageSrcs((prevSrcs) => [...prevSrcs, ...newImageSrcs]); // Append new URLs to state
    }
    if (imagesUrls.length > 0) {
      event.target.value = "";
      UPLOAD_PRODUCT_IMAGES(files);
      return;
    }
    if (files?.length > 1) {
      event.target.value = "";
      UPLOAD_PRODUCT_IMAGES(files);
    } else {
      event.target.value = "";
      // onOpen();
    }
  };

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const onSelectImgToEdit = (img: string) => {
    setImage(img);
    onOpen();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const UPLOAD_PRODUCT_IMAGES = async (file: File[]) => {
    if (isOpen) onClose();
    // setImageUplaoding(true);
  }

  const REMOVE_IMAGES = (imageToRemove: string) => {
    const removedImage = imageSrcs.filter((image) => image !== imageToRemove);
    setImageSrcs(removedImage);
  }

  return (
    <Stack>
      <Text fontSize={"1rem"} fontWeight={700} color={"gray.700"}>System Configuration</Text>

        <Stack bg={"white"} p={5} rounded={"lg"} gap={2} shadow={"sm"}>
          <Text fontSize={"13px"} fontWeight={600} color={"gray.600"}>Store Front Image ({imageSrcs?.length}/10)</Text>
          <SimpleGrid columns={[2, 3, 6]} spacing="10px" w={"100%"}>
            <Center
              as="button"
              {...dropZoneStyle}
              flexDir={"column"}
              pos={"relative"}
              overflow={"hidden"}
            >
              <input
                type="file"
                id="image_uploads"
                name="image_uploads"
                onChange={onLoadImage}
                multiple
                accept=".jpg, .jpeg, .png, .webp, .avif"
                style={{
                  opacity: "0",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
              />
              <Box opacity={file ? 0 : 1}>
                <Text fontSize={"13px"}>Drag Image
                </Text>
                <p className="text-gray-600">Or</p>
                <Text className="underline text-primary-600 text-[13px]">Select Images</Text>
                <p className="text-gray-500 text-center mt-1.5">PDF, PNG or JPG</p>
                <p className="text-sm text-gray-500 text-center">(Max size, 5MB)</p>
              </Box>
            </Center>
            {imageSrcs?.map((e, index: number) => (
              <Flex
                h={"140px"}
                w="100%"
                // mt="10px"
                borderRadius="10px"
                pos={"relative"}
                key={index}
              >
                {/* <Flex
                  pos={"absolute"}
                  w="100%"
                  h="100%"
                  bg="#00000013"
                  borderRadius={"10px"}
                /> */}
                <Center
                  h={"140px"}
                  w="100%"
                  pos={"relative"}
                  alignItems={"center"}
                >
                  <Image
                    src={e}
                    alt=""
                    width={400}
                    height={400}
                    className="object-cover rounded-md h-[140px] w-full"
                  />
                  <Flex 
                  gap={2}
                  bg={"white"}
                  p={1}
                  rounded={"md"}
                  pos={"absolute"}
                  right={3}
                  top={2}
                  >
                    <PiNotePencil 
                    cursor={"pointer"}
                    onClick={() => {
                      onSelectImgToEdit(e);
                      // setImgToEditUrl(e);
                    }}
                    className="w-4 h-auto" />
                    <X 
                    cursor={"pointer"}
                    onClick={() => {
                      REMOVE_IMAGES(e);
                    }}
                    className="w-4 h-auto text-red-600"/>
                  </Flex>
                </Center>
              </Flex>
            ))}
          </SimpleGrid>
        </Stack>
      <HStack mt={4} justify={"space-between"} bg={"white"} p={5} rounded={"lg"} shadow={"sm"}>
        <Text fontWeight={700} fontSize={"1rem"} color={"gray.700"}>Set FAQs</Text>
        <Button onClick={onOpenQuestion} h={"34px"} variant={"outline"} px={2} fontSize={"14px"} color={"gray.600"}>
        Add Questions & Answers
        </Button>
      </HStack>
      <AskQuestions isOpen={isOpenQuestion} onClose={onCloseQuestion}/>
      <ModalComponent
        onClose={() => {
          onClose();
          // setImgToEditUrl("");
        }}
        isOpen={isOpen}
        size={"xl"}
        modalBodyStyle={{
          height: "100vh",
        }}
      >
        <Flex flexDir={"column"}>
          <Text
            fontSize={"20px"}
            fontWeight={"bold"}
            alignSelf={"center"}
            mb="5px"
          >
            Edit Store Photo
          </Text>
          <Text alignSelf={"center"} mb="10px">
            resize and edit image with the image editor
          </Text>
          <ImgEditor
            {...{
              UPLOAD_PRODUCT_IMAGES,
              inputRef,
              onUpload,
              onLoadImage,
              image,
              setImage,
            }}
          />
        </Flex>
      </ModalComponent>
    </Stack>
  )
}

export default SystemConfiguration

export const useStyles = () => {
  return {
    dropZoneStyle: {
      w: "100%",
      h: "140px",
      bg: "white",
      borderRadius: "10px",
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: "gray.400",
      fontSize: "12px",
      fontWeight: "500",
      // mt: "15px",
    },
  }
}