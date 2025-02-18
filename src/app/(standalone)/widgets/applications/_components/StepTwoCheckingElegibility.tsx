'use client';

import React, { useEffect, useState } from 'react';
import { ApplicationDto, BusinessDto, CustomerDto } from '@/types';
import { Box, Button, Flex, Text, VStack, Skeleton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { DownloadIcon, UserCheck2, BookLockIcon, NotepadTextIcon, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import config from '@/lib/config';
import LoadingScreen from './LoadingScreen';

interface Props {
    business: BusinessDto;
    customer: CustomerDto;
    application: ApplicationDto;
    navigateBackAction?: () => void;
    onContinueAction?: () => void;
}

const steps = [
    { id: 1, icon: DownloadIcon, title: "Fetching Your Transaction", description: "Retrieving and processing your last 6 months of transactions." },
    { id: 2, icon: NotepadTextIcon, title: "Analyzing Transaction", description: "Using AI-driven insights to analyze your purchase patterns." },
    { id: 3, icon: BookLockIcon, title: "AI-Credit Score Check", description: "Calculating your credit score based on transaction data." },
    { id: 4, icon: UserCheck2, title: "Eligibility Check", description: `Verifying your eligibility for credit services with ${config.appName}` }
];

export default function StepTwoCheckingEligibility({ customer, business, navigateBackAction, onContinueAction }: Props) {
    const [stepIndex, setStepIndex] = useState(0);
    const [stepResults, setStepResults] = useState<Record<number, 'loading' | 'success' | 'failed'>>({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isEligible, setIsEligible] = useState(false);

    const [typewriterActiveStep, setTypewriterActiveStep] = useState(0);
    const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);

    useEffect(() => {
        const runSteps = async () => {
            for (let i = 0; i < steps.length; i++) {
                setStepResults((prev) => ({ ...prev, [steps[i].id]: 'loading' }));
                await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate API call
                setStepResults((prev) => ({ ...prev, [steps[i].id]: 'success' }));
                setStepIndex(i + 1);

                // Wait for Typewriter animation to finish before proceeding (adjust duration as needed)
                await new Promise((resolve) => setTimeout(resolve, steps[i].description.length * 25 + 1000));
                setTypewriterActiveStep(i + 1);
            }

            // Ensure modal opens only after all steps are done
            setTimeout(() => {
                onOpen();
                setIsEligible(customer.score >= 20);
                setIsLoadingComplete(!isLoadingComplete)
            }, 500);
        };

        runSteps();
    }, [customer.score, onOpen]);


    return (
        <LoadingScreen message='Checking your eligibility, please wait...' onLoadingComplete={isLoadingComplete}>
            <div className="w-full sm:max-w-[300px] lg:min-h-[500px]">
                <VStack align={'self-start'} className='space-y-5' w="full">
                    {steps.map((step, index) => (
                        <Flex key={step.id} gap={5} className='eligible-step w-full' align="center" opacity={index <= stepIndex ? 1 : 0.3}>
                            {stepResults[step.id] === 'loading' ? (
                                <Skeleton height='32px' width='32px' borderRadius='full' />
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <step.icon strokeWidth={2.5} className='h-8 w-8' />
                                </motion.div>
                            )}
                            <Box flex="1">
                                <Text fontSize={'md'} fontWeight={'bold'}>{step.title}</Text>
                                {stepResults[step.id] === 'loading' ? (
                                    <Skeleton height="40px" w="full" mt={2} />
                                ) : (
                                    typewriterActiveStep === index && ( // Ensures only the active step types
                                        <Typewriter options={{ strings: step.description, autoStart: true, delay: 25, cursor: '' }} />
                                    )
                                )}
                            </Box>
                        </Flex>
                    ))}
                    {isLoadingComplete && (
                        <>{isEligible ?
                        (<Button colorScheme="green" width={'full'} onClick={onContinueAction}>Proceed</Button>) :
                        (
                            <Button
                                colorScheme="red"
                                width={'full'}
                                onClick={() => {
                                    onClose()
                                    navigateBackAction()
                                }}
                            >
                                Close
                            </Button>
                        )}
                        </>
                    )}
                </VStack>

                {/* Eligibility Modal */}
                <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnEsc={!isEligible}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader textAlign={'center'}>
                            {isEligible ? "Congratulations!" : "Eligibility Failed"}
                        </ModalHeader>
                        <ModalBody textAlign="center">
                            <Flex direction={'column'} justify={'center'} alignItems={'center'}>
                                {isEligible ? (
                                    <>
                                        <CheckCircle size={48} color="green" />
                                        <Text mt={3}>You are eligible for credit services.</Text>
                                    </>
                                ) : (
                                    <>
                                        <XCircle size={48} color="red" />
                                        <Text mt={3}>Unfortunately, your credit score is too low to proceed.</Text>
                                    </>
                                )}
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            {isEligible ? (
                                <Button colorScheme="green" onClick={onContinueAction}>Proceed</Button>
                            ) : (
                                <Button colorScheme="red" onClick={() => {
                                    onClose()
                                    navigateBackAction()
                                }}>Close</Button>
                            )}
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </LoadingScreen>
    );
}
