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
        listTask.innerHTML = `<span class="no-task"> sem tarefas cadastradas </span>`
    }

    data.forEach(task => {
        
        listTask.innerHTML += `
        <li>${task.content}</li>
        `

    });
}

loadTasks();