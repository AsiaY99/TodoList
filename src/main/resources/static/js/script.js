const taskAddButton = document.getElementById("task-add-button");
const tasksList = document.getElementById("tasks-list");
const taskContent = document.getElementById("task-content");
const categories = document.getElementById("categories");

const REST_API_ENDPOINT = 'http://localhost:8080';

/*
    questa funzione aggiorna la select delle categorie interrogando il server attraverso ajax
    verrà invocata subito dopo il completo caricamento della pagina
*/
function updateCategoriesList() {
    //creo un oggetto di tipo XMLHttpRequest per gestire la chiamata ajax al server
    let ajaxRequest = new XMLHttpRequest();
    //gestisco l'onload: ovvero quello che succede dopo che il server mi risponde
    ajaxRequest.onload = function() {
        //mi salvo tutte le categorie ritornate dal server in una variabile denominata categories 
        //parsando il contenuto della response attreverso l'utility JSON.parse()
        let categoriesDB = [...JSON.parse(ajaxRequest.response)];
        //cicliamo ogni categoria all'interno dell'array categories
        // con il .forEach
        categoriesDB.forEach(elem => {
            //creo la option
            let option = document.createElement("option");
            //setto il value e il text
            option.innerText = elem.name;
            option.value = elem.id;
            //la appendo
            categories.appendChild(option);
        });
    };
    //imposto metodo e url  della request (get)
    ajaxRequest.open("GET", REST_API_ENDPOINT + '/categories/all');
    //la mando
    ajaxRequest.send();
}
// monento in cui viene invocata la funziona updateCategoriesList
updateCategoriesList();
// viene invocata la funzione createTask per aggiungere nuove task
function createTask(task) {
    const newTaskLine = document.createElement("div");
    //newTaskLine.setAttribute("data-id", task.id);
    newTaskLine.classList.add("task");
    newTaskLine.classList.add("unconfirmed");
    if (task.category) {
        newTaskLine.classList.add(task.category.name); 
    }    

    //creo la checkbox da aggiungere alla riga
    const newCheck = document.createElement("INPUT");
    newCheck.setAttribute("type", "checkbox");
    // se la variabile newCheck è spuntata (checked) risulta true
    if (task.done) {
        newTaskLine.classList.add("task-done");
        newCheck.checked = true;
    }  
    //appendo la checkbox alla riga
    newTaskLine.appendChild(newCheck);

    const newText = document.createElement("span");
    newText.classList.add("task-text");
    newText.innerHTML = task.name;
    newTaskLine.appendChild(newText);

    //creo elemento cestino
    const trash = document.createElement("button");
    trash.classList +="button trash red-outline";
    trash.innerHTML = "<span class='icon-bin'></span>";
    newTaskLine.appendChild(trash);
    const edit = document.createElement("button");
    edit.classList += "button red-outline";
    edit.innerHTML = '<i class="fas fa-edit"></i>';
    newTaskLine.appendChild(edit);
    //newDate.classList.add("task-date");
    // aggiungere una data nel formato d/m/Y e allinearla a destra nella riga
    const newDate = document.createElement("div");
    
    
    newDate.classList.add("task-date");
    const date = new Date(task.created);
    newDate.innerText = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    newTaskLine.appendChild(newDate);

    tasksList.appendChild(newTaskLine);
    taskContent.value = "";
    // aggiungo l'evento al click dell'icona edit 
    edit.addEventListener("click", function() {
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "input-edit");
        if (newTaskLine.classList.contains("editing")) {
            //eseguo la chiamata ajax e salvo il record
            //rimuovo il dischetto torna la pennetta
            //edit.innerHTML = '<i class="fas fa-edit"></i>';
            //tolgo l'imput e ci rimetto lo span
           // newText.innerText = input.value;
            //newText.remove(input);
            //rimuovo la classe editing
            //this.classList.remove("editing");
            let inputEdit = document.getElementById("input-edit");
            
            let taskContent = {
                done: task.done,
                name: inputEdit.value
            };
            updateTask(task.id, taskContent, () => {
                //aggiorno l'attributo name del''oggetto task su cui sto lavorando
                task.name = inputEdit.value;
                //sostituisco l'input con uno span contenente il testo aggiornato
                newText.innerText = task.name;
                //sostituisco il dischetto con la pennina
                edit.innerHTML = '<i class="fas fa-edit"></i>';
                //rimuovo la classe editing
                newTaskLine.classList.remove("editing");
            });

        } else {
            //aggiungo una classe editing
            newTaskLine.classList.add("editing");
            //sostituisco lo span con l'imput
            input.value = newText.textContent;
            newText.innerHTML = "";
            //sostituisco l pennetta col dischetto
            edit.innerHTML = '<i class="fas fa-save"></i>';
            newText.appendChild(input);
        }
        
    });
    //funzione deleteTask 
    trash.addEventListener("click", function() {
        deleteTask(task.id, newTaskLine);
    });
    newCheck.addEventListener("click", function() {
        task.done = !task.done
        let taskContent = {
            done: task.done,
            name: task.name
        };
        updateTask(task.id, taskContent, () => {
            newTaskLine.classList.toggle("task-done");
        });
    });
}

