// html
const listTask = document.querySelector(".list-task");

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
        
        listTask.innerHTML += `
        <li class= "task-item">
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

    console.log("entrei");

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

loadTasks();