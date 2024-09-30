import { Box, Button, Divider, Grid, GridItem, HStack, Input, Stack, Switch, Text } from "@chakra-ui/react"

const GeneralSettings = () => {
  return (
    <div>
        <HStack justify={"space-between"}>
            <Stack>
                <Text fontWeight={600} fontSize={"1rem"}>Personal Details</Text>
                <Text fontSize={"14px"} color={"gray.500"}>Update your personal details.</Text>
            </Stack>
            <Button fontSize={"14px"} px={2} py={1}>Save Changes</Button>
        </HStack>
        <Box className="bg-white p-4 rounded-md border mt-5">
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text>Name</Text>
                </GridItem>
                <GridItem colSpan={1}>
                    <Input type="text"/>
                </GridItem>
                <GridItem colSpan={1}>
                    <Input type="text"/>
                </GridItem>
            </Grid>
            <Divider my={3} />
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text fontWeight={500}>Email Address</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Your associated email address</Text>
                </GridItem>
                <GridItem colSpan={2}>
                    <Input type="text"/>
                </GridItem>
            </Grid>
            <Divider my={3} />
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text fontWeight={500}>Role</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Your associated role and permissions level</Text>
                </GridItem>
                <GridItem colSpan={2}>
                    <Input type="text"/>
                </GridItem>
            </Grid>
        </Box>
        <Divider my={3} />
        <HStack justify={"space-between"}>
            <Stack>
                <Text fontWeight={600} fontSize={"1rem"}>Security</Text>
                <Text fontSize={"14px"} color={"gray.500"}>Manage your password and 2FA</Text>
            </Stack>
            <Button fontSize={"14px"} px={2} py={1}>Save Changes</Button>
        </HStack>
        <Box className="bg-white p-4 rounded-md border mt-5">
            <HStack justify={"space-between"}>
                <Stack>
                    <Text fontWeight={600} fontSize={"1rem"}>Password</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Change your current password</Text>
                </Stack>
                <Button variant={"outline"} fontSize={"14px"} px={2} py={1}>Change password</Button>
            </HStack>
            <Divider my={3} />
            <HStack justify={"space-between"}>
                <Stack>
                    <Text fontWeight={600} fontSize={"1rem"}>Enable Two-Factor Authentication</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Two-Factor authentication adds another layer of security to your account.</Text>
                </Stack>
                <Switch size='lg' />
            </HStack>
        </Box>
    </div>
  )
}

export default GeneralSettings