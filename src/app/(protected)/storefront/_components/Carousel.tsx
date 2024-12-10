"use client";

import React, { useCallback } from "react";
import { Box, Flex, Image, Text, Button } from "@chakra-ui/react";
import useEmblaCarousel from "embla-carousel-react";
import carousel1 from "@public/assets/images/carousel1.png";
import carousel2 from "@public/assets/images/carousel2.jpg";
import carousel3 from "@public/assets/images/carousel3.jpg";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const slides = [
  {
    id: 1,
    image: carousel1,
    title: "Your pathway to wellness begins here.",
  },
  {
    id: 2,
    image: carousel2,
    title: "Experience top-notch healthcare services.",
  },
  {
    id: 3,
    image: carousel3,
    title: "Find all your prescriptions in one place.",
  },
];

const Carousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const handleScroll = useCallback(
    (direction: "next" | "prev") => {
      if (!emblaApi) return;
      direction === "next" ? emblaApi.scrollNext() : emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  return (
    <Box
      w="100%"
      maxW="1280px"
      mx="auto"
      overflow="hidden"
      borderRadius="8px"
      position="relative"
    >
      <Flex ref={emblaRef} className="embla">
        <Flex className="embla__container">
          {slides.map(({ id, image, title }) => (
            <Box key={id} flex="0 0 100%" position="relative">
              <Image
                src={image.src}
                alt={title}
                w="100%"
                h="493px"
                objectFit="cover"
                objectPosition="center"
                borderRadius="8px"
              />
              <Box
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                bg="#34405480"
                display="flex"
                alignItems="center"
                borderRadius="8px"
              >
                <Text fontSize="6xl" color="white" fontWeight="bold" maxWidth="calc(657px + 114px)" pl={28}>
                  {title}
                </Text>
              </Box>
            </Box>
          ))}
        </Flex>
      </Flex>

      {/* Navigation Buttons */}
      <Button
        position="absolute"
        top="50%"
        left="10px"
        transform="translateY(-50%)"
        zIndex={10}
        onClick={() => handleScroll("prev")}
        bg="white"
        color="gray.800"
        _hover={{ bg: "gray.200" }}
        borderRadius="full"
      >
        <BsArrowLeft />
      </Button>
      <Button
        position="absolute"
        top="50%"
        right="10px"
        transform="translateY(-50%)"
        zIndex={10}
        onClick={() => handleScroll("next")}
        bg="white"
        color="gray.800"
        _hover={{ bg: "gray.200" }}
        borderRadius="full"
      >
       <BsArrowRight />
      </Button>
    </Box>
  );
};

export default Carousel;
