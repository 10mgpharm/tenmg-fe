import { Button, Flex, FormControl, FormLabel, HStack, Input, Stack, Text } from "@chakra-ui/react"

const BusinessInformation = () => {
  return (
    <Stack>
        <Text fontSize={"1rem"} fontWeight={600} color="gray.700">Business Information</Text>
        <form className="space-y-5 mt-6">
            <HStack gap={5}>
                <FormControl>
                    <FormLabel>Business Name</FormLabel>
                    <Input type="text" defaultValue={'Jacquelyn’s Pharmacy'}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Contact Person Name</FormLabel>
                    <Input type="text" defaultValue={'Jacquelyn Bernard'}/>
                </FormControl>
            </HStack>
            <HStack gap={5}>
                <FormControl>
                    <FormLabel>Business Email</FormLabel>
                    <Input type="email" defaultValue={'olivia@untitledui.com'}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Contact Phone Number</FormLabel>
                    <Input type="number" defaultValue={'0816911419'}/>
                </FormControl>
            </HStack>
            <HStack gap={5}>
                <FormControl>
                    <FormLabel>Business Address</FormLabel>
                    <Input type="text" defaultValue={'Plot 360 Obafemi Awolowo way, Jabi District, Abuja'}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Position</FormLabel>
                    <Input type="text" defaultValue={'Leader'}/>
                </FormControl>
            </HStack>
            <Flex pt={8} justify="flex-end">
                <Flex className="flex items-center gap-3">
                    <Button variant={"outline"}>Discard</Button>
                    <Button bg={"blue.700"}>Save Changes</Button>
                </Flex>
            </Flex>
        </form>
    </Stack>
  )
}

export default BusinessInformation