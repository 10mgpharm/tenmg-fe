"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Input,
  Skeleton,
  SkeletonText,
  VStack,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import requestClient from "@/lib/requestClient";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const response = await requestClient().get(
          "/storefront/faqs"
        );
        setFaqs(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <Box maxW="3xl" mx="auto" py={16} px={4}>
        <Box textAlign="center" mb={6}>
          <Box as="h2" fontSize="3xl" fontWeight="bold">
            FAQs
          </Box>
          <Box color="gray.600">
            Need something cleared up? Here are our most frequently asked
            questions.
          </Box>
        </Box>

        {/* Search Input */}
        <Box position="relative" mb={6}>
          <SearchIcon
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
          />
          <Input
            type="text"
            placeholder="Search FAQs..."
            pl={10}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* Loading State with Shimmer */}
        {loading ? (
          <VStack spacing={4}>
            {[...Array(6)].map((_, index) => (
              <Box key={index} w="full" p={4} borderWidth={1} borderRadius="md">
                <Skeleton height="20px" mb={3} />
                <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="2" />
              </Box>
            ))}
          </VStack>
        ) : (
          <>
            {/* FAQ Accordion */}
            {filteredFaqs.length > 0 ? (
              <Accordion allowToggle>
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index}>
                    <h2>
                      <AccordionButton
                        _expanded={{ bg: "gray.100", fontWeight: "bold" }}
                      >
                        <Box flex="1" textAlign="left">
                          {faq.question.charAt(0).toUpperCase() + faq.question.slice(1)}
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Box textAlign="center" py={8}>
                <Text fontSize="lg" color="gray.500">
                  {search 
                    ? "No FAQs found matching your search."
                    : "No FAQs available at the moment. Check back later."
                  }
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
      <Footer />
    </div>
  );
}
