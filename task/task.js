// html
const listTask = document.querySelector(".list-task");
const taskItem = document.querySelector(".task-item");
const createTask = document.querySelector(".create-task");
const container = document.querySelector(".container");
const iconCloseForm = document.getElementById("icon-close-form");
const contentFormText = document.querySelector(".input-content-text");
const buttonSaveNewTask = document.querySelector(".bt-create-task");

const BASE_URL = "http://localhost:8080";

const loadTasks = async () => {

    const token = localStorage.getItem('token');
    try {

        const response = await fetch(BASE_URL+"/users/tasks", {
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.ok){
            const data = await response.json();
            fillList(data);
        }

    } catch(error){
        alert(`Error to connect server ${error.message}`)
    }
}

function fillList(data) {

    if(data.length == 0) {
        listTask.innerHTML = `<span class="no-task"> sem tarefas cadastradas </span>`;
        return;
    }

    listTask.innerHTML = ``;

    data.forEach(task => {
        const color = task.done? "#56fa56" : "#eb1e1e";
        listTask.innerHTML += `
        <li class= "task-item" style="background-color:${color}" onClick="updatePropertyDone(${task.id})">
            <button class="bt-icon">
                <img src = "/assets/icons/edit-icon.png" class="icon">
            </button>

            <span class="task-content-text">${task.content}</span>

            <button class="bt-icon" onClick="deleteTaskById(${task.id})">
                <img src = "/assets/icons/delete-icon.png" class="icon">
            </button>
        </li>
        `
    });
}

const deleteTaskById = async (id) => {

    const token = localStorage.getItem('token');
    try {

        const response = await fetch(BASE_URL+`/tasks/delete/${id}`, {
            method: "DELETE",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.ok){
            console.log(`deletado com sucesso task: ${id}`);
            await loadTasks();
        }

    } catch (error){
        alert(`Error to connect server ${error.message}`);
    }
}

const updatePropertyDone = async (id) => {

    const token = localStorage.getItem('token');
    try {

        const response = await fetch(BASE_URL+`/tasks/update/${id}`, {
            method: "PUT",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.ok){
            console.log(`atualizado com sucesso task: ${id}`);
            await loadTasks();
        }

    } catch (error){
        alert(`Error to connect server ${error.message}`);
    }
}

const showFormAddTask = () => {
    container.style.opacity = 0.2;
    createTask.style.display = "flex";
    contentFormText.value = "";
}

const closeFormAddTask = () => {
    container.style.opacity = 1;
    createTask.style.display = "none";
    contentFormText.value = "";
}

buttonSaveNewTask.addEventListener("click", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    try {

        const response = await fetch(BASE_URL+"/tasks/create", {
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({content: contentFormText.value})
        });

        if(response.ok){
            closeFormAddTask();
            loadTasks();
            return;
        }
        
        // if the answer is failure
        alert("Falha ao criar tarefa, tente novamente em alguns minutos");


    } catch(error) {
        alert(`Error to connect server ${error.message}`);
    }
});

iconCloseForm.addEventListener("click", closeFormAddTask);

loadTasks();