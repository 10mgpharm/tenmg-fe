"use client"
import { Box, Button, Menu, MenuButton, MenuItem, MenuList, } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'

export default function ShippingAddress
  () {
  return (
    <section>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-11/12 mx-auto py-8'>

        {Array(4)
          .fill(null)
          .map((i) => (
            <div key={i} className='border border-gray-300 p-5 flex flex-col gap-2 rounded-md mx-auto w-full cursor-pointer'>
              <h2 className='text-xl font-bold'>Shipping Address</h2>
              <p className='text-base font-bold'>+234 8123 456 789 </p>
              <p className='text-sm text-gray-500'>Apt. 721 56357 Abshire Squares, Jonesbury, AR 66477</p>

              <HStack width={'65%'}>
                <EditShippingAddress id={"2"} />
                <DeleteShippingAddress />
              </HStack>
            </div>
          ))}
      </div>

      <div className='mt-10 mb-6 w-1/4 mx-auto'>
        <EditShippingAddress />
      </div>
    </section>
  )
}


import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl, FormLabel, HStack, Input, Flex, Select
} from '@chakra-ui/react'


function DeleteShippingAddress() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} variant={"outline"} colorScheme={"red"} size={"sm"} width={"100%"}>Delete Address</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this address from your shipping address?
          </ModalBody>

          <ModalFooter>
            <div className='w-full flex items-center justify-between gap-4'>
              <Button variant={"outline"} colorScheme={"grey"} size={"sm"} width='100%'>Discard</Button>
              <Button variant={"outline"} colorScheme={"red"} size={"sm"} width='100%'>Delete</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { ChevronDownIcon } from 'lucide-react'

// import { Input } from '@chakra-ui/react'
type EditShippingAddressProps = {
  id?: string;
};
function EditShippingAddress({ id }: EditShippingAddressProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log("country:", Country.getAllCountries());

  // const 
  const [countryPlaceHolder, setCountryPlaceholder] = useState<string>("Select a country");
  const [countries, setCountries] = useState<ICountry[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [statePlaceHolder, setStatePlaceholder] = useState<string>("Select a state");
  const [states, setStates] = useState<IState[] | null>(null);

  const [cityPlaceholder, setCityPlaceholder] = useState<string>("Select a city");
  const [cities, setCities] = useState<ICity[] | null>(null);


  useEffect(() => {
    setCountries(Country.getAllCountries())
  }, [])

  const filteredCountries = useMemo(() => {
    return countries?.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countries, searchQuery]);

  const handleCountrySearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCountryChange = (country: ICountry) => {
    // console.log("event", e.target.value, "country", country);
    setCountryPlaceholder(country?.name);
    setStates(State.getStatesOfCountry(country?.isoCode));
  }

  const handleSelectState = (state: IState) => {
    // console.log("event", e.target.value, "state", state)
    setStatePlaceholder(state?.name);
    setCities(City.getCitiesOfState(state?.countryCode, state?.isoCode));
  }

  const handleSelectCity = (e, city: ICity) => {
    console.log("event", e.target.value, "city", city)
    setCityPlaceholder(city?.name);
    // setCities(City.getCitiesOfState(city?.countryCode, city?.isoCode))
  }






  return (
    <>
      <Button onClick={onOpen} variant={id ? "outline" : "solid"} colorScheme={"blue"} size={"sm"} width={"100%"}>{id ? "Edit Address" : "Add Shipping Address "}</Button>

      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={true} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{id ? "Edit Shipping Address" : "Add Shipping Address "}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form className="space-y-5 mt-6">
              <HStack gap={5}>
                <FormControl>
                  <FormLabel>Address Label</FormLabel>
                  <Input type="text" placeholder={'eg: Pharmacy One'} />
                </FormControl>
              </HStack>

              <HStack gap={5}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" placeholder={'Jacquelyn Bernard'} />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input type="text" placeholder={'0812 342 3456'} />
                </FormControl>
              </HStack>

              <div className='grid gap-4 grid-cols-2'>
                <div className=''>
                  <FormControl >
                    <FormLabel>Country</FormLabel>
                    <Menu>
                      <MenuButton as={Button} variant={"outline"} w="100%" rightIcon={<ChevronDownIcon />} colorScheme={"grey.400"}>
                        {countryPlaceHolder}
                      </MenuButton>
                      <MenuList maxH="300px" overflowY="auto">
                        <Box p={2}>
                          <Input
                            placeholder="Search for a country"
                            value={searchQuery}
                            onChange={(e) => handleCountrySearch(e)}
                          />
                        </Box>
                        {filteredCountries?.map((country) => (
                          <MenuItem key={country.isoCode} value={country.isoCode} onClick={(e) => handleCountryChange(country)}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                </div>
                <div className=''>
                  <FormControl >
                    <FormLabel>State</FormLabel>
                    <Menu>
                      <MenuButton as={Button} variant={"outline"} w="100%" rightIcon={<ChevronDownIcon />} colorScheme={"grey.400"} >
                        {statePlaceHolder}
                      </MenuButton>
                      <MenuList maxH="300px" overflowY="auto">

                        {states?.map((state) => (
                          <MenuItem key={state.isoCode} value={state.isoCode} onClick={(e) => handleSelectState(state)}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </FormControl>
                </div>
              </div>

              <HStack gap={5}>
                <FormControl>
                  <FormLabel>City</FormLabel>

                  <Menu>
                    <MenuButton as={Button} variant={"outline"} w="100%" rightIcon={<ChevronDownIcon />} colorScheme={"grey.400"}>
                      {cityPlaceholder}
                    </MenuButton>
                    <MenuList maxH="300px" overflowY="auto">

                      {cities?.map((city, i) => (
                        <MenuItem key={i} onClick={(e) => handleSelectCity(e, city)}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </FormControl>
                <FormControl>
                  <FormLabel>Zip Code</FormLabel>
                  <Input type="text" placeholder={'eg: 1006390'} />
                </FormControl>
              </HStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <div className='w-fit flex items-center justify-end gap-4'>
              <Button variant={"solid"} size={"sm"} width='125px'>Save</Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}