"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";

const faqs = [
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    question: "Can I change my plan later?",
    answer: "Yes, you can upgrade or downgrade anytime.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel anytime before the next billing cycle.",
  },
  {
    question: "Can other info be added to an invoice?",
    answer: "Yes, you can add details like company name and address.",
  },
  {
    question: "How does billing work?",
    answer: "Billing is done on a monthly basis.",
  },
  {
    question: "How do I change my account email?",
    answer: "You can update your email in account settings.",
  },
];

export default function FAQ() {
  const [search, setSearch] = useState("");

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

        {/* FAQ Accordion */}
        <Accordion allowToggle>
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton
                  _expanded={{ bg: "gray.100", fontWeight: "bold" }}
                >
                  <Box flex="1" textAlign="left">
                    {faq.question}
                  </Box>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
      <Footer/>
    </div>
  );
}
