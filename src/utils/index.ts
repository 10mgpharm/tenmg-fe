import { AxiosError } from "axios";

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const handleServerErrorMessage = (errorResponse: any) => {
  if (errorResponse instanceof AxiosError) {
    const errorData = errorResponse.response?.data;

    if (Object?.keys(errorData).includes("data")) {
      return errorData.message;
    }

    if (typeof errorData === "string") return errorData;

    if (Object.keys(errorData).includes("errors")) {
      const errors = errorData.errors as Record<string, string[]>[];
      return Object.values(errors)[0][0];
    }

    if (Object.keys(errorData).includes("error")) return errorData.error;

    return errorData.message;
  }
  return "Unhandled Exception: Contact the business administrator";
};

export const convertLetterCase = (text: string) => {
  if (!text) return text;

  if (text.includes(" ")) {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatAmountString = (amount: any) => {
  if (!amount) return 0;
  const convert2Number = Number(amount);
  const roundedNum = parseFloat(convert2Number.toFixed(2));
  return roundedNum?.toLocaleString();
};

export const camelCaseToTitleCase = (str: string) => {
  const result = str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return result;
};

export const fetchImageAsBlob = async (imageUrl: string) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl, { mode: "cors" });

    // Check if the response is OK
    if (!response.ok) throw new Error("Failed to fetch image");

    // Convert the response into a blob
    const blob = await response.blob();

    // Generate a UUID for the blob
    const uuid = crypto.randomUUID(); // Generates a unique identifier

    // Simulate saving locally by creating an object URL
    const localUrl = `http://localhost:3000/${uuid}`;

    console.log(`Blob URL: ${localUrl}`);
    return { localUrl, blob };
  } catch (error) {
    console.error("Error fetching or converting the image:", error);
  }
};

export const formatText = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase: "in stock"
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letters: "In Stock"
};

export const toQueryString = (params: Record<string, any>): string => {
  return Object.entries(params)
    .filter(([_, value]) => value && value.length !== 0) // Remove empty values
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          value.join(",")
        )}`;
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
};

export const generateRandomCoupon = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let couponCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    couponCode += chars[randomIndex];
  }

  return couponCode;
};

export const truncateString = (str: string, maxLength: number) => {
  if (str?.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
}

