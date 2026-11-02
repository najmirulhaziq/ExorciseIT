//A simple function to test our script connection
function testAlert() {
    alert('Success! The main.js file is connected.');
}

//Formats a number as Malaysian Ringgit, e.g. 1200 -> RM 1,200.00
function formatMoney(amount) {
    return 'RM ' + amount.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

//Makes user-typed text safe to place inside innerHTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

//Validates the booking form and shows the calculated cost
function calculateBooking() {
    //1.Clear all previous error messages and the previous result
    document.getElementById('customerNameError').innerHTML="";
    document.getElementById('customerEmailError').innerHTML="";
    document.getElementById('appointmentDateError').innerHTML="";
    document.getElementById('quantityError').innerHTML="";
    document.getElementById('packageError').innerHTML="";
    document.getElementById('termsError').innerHTML="";
    document.getElementById('result').innerHTML="";

    //2.Get values and elements from the form
    const customerName=document.getElementById('customerName').value;
    const customerEmail=document.getElementById('customerEmail').value;
    const appointmentDate=document.getElementById('appointmentDate').value;
    const quantity=document.getElementById('quantity').value;
    const selectedPackage=document.querySelector('input[name="package"]:checked');
    const selectedExtras=document.querySelectorAll('input[name="extras"]:checked');
    const terms=document.getElementById('terms');
    const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const taxRate=0.08; //8% service tax
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isValid=true; //A "flag" variable to track validation status

    //3.Perform validation checks
    if (customerName.trim() ==="") {
        document.getElementById('customerNameError').innerHTML="Customer name is required.";
        isValid=false;
    }
    if (customerEmail.trim() ==="") {
        document.getElementById('customerEmailError').innerHTML="Customer email is required.";
        isValid=false;
    } else if (!emailPattern.test(customerEmail.trim())) {
        document.getElementById('customerEmailError').innerHTML="Enter a valid email address.";
        isValid=false;
    }
    if (appointmentDate === "") {
        document.getElementById('appointmentDateError').innerHTML = "Appointment date is required.";
        isValid = false;
    } else if (new Date(appointmentDate + 'T00:00:00') < today) {
        document.getElementById('appointmentDateError').innerHTML = "Appointment date must not be in the past.";
        isValid = false;
    }
    if (quantity.trim() ==="") {
        document.getElementById('quantityError').innerHTML="Number of sessions is required.";
        isValid=false;
    } else if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 20) {
        document.getElementById('quantityError').innerHTML="Enter a whole number from 1 to 20.";
        isValid=false;
    }
    if (!selectedPackage) {
        document.getElementById('packageError').innerHTML="Please select a package.";
        isValid=false;
    }
    if (!terms.checked) {
        document.getElementById('termsError').innerHTML="You must agree to the terms and conditions.";
        isValid=false;
    }

    //4.Stop here if anything is invalid
    if (!isValid) {
        document.getElementById('result').innerHTML='<p class="result-empty">Fix the errors on the left to see your estimate.</p>';
        return false;
    }

    //5.Calculate the cost
    const sessions=Number(quantity);
    const packagePrice=Number(selectedPackage.dataset.price);

    let extrasPrice=0;
    let extrasRows="";
    selectedExtras.forEach(function(extra) {
        const price=Number(extra.dataset.price);
        extrasPrice+=price;
        extrasRows+='<tr><td>' + extra.value + '</td><td>' + formatMoney(price) + '</td></tr>';
    });

    const pricePerSession=packagePrice + extrasPrice;
    const subtotal=pricePerSession * sessions;
    const tax=subtotal * taxRate;
    const total=subtotal + tax;

    //6.Display the result
    const dateText=new Date(appointmentDate + 'T00:00:00').toLocaleDateString('en-MY', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    let html='<table class="result-table result-customer">';
    html+='<tr><td>Name</td><td>' + escapeHtml(customerName.trim()) + '</td></tr>';
    html+='<tr><td>Email</td><td>' + escapeHtml(customerEmail.trim()) + '</td></tr>';
    html+='<tr><td>Appointment</td><td>' + dateText + '</td></tr>';
    html+='</table>';

    html+='<table class="result-table">';
    html+='<tr class="result-line"><td>' + selectedPackage.value + '</td><td>' + formatMoney(packagePrice) + '</td></tr>';
    html+=extrasRows;
    html+='<tr class="result-line"><td>Price per session</td><td>' + formatMoney(pricePerSession) + '</td></tr>';
    html+='<tr><td>Sessions</td><td>x ' + sessions + '</td></tr>';
    html+='<tr class="result-line"><td>Subtotal</td><td>' + formatMoney(subtotal) + '</td></tr>';
    html+='<tr><td>Service tax (8%)</td><td>' + formatMoney(tax) + '</td></tr>';
    html+='</table>';
    html+='<p class="result-total"><span>Total</span><strong>' + formatMoney(total) + '</strong></p>';

    document.getElementById('result').innerHTML=html;

    //7. Return the final validation status
    return isValid;
}

//Resets the form, the error messages and the result panel
function resetCalculator() {
    document.getElementById('bookingForm').reset();
    document.getElementById('customerNameError').innerHTML="";
    document.getElementById('customerEmailError').innerHTML="";
    document.getElementById('appointmentDateError').innerHTML="";
    document.getElementById('quantityError').innerHTML="";
    document.getElementById('packageError').innerHTML="";
    document.getElementById('termsError').innerHTML="";
    document.getElementById('result').innerHTML='<p class="result-empty">Choose a package and select Calculate total.</p>';
}

//Opens the Terms and Conditions pop-up
function openTerms(event) {
    event.preventDefault();
    document.getElementById('termsDialog').showModal();
}

//Closes the Terms and Conditions pop-up
function closeTerms() {
    document.getElementById('termsDialog').close();
}