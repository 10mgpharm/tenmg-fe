import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import React from 'react'
import SignUpField from './SignupField'

export default function SignupTab() {
  return (
      <Tabs variant="unstyled" defaultIndex={0} isFitted>
          <TabList>
              <Tab
                  _selected={{ bg: "primary.500", color: "white" }}
                  h={{ base: "58px", md: "78px" }}
                  color="primary.500"
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
              >
                  Supplier
              </Tab>
              <Tab
                  _selected={{ bg: "primary.500", color: "white" }}
                  h={{ base: "58px", md: "78px" }}
                  color="primary.500"
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
              >
                  Pharmacy or Hospital
              </Tab>
          </TabList>

          <TabPanels>
              <TabPanel>
                  <SignUpField title="supplier" />
              </TabPanel>
              <TabPanel>
                  <SignUpField title="pharmacy" />
              </TabPanel>
          </TabPanels>
      </Tabs>
  )
}
