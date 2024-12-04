// html
const buttonLogin = document.querySelector('.bt-login');
let username = document.getElementById("username");
let password = document.getElementById("password");
let errorAuthentication = document.querySelector(".authentication-error-text");

const BASE_URL = "http://localhost:8080";


buttonLogin.addEventListener("click", async function makeLogin(event) {
    event.preventDefault();
    console.log("entrei no botão danado");
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
            await saveTokenInSLocalStorage(response);
            // alert("Login is successfully");
            // redirect to task screen
            window.location.href = "../task/task.html";
            return;
        }
        
        // checking possibles errors
        if(response.status === 403){
            errorAuthentication.textContent = "usuário ou senha inválidos";
            errorAuthentication.style.display = "flex";
            password.value = "";
        }
        else {
            alert(`unexpected error ${response.statusText}`);
        }

    } catch(error){
        alert(`Error to connect server ${error.message}`);
    }
});

async function saveTokenInSLocalStorage(response){
    const data = await response.json();
    const token = data.email;

    // storing token in local storage
    localStorage.setItem('token', token);
}