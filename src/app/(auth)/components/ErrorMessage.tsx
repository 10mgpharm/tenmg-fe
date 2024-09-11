import { Alert, AlertIcon, AlertDescription, CloseButton, Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const getErrorMessage = (error?: string | null | undefined) => {
    if (!error || error.trim() === '') return null;

    switch (error) {
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
        case 'OAuthAccountNotLinked':
        case 'SessionRequired':
        case 'AccessDenied':
            return 'No account was found with the provided credentials.';
        case 'Default':
            return 'There was an error signing in. Please try again in a few minutes.';
        case 'CredentialsSignin':
            return 'Provided credentials are invalid';
        default:
            return 'Error processing your request. Please try again.';
    }
};

interface ErrorMessageProps {
    error: string;
    onClose: () => void;
}

export default function ErrorMessage({ error, onClose }: ErrorMessageProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(error);

    useEffect(() => {
        if (error) {
            setOpen(true);
            setErrorMessage(getErrorMessage(error));
        } else {
            setOpen(false);
            setErrorMessage(null);
        }
    }, [error]);

    return (
        <>
            {errorMessage && <Alert status='error' mb={5}>
                <AlertIcon />
                <Box>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Box>
                <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={() => setErrorMessage(null)}
                />
            </Alert>
            }
        </>
  )
}
