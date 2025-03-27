"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { NextAuthUserSession } from "@/types";
import requestClient from "@/lib/requestClient";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

type SlideType = {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
};

const Carousel: React.FC = () => {
  const session = useSession();
  const userData = session.data as NextAuthUserSession;
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const handleScroll = useCallback(
    (direction: "next" | "prev") => {
      if (!emblaApi) return;
      direction === "next" ? emblaApi.scrollNext() : emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const fetchStoreFrontCarouselImages = async () => {
    setIsLoading(true);
    try {
      const response = await requestClient({
        token: userData?.user?.token,
      }).get("/storefront/images");

      setSlides(response?.data?.data.data);
    } catch (error) {
      toast.error("Unable to fetch carousel images");
      console.error("Unable to fetch carousel images", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreFrontCarouselImages();
  }, []);

  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      overflow="hidden"
      borderRadius="8px"
      position="relative"
      className={cn(isLoading ? "bg-gray-200  animate-pulse" : "")}
    >
      <Flex ref={emblaRef} className="embla bg-green-500">
        <Flex className="embla__container bg-red-500 !flex-1">
          {slides.map(({ id, imageUrl, title, description }) => (
            <Box key={id} flex="0 0 100%" position="relative">
              <Image
                src={imageUrl}
                alt={title}
                w="100%"
                h={{ base: "256px", md: "493px" }}
                objectFit="cover"
                objectPosition="center"
                borderRadius="8px"
              />
              {/* <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bg="#34405480"
                display="flex"
                alignItems="center"
                borderRadius="8px"
              > */}
              {/* <Text
                  fontSize={{ base: "2xl", md: "6xl" }}
                  color="white"
                  fontWeight="bold"
                  maxWidth="calc(657px + 114px)"
                  pl={[10, 14, 28]}
                >
                  {title ?? "Find all your prescriptions in one place."}
                </Text> */}
              {/* </Box> */}
            </Box>
          ))}
        </Flex>
      </Flex>

      {/* Navigation Buttons */}
      <Button
        position="absolute"
        top={{ md: "50%" }}
        bottom={{ base: "10%", md: "" }}
        left="10px"
        transform="translateY(-50%)"
        zIndex={10}
        p={[0, 3]}
        onClick={() => handleScroll("prev")}
        bg="white"
        color="gray.800"
        _hover={{ bg: "gray.200" }}
        borderRadius="full"
      >
        <ChevronLeft />
      </Button>
      <Button
        position="absolute"
        top={{ md: "50%" }}
        bottom={{ base: "10%", md: "" }}
        right="10px"
        transform="translateY(-50%)"
        zIndex={10}
        p={[0, 3]}
        onClick={() => handleScroll("next")}
        bg="white"
        color="gray.800"
        _hover={{ bg: "gray.200" }}
        borderRadius="full"
      >
        <ChevronRight />
      </Button>
    </Box>
  );
};

export default Carousel;
