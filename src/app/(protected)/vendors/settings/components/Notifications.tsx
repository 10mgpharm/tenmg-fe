import { Button, Divider, Switch } from "@chakra-ui/react"

const notifications = [
    {title: "License Expiry", desc: "Get a notification when your license is about to expire or has expired."},
    {title: "Customers' Credit Application", desc: "Get notification when customers submit a credit application."},
    {title: "Customers' Credit Offer Status", desc: "Get notification of customer's credit offer status."},
    {title: "Customer Repayment [auto or manual payment]", desc: "Get a notification when a repayment is done for your customers."},
    {title: "Lender Approve Customer Application", desc: "Get a notification when a lender approves your customer's credit application."},
    {title: "Loan Offering", desc: "Get notification when admin sends loan offer to your customer."},
    {title: "Customer Pay with 10mg Credit Voucher", desc: "Get a notification when your customer pays with 10MG credit voucher."},
]
const Notifications = () => {
  return (
    <div>
        <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <p className="text-gray-500 text-sm">Update your notification preference here</p>
            <Divider />
        </div>
        <div className="py-5">
            {
                notifications?.map((item, index) => (
                    <div key={index} className="border p-4 rounded-md flex items-center justify-between mb-5">
                        <div className="max-w-xl">
                            <h3 className="font-medium text-gray-700">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <Switch size={"lg"}/>
                    </div>
                ))
            }
        </div>
        {/* <div className="flex justify-end">
            <div className="flex items-center gap-3">
                <Button variant={"outline"}>Discard</Button>
                <Button bg={"blue.700"}>Save Changes</Button>
            </div>
        </div> */}
    </div>
  )
}

export default Notifications