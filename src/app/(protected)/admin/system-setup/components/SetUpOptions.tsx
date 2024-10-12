import { Button, Flex, HStack, Stack, Tag, TagCloseButton, TagLabel, Text } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";

const SetUpOptions = ({data}: any) => {

  const [inputValue, setInputValue] = useState<string>("");
  const [variants, setVariants] = useState<string[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      addVariant(inputValue.trim());
      e.preventDefault(); // To avoid adding a comma in the input
    }
  };

  const addVariant = (value: string) => {
    if (value && !variants.includes(value)) {
      setVariants([...variants, value]);
      setInputValue(""); // Clear the input after adding a variant
    }
  };

  const removeVariant = (variantToRemove: number) => {
    // setVariants(variants.filter((variant) => variant !== variantToRemove));
  };

  return (
    <Stack flex={1} p={5} bg={"white"} rounded={"small"}>
      <Stack gap={5}>
        {
          data?.map((item: any, index: number) => (
            <Stack gap={1} key={index}>
              <Text color={"gray.600"} fontSize={"15px"} fontWeight={500}>{item.type}</Text>
              {/* <Input
                placeholder="Add option"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                variant={"none"}
              /> */}
              <HStack gap={2} className="border p-4 rounded-md shadow-sm">  
                {
                  item.options?.map((item: any) => (
                    <Tag
                      size="md"
                      key={index}
                      borderRadius="full"
                      variant="outline"
                      mr={2}
                    >
                      <TagLabel>{item.name}</TagLabel>
                      <TagCloseButton onClick={() => removeVariant(item.id)} />
                    </Tag>
                  ))
                }
              </HStack>
            </Stack>
          ))
        }
      </Stack>
      <Flex mt={10} mb={8} justify={"flex-end"}>
        <HStack>
          <Button h={"40px"} variant={"outline"}>Cancel</Button>
          <Button h={"40px"}>Save</Button>
        </HStack>
      </Flex>
    </Stack>
  )
}

export default SetUpOptions;