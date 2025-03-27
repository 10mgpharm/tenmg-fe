// // const paymentForm = document.getElementById("payment-form");

//       // paymentForm.addEventListener(“submit”, payFincra, false);
//       function payFincra(e) {
//         e.preventDefault();
//         Fincra.initialize({
//           key: “pk_test_NjQ1MjBlZDliZmRmMjg2YmI1OGFhM2U0OjoxMjc5MzI=“,
//           amount: parseInt(document.getElementById(“amount”).value),
//           currency: “NGN”,
//           reference: “PAY-20250127-181025-MGGA1”,
//           customer: {
//             name: document.getElementById(“name”).value,
//             email: document.getElementById(“email”).value,
//             phoneNumber: document.getElementById(“phoneNumber”).value,
//           },
//           //Kindly chose the bearer of the fees
//           feeBearer: “business” || “customer”,
//           onClose: function () {
//             alert(“Transaction was not completed, window closed.“);
//           },
//           onSuccess: function (data) {
//             const reference = data.reference;
//             console.log(data);
//             // alert(“Payment complete! Reference: ” + reference);
//           },
//         });
//       }
