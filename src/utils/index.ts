import { AxiosError } from "axios";

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export const handleServerErrorMessage = (errorResponse: any) => {
    if (errorResponse instanceof AxiosError) {
        const errorData = errorResponse.response.data;

        if (Object.keys(errorData).includes('data')) {
            return errorData.message
        }

        if (typeof errorData === 'string') return errorData;

        if (Object.keys(errorData).includes('errors')) {
            const errors = errorData.errors as Record<string, string[]>[];
            return Object.values(errors)[0][0];
        }

        if (Object.keys(errorData).includes('error'))
            return errorData.error;

        return errorData.message
    }
    return 'Unhandled Exception: Contact the business administrator'
}

export const convertLetterCase = (text: string) => {
    if (!text) return text;

    if (text.includes(' ')) {
        return text
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    
}

export const formatAmountString = (amount: any) => {
    if(!amount) return 0;
    const convert2Number = Number(amount)
    const roundedNum = parseFloat(convert2Number.toFixed(2));
    return roundedNum?.toLocaleString();
}