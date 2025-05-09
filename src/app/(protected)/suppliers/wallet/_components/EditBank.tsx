import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Select from 'react-select';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    fetchingWallet: () => void;
    endpoint: string;
}
const EditBank = ({isOpen, onClose}: Props) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Add Bank Account</ModalHeader>
      <ModalCloseButton />
        <ModalBody>
            {/* <form className='space-y-4 mb-6' onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              className="col-span-2"
              isInvalid={!!errors.bankName}
            >
              <Select
                placeholder="Choose Bank"
                {...register("bankCode", {
                  required: "Please select a bank",
                })}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  const selectedText =
                    e.target.options[e.target.selectedIndex].text;
                  setValue("bankCode", selectedValue);
                  setValue("bankName", selectedText);
                  trigger(["bankCode", "bankName"]);
                }}
              >
                {banks?.map((bank, index) => (
                  <option key={index} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </Select>
              {errors.bankName && (
                <Text fontSize="sm" color="red.500">
                  {errors.bankName.message}
                </Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.accountNumber}>
              <FormLabel>Account Number</FormLabel>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="e.g 123456789"
                type="number"
                isInvalid={!!errors.accountNumber}
                _focus={{
                  border: !!errors.accountNumber ? "red.300" : "border-gray-300",
                }}
                {...register("accountNumber", {
                  required: "Account Number is Required"
                })}
              />
              {errors.accountNumber && (
                <Text fontSize="sm" color="red.500">
                  {errors.accountNumber.message}
                </Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.accountName}>
              <FormLabel>Account Name</FormLabel>
              <Input
                id="accountName"
                name="accountName"
                placeholder="Chidi Victor"
                type="text"
                isInvalid={!!errors.accountName}
                _focus={{
                  border: !!errors.accountName ? "red.300" : "border-gray-300",
                }}
                onKeyDown={(e) => {
                  if (/\d/.test(e.key)) {
                    e.preventDefault(); // block numbers
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text');
                  if (/\d/.test(paste)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/[0-9]/g, ""); // remove numbers
                  setValue("accountName", value);
                }}
                {...register("accountName", {
                  required: "Account Name is Required",
                  validate: (value) => !/\d/.test(value) || "Account name should not contain numbers",
                })}
              />
              {errors.accountName && (
                <Text fontSize="sm" color="red.500">
                  {errors.accountName.message}
                </Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.bankCode}>
              <FormLabel>Bank Code</FormLabel>
              <Input
                id="bankCode"
                name="bankCode"
                placeholder="e.g 139-0568"
                type="number"
                disabled
                isInvalid={!!errors.bankCode}
                _disabled={{
                  color: "gray.700",
                  opacity: 1,
                }}
                _focus={{
                  border: !!errors.bankCode ? "red.300" : "border-gray-300",
                }}
                {...register("bankCode", {
                  required: "Bank Code is Required"
                })}
              />
              {errors.bankCode && (
                <Text fontSize="sm" color="red.500">
                  {errors.bankCode.message}
                </Text>
              )}
            </FormControl>
            <Button type='submit' w={"full"} mt={4} colorScheme='blue'>
              {info ? "Edit Account" : "Add Account"}
            </Button>
          </form> */}
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}

export default EditBank