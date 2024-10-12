import { Button, Flex, FormControl, FormLabel, HStack, Input, Stack } from "@chakra-ui/react"

const InventorySetup = () => {
  return (
    <Stack bg={"white"} p={5} rounded={"md"} flex={1}>
        <form className="space-y-5">
            <FormControl>
                <FormLabel color={"gray.600"} fontSize={"15px"} fontWeight={500}>Set Low Stock Alert</FormLabel>
                <Input type="text"/>
            </FormControl>
            <FormControl>
                <FormLabel color={"gray.600"} fontSize={"15px"} fontWeight={500}>Set Out of Stock Alert</FormLabel>
                <Input type="text"/>
            </FormControl>
            <Flex pt={10} pb={8} justify={"flex-end"}>
                <HStack>
                    <Button h={"40px"} variant={"outline"}>Cancel</Button>
                    <Button h={"40px"}>Publish Setup</Button>
                </HStack>
            </Flex>
        </form>
    </Stack>
  )
}

export default InventorySetup