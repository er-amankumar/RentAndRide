 
const form = document.getElementById("forgotForm");
const message = document.getElementById("errorMessage");
const otpSection = document.getElementById("otpSection");
const otp = document.getElementById("otp");
const otpVerify = document.getElementById("otpVerify");
const submit = document.getElementById("submit");
 

/// otp send form 
form.addEventListener("submit", async (e) => {

    // Page refresh/redirect ko rokega
     e.preventDefault();

    const email = document.getElementById("email").value;

    try {

        const response = await fetch("/forgotpassword", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email
            })
        });

        const data = await response.json();

        // Backend ka message p tag me
        message.innerText = data.message;

        if (data.success) {
            message.style.color = "green";
            otpSection.style.display = "block"
            submit.style.display="none"
            otpVerify.style.display="block"
            otp.style.display="block"

        } else {
            message.style.color = "red";
            otpSection.style.display = "none"
        }

    } catch (error) {

        console.error(error);

        message.innerText = "Something went wrong";
        message.style.color = "red";
    }
});

/// otp verify send form 
otpVerify.addEventListener("click", async (e) => {
      alert("verify button click")
    // Page refresh/redirect ko rokega
     e.preventDefault();

    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;

    try {

        const response = await fetch("/verifyotp", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                otp:otp
            })
        });

        const data = await response.json();

        // Backend ka message p tag me
        message.innerText = data.message;
        console.log(data)
        if(data.success){
            window.location.href =
            "/change-password?token=" +
            encodeURIComponent(data.resetToken);
        }
 
    } catch (error) {

        console.error(error);

        message.innerText = "Something went wrong";
        message.style.color = "red";
    }
});


 