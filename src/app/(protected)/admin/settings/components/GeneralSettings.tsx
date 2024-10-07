"use client";
import { Box, Button, Divider, Grid, GridItem, HStack, Input, Stack, Switch, Text, useDisclosure } from "@chakra-ui/react"
import ChangePassword from "./ChangePassword"
import TwoFactorAuth from "./TwoFactorAuth";
import EnabledTwoFactor from "./EnabledTwoFactor";

const GeneralSettings = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { 
        isOpen: isOpen2FA, 
        onClose: onClose2FA, 
        onOpen: onOpen2fa
    } = useDisclosure();
    const { 
        isOpen: isOpenEnable2FA, 
        onClose: onCloseEnable2FA, 
        onOpen: onOpenEnable2fa
    } = useDisclosure();
  return (
    <div>
        <HStack justify={"space-between"}>
            <Stack>
                <Text fontWeight={600} fontSize={"1rem"}>Personal Details</Text>
                <Text fontSize={"14px"} color={"gray.500"}>Update your personal details.</Text>
            </Stack>
            <Button fontSize={"15px"} h={"38px"} px={3} py={1}>Save Changes</Button>
        </HStack>
        <Box className="bg-white p-4 rounded-md border mt-5">
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text>Name</Text>
                </GridItem>
                <GridItem colSpan={1}>
                    <Input type="text" value={"Chudi"}/>
                </GridItem>
                <GridItem colSpan={1}>
                    <Input type="text" value={"victor"}/>
                </GridItem>
            </Grid>
            <Divider my={3} />
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text fontWeight={500}>Email Address</Text>
                    <Text fontSize={"15px"} h={"38px"} px={3} color={"gray.500"}>Your associated email address</Text>
                </GridItem>
                <GridItem colSpan={2}>
                    <Input type="email" value={"chudi@admin.com"}/>
                </GridItem>
            </Grid>
            <Divider my={3} />
            <Grid templateColumns='repeat(3, 1fr)' gap={4}>
                <GridItem colSpan={1}>
                    <Text fontWeight={500}>Role</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Your associated role and permissions level</Text>
                </GridItem>
                <GridItem colSpan={2}>
                    <Input type="text" value={"Admin"}/>
                </GridItem>
            </Grid>
        </Box>
        <Divider my={3} />
        <HStack justify={"space-between"}>
            <Stack>
                <Text fontWeight={600} fontSize={"1rem"}>Security</Text>
                <Text fontSize={"14px"} color={"gray.500"}>Manage your password and 2FA</Text>
            </Stack>
            <Button fontSize={"15px"} h={"38px"} px={3} py={1}>Save Changes</Button>
        </HStack>
        <Box className="bg-white p-4 rounded-md border mt-5">
            <HStack justify={"space-between"}>
                <Stack>
                    <Text fontWeight={600} fontSize={"1rem"}>Password</Text>
                    <Text fontSize={"14p"} color={"gray.500"}>Change your current password</Text>
                </Stack>
                <Button onClick={onOpen} variant={"outline"} fontSize={"15px"} h={"38px"} px={3}>Change password</Button>
            </HStack>
            <Divider my={3} />
            <HStack justify={"space-between"}>
                <Stack>
                    <Text fontWeight={600} fontSize={"1rem"}>Enable Two-Factor Authentication</Text>
                    <Text fontSize={"14px"} color={"gray.500"}>Two-Factor authentication adds another layer of security to your account.</Text>
                </Stack>
                <Switch 
                size='lg' 
                onChange={(e) => {
                    if(e.target.checked){onOpen2fa()}
                }} 
                />
            </HStack>
        </Box>
        <ChangePassword onClose={onClose} isOpen={isOpen} />
        <TwoFactorAuth isOpen={isOpen2FA} onClose={onClose2FA} onOpenEnable2fa={onOpenEnable2fa}/>
        <EnabledTwoFactor isOpen={isOpenEnable2FA} onClose={onCloseEnable2FA}/>
    </div>
  )
}

export default GeneralSettings