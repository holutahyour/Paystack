
let paymentObject = function () {
    return{
        PayStackPaymentUrl: 'https://api.paystack.co/transaction/initialize',
        VerifyPaymentUrl: 'https://api.paystack.co/transaction/verify/',
        TestPublicKey:'pk_test_976705ecdc8580751b1bb71d448b65155a1b86df',
        SecretKey:'sk_test_430fc5162c78e9614ca7f44cf8e452480f26d4ad',
        EmailAddress: 'holutahyour@gmail.com',
        Amount: "20000",
        FirstName: '',
        LastName: ''
    }
}();


let verifyPayment = async function(referenceId) {
    let response = await fetchApi(
        paymentObject.VerifyPaymentUrl + referenceId,
        'GET',
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paymentObject.SecretKey}`
        },
    );

    console.log(response);

    return response;
}


let payWithPaystack = async function () {
    let response = await fetchApi(
        paymentObject.PayStackPaymentUrl,
        'POST',
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${paymentObject.SecretKey}`
        },
        {
            email: paymentObject.EmailAddress,
            amount: paymentObject.Amount
        }
    );

    console.log(response);

    let verification = await verifyPayment(response.data.reference)

    console.log(verification);

    return response;
}


async function fetchApi (url = '', _method = 'GET', _headers = {}, data = {}){
    var dataWithBody = {
        method: _method,
        credential: 'same-origin',
        headers: _headers,
        body: JSON.stringify(data),
    }

    var dataWithoutBody = {
        method: _method,
        credential: 'same-origin',
        headers: _headers,
    }

    var body = _method == 'POST'? dataWithBody : dataWithoutBody;

    try {
        const res = await fetch(
            url,body);
        return res.json();
    } catch (error) {
        return error;
    }
}


let paymentForm = document.getElementById('paymentForm');
// paymentForm.addEventListener('submit', payWithPaystack, false);

function payWithPaystack() {
let handler = PaystackPop.setup({
    key: paymentObject.TestPublicKey, // Replace with your public key
    // email: document.getElementById('email-address').value,
    email: paymentObject.EmailAddress,
    amount: paymentObject.Amount, // the amount value is multiplied by 100 to convert to the lowest currency unit
    currency: 'NGN', // Use GHS for Ghana Cedis or USD for US Dollars
    ref: 'qwerty-12345', // Replace with a reference you generated
    callback: function(response) {
    //this happens after the payment is completed successfully
    let reference = response.reference;
    alert('Payment complete! Reference: ' + reference);
    // Make an AJAX call to your server with the reference to verify the transaction
    },
    onClose: function() {
    alert('Transaction was not completed, window closed.');
    },
});
handler.openIframe();
}