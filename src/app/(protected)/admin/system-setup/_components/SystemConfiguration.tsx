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
  useDisclosure
} from "@chakra-ui/react"
import { X } from "lucide-react";
import { PiNotePencil } from "react-icons/pi";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import ModalComponent from "./ModalComponent";
import ImgEditor from "./ImgEditor.create.product";
import FAQList from "./FAQList";
import { useSession } from "next-auth/react";
import { NextAuthUserSession, StoreFrontImage, StoreFrontImageResponse } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import DeleteMedication from "./DeleteMedication";

const SystemConfiguration = () => {

  const imagesUrls: any[] = [];
  const { dropZoneStyle } = useStyles();
  const [file, setFile] = useState("");
  const [image, setImage] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number>();
  const [imageUrl, setImageURL] = useState<Blob>();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [imageSrcs, setImageSrcs] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isOpen: isDeleteOpen, onClose: onDeleteClose, onOpen: onDeleteOpen }= useDisclosure();
  const [storeImages, setStoreImages] = useState<StoreFrontImageResponse>()

  const session = useSession();
  const sessionToken = session?.data as NextAuthUserSession;
  const token = sessionToken?.user?.token;

  const fetchingStoreImages = useCallback(async () => {
    setLoading(true)
    try {
        const response = await requestClient({ token: token }).get(
          `/admin/system-setup/storefront-images`
        );
        if (response.status === 200) {
          setStoreImages(response.data.data);
          setLoading(false);
        }
    } catch (error) {
        console.error(error)
        setLoading(false);
    }
  }, [token]);

  useEffect(() => {
      if (!token) return;
      fetchingStoreImages();
  }, [token, fetchingStoreImages]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; //5MB in bytes

  const onLoadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (event.target.files[0].size >= MAX_FILE_SIZE)
      return alert(
        "A file selected is larger than the maximum 5MB limit, Please select a file smaller than 5MB."
      );
    const files = Array.from(event.target.files);
    const inputFile = event.target.files[0];
    setImageURL(inputFile);
    setImageSrcs(URL.createObjectURL(inputFile))
    // if (files.length > 0) {
    //   const newImageSrcs = files.map((file) => URL.createObjectURL(file));
    //   setImageSrcs((prevSrcs) => [...prevSrcs, ...newImageSrcs]);
    // }
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
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > MAX_FILE_SIZE) {
        toast.error(
          "File size exceeds the 10MB limit. Please upload a smaller file."
        );
        setImageURL(null);
        setImageSrcs(null);
      } else {
        setImageURL(droppedFile);
        setImageSrcs(URL.createObjectURL(droppedFile))
      }
    }
  };

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const onSelectImgToEdit = (img: string) => {
    // const imageBlob = URL.createObjectURL(img)
    // const result = fetchImageAsBlob(img);
    // console.log(img)
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

  // const REMOVE_IMAGES = (imageToRemove: string) => {
  //   const removedImage = imageSrcs.filter((image) => image !== imageToRemove);
  //   setImageSrcs(removedImage);
  // }

  const uploadImages = async () => {
    if(imageUrl){
      const formdata = new FormData();
      formdata.append("image", imageUrl);
      try {
        setLoading(true);
        const response = await requestClient({token: token}).post(
          "/admin/system-setup/storefront-images",
          formdata
        );
        if(response.status === 201){
          toast.success(response?.data?.message);
          fetchingStoreImages();
          setLoading(false);
          setImageSrcs("")
        }
      } catch (error) {
        setLoading(false)
        console.error(error);
        toast.error(handleServerErrorMessage(error));
      }
    }
  }

  const handleDelete = async () => {
    if(selectedId){
      setDeleteLoading(true);
      try {
        const response = await requestClient({token: token}).delete(
          `/admin/system-setup/storefront-images/${selectedId}`
        )
        if(response.status === 200){
          toast.success(response.data?.message)
          fetchingStoreImages();
          setDeleteLoading(false);
        }
      } catch (error) {
        console.error(error);
        setDeleteLoading(false);
        toast.error(handleServerErrorMessage(error));
      }
    }
  }

  return (
    <Stack>
      <Text fontSize={"1rem"} fontWeight={700} color={"gray.700"}>System Configuration</Text>
        <Stack bg={"white"} p={5} rounded={"lg"} gap={2} shadow={"sm"}>
          <HStack justifyContent={"space-between"} align={"center"}>
            <Text fontSize={"13px"} fontWeight={600} color={"gray.600"}>
              Store Front Image ({storeImages?.data?.length}/10)
            </Text>
            <Button 
            h={"34px"} 
            bg={"blue.600"} 
            color={"white"} 
            onClick={uploadImages}
            isLoading={loading}
            loadingText={"Saving..."}
            >
              Save Changes
            </Button>
          </HStack>
          <SimpleGrid columns={[2, 3, 6]} spacing="10px" w={"100%"}>
            <Center
              as="button"
              {...dropZoneStyle}
              flexDir={"column"}
              pos={"relative"}
              overflow={"hidden"}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                handleDrop(e);
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                id="image_uploads"
                name="image_uploads"
                onChange={onLoadImage}
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
                <Text fontSize={"13px"}>Drag Image</Text>
                <p className="text-gray-600">Or</p>
                <Text className="underline text-primary-600 text-[13px]">Select Images</Text>
                <p className="text-gray-500 text-center mt-1.5">PDF, PNG or JPG</p>
                <p className="text-sm text-gray-500 text-center">(Max size, 5MB)</p>
              </Box>
            </Center>
            {/* {imageSrcs?.map((e, index: number) => ( */}
            {
              imageSrcs && (
                <Flex
                  h={"140px"}
                  w="100%"
                  // mt="10px"
                  borderRadius="10px"
                  pos={"relative"}
                  // key={index}
                >
                  <Center
                    h={"140px"}
                    w="100%"
                    pos={"relative"}
                    alignItems={"center"}
                    border={"1px solid #d7d7d7"}
                    rounded={"md"}
                  >
                    <Image
                      src={imageSrcs}
                      alt=""
                      width={400}
                      height={400}
                      className="object-cover rounded-md h-[140px] w-full mix-blend-darken"
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
                        onSelectImgToEdit(imageSrcs);
                        // setImgToEditUrl(e);
                      }}
                      className="w-4 h-auto" />
                      <X 
                      cursor={"pointer"}
                      onClick={() => {
                        setImageSrcs("")
                      }}
                      className="w-4 h-auto text-red-600"/>
                    </Flex>
                  </Center>
                </Flex>
              )
            }
            {/* ))} */}
            {
              storeImages?.data && storeImages?.data?.map((image: StoreFrontImage) => (
                <Flex
                h={"140px"}
                w="100%"
                borderRadius="10px"
                pos={"relative"}
                key={image.id}
              >
                <Center
                  h={"140px"}
                  w="100%"
                  pos={"relative"}
                  alignItems={"center"}
                  border={"1px solid #d7d7d7"}
                  rounded={"md"}
                >
                  <Image
                    src={image.imageUrl}
                    alt=""
                    width={400}
                    height={400}
                    className="object-cover rounded-md h-[140px] w-full mix-blend-darken"
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
                      onSelectImgToEdit(image.imageUrl);
                    }}
                    className="w-4 h-auto" />
                    <X 
                    cursor={"pointer"}
                    onClick={() => {
                      setSelectedId(image.id)
                      onDeleteOpen();
                    }}
                    className="w-4 h-auto text-red-600"/>
                  </Flex>
                </Center>
              </Flex>
              ))
            }
          </SimpleGrid>
        </Stack>
        <FAQList />
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
      <DeleteMedication 
      isOpen={isDeleteOpen}
      onClose={onDeleteClose}
      isLoading={deleteLoading}
      handleDelete={handleDelete}
      title="Image"
      />
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