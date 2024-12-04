// html
const buttonLogin = document.querySelector('.bt-login');
let username = document.getElementById("username");
let password = document.getElementById("password");

const BASE_URL = "http://localhost:8080";


buttonLogin.addEventListener("click", async function makeLogin(event) {
    event.preventDefault();
    try {

        // make request
        const response = await fetch(BASE_URL+"/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username.value, password: password.value})
        });

        // checking response
        if(response.ok){
            const data = await response.json();
            const token = data.email;

            // storing token in local storage
            localStorage.setItem('token', token);
            console.log("token is been storing: ", token);

            alert("Login is successfully");
            return;
        }
        
        // checking possibles errors
        if(response.status === 403){
            alert("Error authentication");
            return;
        }
        else {
            alert(`unexpected error ${response.statusText}`);
            return;
        }

    } catch(error){
        alert(`Error to connect server ${error.message}`);
    }
});