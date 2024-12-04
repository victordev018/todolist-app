// html
const listTask = document.querySelector(".list-task");
const taskItem = document.querySelector(".task-item");
const createTask = document.querySelector(".create-task");
const editTask = document.querySelector(".edit-task");
const container = document.querySelector(".container");
const iconCloseFormAddTask = document.getElementById("icon-close-form-add-task");
const iconCloseFormEditTask = document.getElementById("icon-close-form-edit-task");
const contentFormText = document.querySelector(".input-content-text");
const textEditTask = document.querySelector(".text-edit-task");
const buttonSaveNewTask = document.querySelector(".bt-create-task");
const buttonEditTask = document.getElementById("bt-edit-task");

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
        <li class= "task-item" style="background-color:${color}">

            <div class="checkbox-content">
                <button class="bt-icon" onClick="updatePropertyDone(${task.id})">
                    <img src = "/assets/icons/checkbox.png" class="icon">
                </button>
                
                <span class="task-content-text">${task.content}</span>
            </div>
            

            <div class="edit-delete-task">

                <button class="bt-icon" onClick="showFormEditTask('${task.content.replace(/'/g, "\\'")}')">
                    <img src = "/assets/icons/edit-icon.png" class="icon">
                </button>

                <button class="bt-icon" onClick="deleteTaskById(${task.id})">
                    <img src = "/assets/icons/delete-icon.png" class="icon">
                </button>
            </div>
            
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

const showFormEditTask = (currentContent) => {
    container.style.opacity = 0.2;
    editTask.style.display = "flex";
    textEditTask.value = currentContent;
}

const closeFormEditTask = () => {
    container.style.opacity = 1;
    editTask.style.display = "none";
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

iconCloseFormAddTask.addEventListener("click", closeFormAddTask);

iconCloseFormEditTask.addEventListener("click", closeFormEditTask);

loadTasks();