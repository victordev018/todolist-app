// fields of the credentials
const passFieldOne = document.getElementById("passwordOne");
const passFieldTwo = document.getElementById("passwordTwo");
const username = document.getElementById("username");

// messages errors
const errorUsernameAlreadyExists = document.querySelector(".error-username-already-exists");
const errorValidationPassword = document.querySelector(".error-validation-password");

// button create account
const buttonCreateAccount = document.querySelector(".bt-create-account");

// api url
const BASE_URL = "https://learning-docker-production.up.railway.app";

buttonCreateAccount.addEventListener("click", async function makeLogin(event){

    event.preventDefault();

    // removing message errors
    removingMessageErrorsFromForm();

    // validation password
    if(passFieldOne.value != passFieldTwo.value){
        errorValidationPassword.textContent = "digite a mesma senha nos dois campos"
        errorValidationPassword.style.display = "flex";
        return;
    }

    try {

        // make request
        const response = await fetch(BASE_URL+"/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username.value, password: passFieldOne.value})
        });

        if(response.ok){
            alert("Conta criada com sucesso!");
            window.location.href = "../index.html";
            return;
        }

        // error username already exists
        if(response.status == 403) {
            errorUsernameAlreadyExists.textContent = "já existe um usuário com este nome";
            errorUsernameAlreadyExists.style.display = "flex";
        }

    } catch(error) {
        alert(`Error to connect server ${error.message}`);
    }
});

function removingMessageErrorsFromForm(){
    errorValidationPassword.textContent = "";
    errorValidationPassword.style.display = "none";
    errorUsernameAlreadyExists.textContent = "";
    errorUsernameAlreadyExists.style.display = "none";
}