// gestisco la funzione deleteTask recuperando i dati dal server con ajaxRequest
function deleteTask(taskId, taskHtmlElement) {
    let ajaxRequest = new XMLHttpRequest(); // recupero i dati dal server
    ajaxRequest.onload = function () {
        if (ajaxRequest.response == "ok") {
            taskHtmlElement.remove();
        }
    }
    //ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/" + taskId + "/delete");
    ajaxRequest.open("DELETE", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.send();
}
//gestisco la funziona updateTasksList recuperando i dati dal server
function updateTasksList() {
    tasksList.innerHTML = "";
    let ajaxRequest = new XMLHttpRequest(); //recupero i dati dal server
    ajaxRequest.onload = function () {
        let tasks = JSON.parse(ajaxRequest.response);
        for( let task of tasks) {
            createTask(task);
        }
    }

    ajaxRequest.open("GET", REST_API_ENDPOINT + '/tasks/');
    ajaxRequest.send();
}

updateTasksList();
// invoco la funzione save task per salvare le task aggiunte nel database
function saveTask(taskToSave) {
    let ajaxRequest = new XMLHttpRequest(); //recupero i dati dal server
    ajaxRequest.onload = () => {
        let savedTask = JSON.parse(ajaxRequest.response);
        createTask(savedTask);
    }
    ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/add");
    ajaxRequest.setRequestHeader("content-type", "application/json");
    let body = {
        name: taskToSave.name,
        created: new Date(),
        category: {
            id: taskToSave.categoryId
        }
    }
    ajaxRequest.send(JSON.stringify(body));
}

function updateTask(taskId, taskContent, successfullCallback) {
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onload = () => {
        successfullCallback();
    }
    //ajaxRequest.open("POST", REST_API_ENDPOINT + "/tasks/" + taskId +"/update");
    ajaxRequest.open("PUT", REST_API_ENDPOINT + "/tasks/" + taskId);
    ajaxRequest.setRequestHeader("content-type", "application/json");

    ajaxRequest.send(JSON.stringify(taskContent));
}
// aggiungo l'evento al click del button taskAddButton
taskAddButton.addEventListener("click", function() {
    const taskContentValue = taskContent.value;
    const category = categories.value
    // gestisco gli errori con l'if
    if (taskContentValue.length < 1) {
        alert("Please write something to add !!");
        return;
    }
    if (category == "select a category"){
        alert("Please select a category!");
        return;
    }
    //mi creo un oggetto che rappresenta il task da aggiungere...
    let task = {
        name: taskContentValue,
        categoryId: category
    };
    saveTask(task);
});
