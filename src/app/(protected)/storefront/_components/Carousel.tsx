'use client';

import React from 'react';
import { Box, Text, useBreakpointValue } from '@chakra-ui/react';

import Slider from 'react-slick';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    appendDots: (dots: React.ReactNode) => (
      <Box
        position="absolute"
        bottom="10px"
        display="flex"
        justifyContent="center"
        w="full"
        zIndex="10"
      >
        <ul style={{ margin: 0 }}>{dots}</ul>
      </Box>
    ),
    customPaging: () => (
      <Box
        w="10px"
        h="10px"
        bg="white"
        borderRadius="full"
        cursor="pointer"
        transition="all 0.3s"
        _hover={{ bg: 'gray.300' }}
      />
    ),
  };

  const slideHeight = useBreakpointValue({ base: '300px', md: '400px', lg: '500px' });

  return (
    <Box
      maxW="1200px"
      mx="auto"
      mt={10}
      p={4}
      position="relative"
      overflow="hidden"
    >
      <Slider {...settings}>
        {/* Slide 1 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgImage={`url('')`}
          bgSize="cover"
          bgPos="center"
          bgRepeat="no-repeat"
          h={slideHeight}
          borderRadius="md"
          position="relative"
        >
          <Box
            bg="rgba(0, 0, 0, 0.5)"
            w="full"
            h="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            color="white"
            position="absolute"
            top="0"
            left="0"
          >
            <Text
              fontSize={useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' })}
              fontWeight="bold"
            >
              Your pathway to wellness begins here.
            </Text>
          </Box>
        </Box>

        {/* Slide 2 */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgImage="url('/images/slide2.jpg')" // Replace with actual image path
          bgSize="cover"
          bgPos="center"
          bgRepeat="no-repeat"
          h={slideHeight}
          borderRadius="md"
          position="relative"
        >
          <Box
            bg="rgba(0, 0, 0, 0.5)"
            w="full"
            h="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            color="white"
            position="absolute"
            top="0"
            left="0"
          >
            <Text
              fontSize={useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' })}
              fontWeight="bold"
            >
              Discover better health solutions with us.
            </Text>
          </Box>
        </Box>
      </Slider>
    </Box>
  );
};

export default Carousel;
