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
            return error;
    }
};

interface ErrorMessageProps {
    error: string;
    onClose: () => void;
}

export default function ErrorMessage({ error, onClose }: ErrorMessageProps) {
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(error);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
        } else {
            (onClose && onClose());
        }
    }, [error, onClose]);

    return (
        <>
            {errorMessage && <Alert status='error' mb={5}>
                <AlertIcon />
                <Box>
                    <AlertDescription>
                        {getErrorMessage(errorMessage)}
                    </AlertDescription>
                </Box>
                <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={() => {
                        setErrorMessage(null);
                        onClose();
                    }}
                />
            </Alert>
            }
        </>
  )
}
