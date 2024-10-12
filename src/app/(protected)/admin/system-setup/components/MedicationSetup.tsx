import { HStack, Stack, Text } from "@chakra-ui/react"

const MedicationSetup = () => {
  return (
   <Stack>
        <Text>Medication Setup</Text>
        <Text>Placeholder goes here</Text>
        <HStack gap={5}>
            <Stack>
                <Text>Setup Medication Type</Text>
                <Text>Setup Essentials</Text>
                <Text>Setup Inventory</Text>
            </Stack>
            <Stack p={5} bg={"white"} rounded={"small"}>
                
            </Stack>
        </HStack>
   </Stack>
  )
}

export default MedicationSetup