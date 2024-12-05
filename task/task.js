// html
const listTask = document.querySelector(".list-task");
const taskItem = document.querySelector(".task-item");
const createTask = document.querySelector(".create-task");
const editTask = document.querySelector(".edit-task");
const container = document.querySelector(".container");
const iconCloseFormAddTask = document.getElementById("icon-close-form-add-task");
const contentFormText = document.querySelector(".input-content-text");
const buttonSaveNewTask = document.querySelector(".bt-create-task");

// edit task
const iconCloseFormEditTask = document.getElementById("icon-close-form-edit-task");
const textEditTask = document.querySelector(".text-edit-task");
const buttonEditTask = document.getElementById("bt-edit-task");

const BASE_URL = "https://learning-docker-production.up.railway.app";

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

                <button class="bt-icon" onClick="showFormEditTask('${task.content.replace(/'/g, "\\'")}', ${task.id})">
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

const showFormEditTask = (currentContent, id) => {
    localStorage.setItem('idTask', id);
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

const editTaskByUd = async () => {

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('idTask');
    
    try {

        const response = await fetch(BASE_URL+`/tasks/update/content/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({content: textEditTask.value})
        });

        if(response.ok){
            loadTasks();
            closeFormEditTask();
            return;
        }

        if(response.status == 403){
            alert("Erro ao atualizar, tente novamente mais tarde");
        }

    } catch(error) {
        alert(`Error to connect server ${error.message}`);
    } finally {
        localStorage.removeItem('idTask');
    }
}

const backHomePage = () => {
    localStorage.removeItem('token');
    window.location.href = "../index.html";
}

iconCloseFormAddTask.addEventListener("click", closeFormAddTask);

iconCloseFormEditTask.addEventListener("click", closeFormEditTask);

loadTasks();