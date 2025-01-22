import pill1 from '@public/assets/images/Rectangle19718.png';
import pill2 from '@public/assets/images/medicine-8287535_1280.webp';
import avatar from '@public/assets/images/avatar.jpg';

export const records = [
    {id: 1, title: "Today's Sales", amount: "₦0", changeType: "INCREASE", timeStamp: " vs. last week", percentage: "2.35%"},
    {id: 2, title: "Today's Revenue", amount: "₦0", changeType: "DECREASE", timeStamp: " vs. last week", percentage: "2.35%"},
    {id: 3, title: "Today's Customers", amount: "0", changeType: "INCREASE", timeStamp: " vs. last week", percentage: "5.35%"},
    {id: 4, title: "Today's Vendor", amount: "₦0", changeType: "INCREASE", timeStamp: " vs. last week", percentage: "2.35%"},
]

export const loanData = [
    {id: "10MG-LN0002", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disbursementStatus: "Pharm license.pdf", status: "Enabled"},
    {id: "10MG-LN0001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disbursementStatus: "Pharm license.pdf", status: "Enabled"},
    {id: "10MG-LN0003", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disbursementStatus: "Pharm license.pdf", status: "Enabled"},
]

export const orderData = [
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3066", customer: "Olivia Rhye", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Pending", total: "#2,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3065", customer: "Phoenix Baker", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Cancelled", total: "#6,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
    {id: "#3067", customer: "Lana Steiner", phone: "+234-708-934-9832", date: "Jan 6, 2024", status: "Completed", total: "#9,000", address: "42 Deji Olamiju Street, Gbagada"},
]

export const adminOrderData = [
    { id: 1, name: "10mg Pharma", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Pending"},
    { id: 2, name: "Ahmed Pharmacy", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Shipped"},
    { id: 3, name: "Tonia Pharmaceuticals", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Completed"},
    { id: 4, name: "Francis Health Consult, Lokoja", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Completed"},
    { id: 5, name: "Macsunik Pharmacy Ltd", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Pending"},
    { id: 6, name: "Femih pharmacy", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Completed"},
    { id: 7, name: "MED PHARMACY", orderId: "0COPF-240816-J7QKV", cost: "₦66,448.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Shipped"},
    { id: 8, name: "10mg Pharma", orderId: "0COPF-240816-J7QKV", cost: "₦225,600.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Completed"},
    { id: 9, name: "MED PHARMACY", orderId: "0COPF-240816-J7QKV", cost: "₦2,061,135.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Pending"},
    { id: 10, name: "MED PHARMACY", orderId: "0COPF-240816-J7QKV", cost: "₦2,061,135.00", date: "August 16, 2024", time: "4:00:09 PM", status: "Completed"},
]

export const productData = [
    {id: 1, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Low', image: pill1},
    {id: 2, name: "Synthetic opioids",  wieght: "930mg", price: "#2,600", category: "Injection", inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Available', image: pill2},
    {id: 3, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Tablet",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Low', image: pill1},
    {id: 4, name: "Global Pentazocine", wieght: "500mg", price: "#2,600", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Available', image: pill1},
    {id: 5, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Available', image: pill1},
    {id: 6, name: "Global Pentazocine", wieght: "10mg",  price: "#2,600", category: "Injection", inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Available', image: pill1},
    {id: 7, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Injection",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Available', image: pill1},
    {id: 8, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Injection",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Low', image: pill1},
    {id: 9, name: "Global Pentazocine", wieght: "100mg", price: "#2,600", category: "Tablet",  inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Available', image: pill2},
    {id: 10, name: "Global Pentazocine", wieght: "90mg",  price: "#2,600", category: "Tablet", inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Available', image: pill2},
]

export const productData2 = [
    {name: "Global Pentazocine", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Active', image: pill1},
    {name: "Synthetic opioids",  category: "Injection", inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Inactive', image: pill2},
    {name: "Global Pentazocine", category: "Tablet",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Inactive', image: pill1},
    {name: "Global Pentazocine", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Active', image: pill1},
    {name: "Global Pentazocine", category: "Syrup",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Inactive', image: pill1},
    {name: "Global Pentazocine", category: "Injection", inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Active', image: pill1},
    {name: "Global Pentazocine", category: "Injection",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Active', image: pill1},
    {name: "Global Pentazocine", category: "Injection",  inventory: "In stock", quantity: 100, brand: "Pentazocine (NEML 23.1)", status: 'Active', image: pill1},
    {name: "Global Pentazocine", category: "Tablet",  inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Active', image: pill2},
    {name: "Global Pentazocine", category: "Tablet", inventory: "Out of stock", quantity: 0, brand: "Morpent (NEML 23.1)", status: 'Inactive', image: pill2},
]

export const productReviews = [
    {id: 1, image: avatar, title: "MedFERTIL FOR MEN TABLETS - (CARNITINE , MULTIVITAMINS)", subtitle: "Pentazocine (NEML 23.1)", content: "This Property is a true masterpiece that combines luxurious living with the beauty of its surroundings." },
    {id: 1, image: avatar, title: "MedFERTIL FOR MEN TABLETS - (CARNITINE , MULTIVITAMINS)", subtitle: "Pentazocine (NEML 23.1)", content: "This Property is a true masterpiece that combines luxurious living with the beauty of its surroundings." },
]

export const UserData = [
    {id: 1, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Suspended"},
    {id: 2, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Active"},
    {id: 3, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Pending"},
    {id: 4, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Suspended"},
    {id: 5, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Active"},
    {id: 6, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Pending"},
    {id: 7, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Suspended"},
    {id: 8, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Active"},
    {id: 9, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Active"},
    {id: 10, name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", supplier_id: "1CZ454M4621P07H", business_name: "Kfc pharmaceutical ltd", date: "24th July 2024", status: "Suspended"},
]

export const transactionData = [
    {id: 1, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Awaiting", status: "Completed"},
    {id: 2, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Awaiting", status: "Pending"},
    {id: 11,transaction_type: "payout",  name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Awaiting",  status: "Pending"},
    {id: 12,transaction_type: "payout",  name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Awaiting",  status: "Completed"},
    {id: 3, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Awaiting", status: "Completed"},
    {id: 4, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Completed", status: "Successful"},
    {id: 5, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Completed", status: "Successful"},
    {id: 6, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Completed", status: "Successful"},
    {id: 7, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "Completed", status: "Successful"},
    {id: 8, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "History", status: "Completed"},
    {id: 9, transaction_type: "payout", name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "History", status: "Completed"},
    {id: 10,transaction_type: "payout",  name: "Chidi Victor", amount: "1000", date: "Jan 6 2024", type: "History",  status: "Pending"},
]

export const discountData = [
    {id: 1, title: "Paracetamol", discount_code: "CONSODE", value: "50%", status: "Active", method: "Code", used: 100},
    {id: 2, title: "Paracetamol", discount_code: "CONSODE", value: "50%", status: "Active", method: "Automatic Discount", used: 100},
    {id: 3, title: "Diclofenac", discount_code: "CONSODE", value: "50%", status: "Expired", method: "Code", used: 100},
    {id: 4, title: "Paracetamol", discount_code: "HOLIDAY", value: "10%", status: "Active", method: "Code", used: 100},
    {id: 5, title: "Paracetamol", discount_code: "CONSODE", value: "50%", status: "Active", method: "Automatic Discount", used: 100},
    {id: 6, title: "Paracetamol", discount_code: "CHUDI", value: "50%", status: "Expired", method: "Code", used: 100},
    {id: 7, title: "Diclofenac", discount_code: "CONSODE", value: "50%", status: "Active", method: "Code", used: 100},
    {id: 8, title: "Paracetamol", discount_code: "CONSODE", value: "50%", status: "Active", method: "Code", used: 100},
    {id: 9, title: "Paracetamol", discount_code: "CONSODE", value: "50%", status: "Expired", method: "Automatic Discount", used: 100},
    {id: 10, title: "Diclofenac", discount_code: "CONSODE", value: "50%", status: "Expired", method: "Automatic Discount", used: 100},
]

export const LoanData = [
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Enabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Disabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Disabled"},
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", disburstment: "Pharm license.pdf", vendor: "Olivia Rhye", status: "Disabled"},
]

export const repaymentData = [
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Paid", loan_amount: "₦1,300,000"},   
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Paid", loan_amount: "₦1,300,000"},   
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Paid", loan_amount: "₦1,300,000"},   
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Paid", loan_amount: "₦1,300,000"},   
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Overdue", loan_amount: "₦1,300,000"},   
    {name: "10MG-LN001", amount: "#1,300,000", date: "Aug 21, 2024", payment_date: "Aug 21, 2024", status: "Overdue", loan_amount: "₦1,300,000"},   
]

export const applicationData = [
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Approved", loan_amount: "₦1,300,000"},   
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Approved", loan_amount: "₦1,300,000"},   
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Awaiting Approval", loan_amount: "₦1,300,000"},   
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Rejected", loan_amount: "₦1,300,000"},   
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Awaiting Approval", loan_amount: "₦1,300,000"},   
    {id: "10MG-LN001", name: "Olivia Rhye", amount: "#1,300,000", date: "Aug 21, 2024", status: "Approved", loan_amount: "₦1,300,000"},   
]

export const LogsData = [
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Login Successful"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Uploaded Document.pdf"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "New Account Registered"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Password Changed"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Payment via Credit Card"},
    {timestamp: "2024-09-08   12:45:32", event: "Payment Processed", user: "Jude Bellingham", action: "Error 503: Service Unavailable"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Logged Out"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Login Successful"},
    {timestamp: "2024-09-08   12:45:32", event: "User Login", user: "Jude Bellingham", action: "Login Successful"},
    {timestamp: "2024-09-08   12:45:32", event: "User Logout", user: "Jude Bellingham", action: "Login Successful"},
    {timestamp: "2024-09-08   12:45:32", event: "User Logout", user: "Jude Bellingham", action: "Login Successful"},
]

export const APIData = [
    {id: 1, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Live"},
    {id: 2, vendors: "10mg Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Live"},
    {id: 3, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Test"},
    {id: 4, vendors: "Francis Health Consult, Lokoja", reference_id: "0COPF-240816-J7QKV", status: "Live"},
    {id: 5, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Live"},
    {id: 6, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Test"},
    {id: 7, vendors: "Tonia Pharmaceuticals", reference_id: "4KDJU-230907-LQ0OD", status: "Live"},
    {id: 8, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Test"},
    {id: 9, vendors: "Tonia Pharmaceuticals", reference_id: "0COPF-240816-J7QKV", status: "Live"},
]

export const MemberData = [
  {id: 1, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Accepted", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 2, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Accepted", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 3, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Invited", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 4, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Invited", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 5, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Removed", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 6, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Accepted", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 7, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Accepted", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
  {id: 8, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Accepted", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Business Analyst"},
  {id: 9, image: avatar, name: "Adeola Oluwafumilayo Joy", email: "johnajayi@lendsqr.com", status: "Removed", invited_by: "Ahmed Olarewaju", date: "2023-09-25 @ 08:15 PM", role: "Admin"},
];

export const activityData = [
    {type: "event type", description: "Description here", timestamp: "Sep 23, 2023 @ 12:30:54 PM"},
    {type: "event type", description: "Description here", timestamp: "Sep 23, 2023 @ 12:30:54 PM"},
    {type: "event type", description: "Description here", timestamp: "Sep 23, 2023 @ 12:30:54 PM"},
    {type: "event type", description: "Description here", timestamp: "Sep 23, 2023 @ 12:30:54 PM"},
]

export const customersManagementData = [
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024", status: "Suspended"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024", status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024", status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024",  status: "Suspended"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024", status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", dateCreated: "July 24, 2024", status: "Suspended"},
]

export const creditScoreData = [
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "650", percentage: "70%", status: "Suspended"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "830",percentage: "20%",  status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "250", percentage: "40%", status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "623", percentage: "59%", status: "Suspended"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "234", percentage: "29%", status: "Active"},
    {id: "REF-001-2024", name: "Adeola Oluwafumilayo Joy", email: "chudivictor9@gmail.com", score: "300", percentage: "86%", status: "Suspended"},
]