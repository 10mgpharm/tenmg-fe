import { Button, Checkbox, Flex, HStack, Stack, Text } from "@chakra-ui/react"

const Notifications = () => {
  return (
    <div className="max-w-2xl bg-white p-5 rounded-md">
        <Stack>
            <Text>Your Notifications</Text>
            <Stack>
                <Checkbox>
                    Notification One
                </Checkbox>
                <Checkbox>
                    Notification Two
                </Checkbox>
                <Checkbox>
                    Notification Three
                </Checkbox>
                <Checkbox>
                    Notification Four
                </Checkbox>
            </Stack>
        </Stack>
        <Stack mt={5}>
            <Text>General</Text>
            <Stack>
                <Checkbox>
                    Notification One
                </Checkbox>
                <Checkbox>
                    Notification Two
                </Checkbox>
                <Checkbox>
                    Notification Three
                </Checkbox>
                <Checkbox>
                    Notification Four
                </Checkbox>
                <Checkbox>
                    Notification Five
                </Checkbox>
            </Stack>
        </Stack>
        <HStack justify={"end"} my={6}>
            <Flex>
                <Button variant='outline' mr={3}>
                Cancel
                </Button>
                <Button colorScheme='blue'>Save Changes</Button>
            </Flex>
        </HStack>
    </div>
  )
}

export default Notifications