'use client';

import { useEffect, useState, useTransition } from "react";
import { Button, Input, Select, Card, CardBody, Heading, Divider, Text } from "@chakra-ui/react";
import { getDemoCustomers, initializeLoanApplicationUrl } from "./actions";
import { toast } from "react-toastify";
import { handleServerErrorMessage } from "@/utils";
import { formatAmount } from "@/utils/formatAmount";
import { CustomerDto } from "@/types";

const products = [
    { name: "Paracetamol", price: 25000.00, quantity: 1 },
    { name: "Ibuprofen", price: 150000.00, quantity: 1 },
    { name: "Amoxicillin", price: 30000.00, quantity: 1 },
    { name: "Cough Syrup", price: 20000.00, quantity: 1 },
    { name: "Vitamin C", price: 1000000.00, quantity: 1 },
];

export default function CheckoutPage() {
    const [isPendingInit, startTransition] = useTransition();
    const [isProcessing, startPaymentTransition] = useTransition();

    const [customers, setCustomers] = useState<CustomerDto[]>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto>(null);
    const [cart, setCart] = useState(products);

    const handleCustomerChange = (event) => {
        const customer = customers.find(c => c.name === event.target.value);
        setSelectedCustomer(customer);
    };

    const total = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const discount = total * 0.1; // 10% discount
    const grandTotal = total - discount;

    const handleInitDemo = () => {
        startTransition(async () => {
            try {
                const { data, message, status } = await getDemoCustomers();
                if (status === 'success') {
                    setCustomers(data);
                } else {
                    toast.error(`Error: ${message}`);
                }
            } catch (error) {
                const errorMessage = handleServerErrorMessage(error);
                toast.error(errorMessage);
            }
        })
    }

    const handlePayWith10mgCredit = () => {
        if (!selectedCustomer) return toast.info('Select customer to proceed', {
            position: 'bottom-center'
        });

        startPaymentTransition(async () => {
            try {
                const { data, message, status } = await initializeLoanApplicationUrl({
                    customer: selectedCustomer,
                    requestedAmount: grandTotal,
                });
                if (status === 'success') {
                    console.log(data);
                    window.open(data.url)
                } else {
                    toast.error(`Error: ${message}`);
                }
            } catch (error) {
                const errorMessage = handleServerErrorMessage(error);
                toast.error(errorMessage);
            }
        })
    }

    useEffect(() => {
        handleInitDemo();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 grid md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                    <Heading size="lg" mb={4}>Checkout</Heading>
                    <Divider mb={4} />
                    <div className="flex flex-col space-y-4">
                        <Select placeholder="Select Name" size="lg" onChange={handleCustomerChange}>
                            {isPendingInit && <option>Loading...</option>}
                            {!isPendingInit && customers?.map((customer) => (
                                <option key={customer.name} value={customer.name}>{customer.name}</option>
                            ))}
                        </Select>
                        <Input placeholder="Customer ID" type="tel" size="lg" value={selectedCustomer?.identifier || ""} readOnly />
                        <Input placeholder="Email Address" type="email" size="lg" value={selectedCustomer?.email || ""} readOnly />
                        <Input placeholder="Phone Number" type="tel" size="lg" value={selectedCustomer?.phone || ""} readOnly />
                        <Select size="lg" className="my-5 bg-blue-500">
                            <option value="credit">Pay with 10mg Credit</option>
                        </Select>
                    </div>
                </div>

                {/* Order Summary */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardBody>
                        <Heading size="md" mb={4}>Order Summary</Heading>
                        <Divider mb={4} />
                        <div className="space-y-2">
                            {cart.map((product, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <Text>{product.name}</Text>
                                    <Text>{formatAmount((product.price * product.quantity))}</Text>
                                </div>
                            ))}
                            <Divider my={2} />
                            <div className="flex justify-between font-bold">
                                <Text>Total</Text>
                                <Text>{formatAmount(total)}</Text>
                            </div>
                            <div className="flex justify-between font-bold text-green-600">
                                <Text>Discount (10%)</Text>
                                <Text>-{formatAmount(discount)}</Text>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <Text>Grand Total</Text>
                                <Text>{formatAmount(grandTotal)}</Text>
                            </div>
                        </div>
                        <Button
                            colorScheme="blue"
                            size="lg"
                            width="full"
                            mt={10}
                            isLoading={isProcessing}
                            onClick={handlePayWith10mgCredit}
                        >
                            Place Order
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
