// ? ============== Global =====================
const formElement =  document.querySelector('form');
const inputElement = document.getElementById('inputElement');
const loadingScreen = document.querySelector('.loading');



const apiKey = "675a192060a208ee1fddf9e4";

retriveAllDataFormApi();



// ! ============== Events ======================

formElement.addEventListener( 'submit' , (e)=>{
    e.preventDefault();
    if(inputElement.value.trim().length > 0)
        addToDo();
    else{
        toastr.error("Input is Empty");
    }
} )

// ^ ============= functions ====================

function showLoadding(){
    loadingScreen.classList.remove('d-none');
}
function hiddenLoadding(){
    loadingScreen.classList.add('d-none');
}

async function addToDo(){
    showLoadding();
    const todo = {
        title: inputElement.value,
        apiKey: apiKey
    }

    const obj = {
        method: 'POST',
        body : JSON.stringify(todo),
        headers: {
            'content-type': 'application/json'
        }
    }

    let response = await fetch( " https://todos.routemisr.com/api/v1/todos " ,  obj );

    if(response.ok) {
        let data = await response.json();
        if(data.message === "success"){
            console.log(data);
            toastr.success("Added successfully"  , "Alert Tostar");
            retriveAllDataFormApi();
            formElement.reset();
        }
    }
    hiddenLoadding();
}

async function retriveAllDataFormApi(){
    showLoadding();
    const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);
    if(response.ok){
        let data = await response.json();
        displayData(data.todos);
    }
    hiddenLoadding();
}

function displayData(listOfData) {

    let cartona = ``;
    for(let  i =0; i<listOfData.length; i++) {
        cartona += `
        
        <li class="border-bottom p-2 my-3 d-flex align-items-center justify-content-between">

                    <span onclick="markComplete('${listOfData[i]._id}')" style="${listOfData[i].completed ? "text-decoration: line-through;": ""}" class="task-name">${listOfData[i].title}</span>

                    <div class="icons d-flex align-items-center justify-content-between gap-4">
                        <span>${listOfData[i].completed ? '<i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i>' : ''}</span>
                        <span onclick="deleteTask('${listOfData[i]._id}')" class="trsh-icon"><i class="fa-solid fa-trash"></i></span>
                    </div>
        </li>
        `
    }
    document.getElementById('containerTasks').innerHTML = cartona;
    createProgress(listOfData);
}


async function deleteTask(taskId){

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then( async (result) => {
             showLoadding();
            const obj = {
                todoId : taskId
            }
            console.log(obj);
        
            const configObj = {
                method: 'DELETE',
                body: JSON.stringify(obj),
                headers: {
                    'content-type': 'application/json'
                }
            }
        
        
            const response = await fetch('https://todos.routemisr.com/api/v1/todos' , configObj );
            if(response.ok){
                let data = await response.json();
                if(data.message = "success"){
                    retriveAllDataFormApi();
                }
            }
            hiddenLoadding();
    
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });


}

async function markComplete(idTask) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, complete it!"
      }).then(async (result) => {
        showLoadding();
        const taskId =  {
            todoId: idTask
        }
    
        const configObj = {
            method : "PUT",
            body : JSON.stringify(taskId),
            headers: {
                'content-type': 'application/json'
            }
        }
    
        const response = await fetch('https://todos.routemisr.com/api/v1/todos' , configObj);
    
        if(response.ok){
            const data = await response.json();
            if(data.message = "success"){
                retriveAllDataFormApi();
                console.log("tamam");
            }
        }
        hiddenLoadding();
        if (result.isConfirmed) {
          Swal.fire({
            title: "completed!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });

   
}

function createProgress(alltodos){

    const completedTask = alltodos.filter((task)=> task.completed).length;
    const alltasks = alltodos.length;
    document.getElementById('progress').style.width = `${(completedTask / alltasks) * 100}%`;
    const spanList = document.querySelectorAll('.status-number span');
    spanList[0].innerHTML = `${completedTask}`;
    spanList[1].innerHTML = `${alltasks}`;
}



  


