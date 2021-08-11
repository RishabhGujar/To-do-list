import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useState } from 'react';
import {nanoid} from "nanoid";


function Form(props){
  const [name,setName] = useState(" ");
  
  function handleSubmit(e){
     e.preventDefault();
     props.addTask(name);
     setName("");
  }

  function handleChange(e){
     setName(e.target.value);
  }

  return(
    <form className="form-type">

      <h2 className="label-wrapper">     
         Task-List   
      </h2>

      <input type='text' id="new-todo-input" className="label_lg" onChange={handleChange}  value={name} placeholder="Enter your Task"/>

      <button type="submit" className="btn btn-lg" onClick={handleSubmit}>
        Add
      </button>


    </form>
  );
}


function Filter(props){
  return(
    <button type="button" className="btn toggle-btn" onClick={()=>props.setFilter(props.name)}>
    
      <span className="visually-hidden">Show </span>
      <span>{props.name}</span>
      <span className="visually-hidden"> tasks</span>
    </button>
  );
}

function Todo(props){
  const[isEditing,setEditing] = useState(false);

  const[newName,setNewName] = useState('');

  function handleChange(e){
     setNewName(e.target.value);
  }

  function handleSubmit(e){
    console.log("!!!!!handlesubmit")
    e.preventDefault();
    props.editTask(id,newName);
    setNewName("");
    setEditing(false);
  }
  
  const {task} = props;
  const{name,id,completed} = task;

  console.log(name,id,completed);

  


  const view = (  
       <div className="todo-view">    
        <div className="c-cb">
           <input id={id} type="checkbox" defaultChecked={completed} onChange={()=>props.toggleTaskCompleted(id)}/>
           <label className="todo-label" htmlFor={id}>
            {name}
           </label>
        </div>

        <button type="button" className="btn btn-edit" onClick={()=>setEditing(true)}>
            Edit <span className="visually-hidden">{name}</span>
        </button>

         <button type="button" className="btn btn-del" onClick={()=>props.deleteTask(id)}>
            Delete <span className="visually-hidden">{name} </span>
         </button>
         </div>
  )

  const edit = (
       <form className="todo-list" onSubmit={handleSubmit} >
       
         <div className="c-cb">

           <label className="todo-label" htmlFor={id}>
             New name for {name}
           </label>

           <input id={id} className="todo-text" type="text" onChange={handleChange} value={newName}/>

         </div>

         <div className="btn-group">

           <button type="button" className="btn todo-cancel" onClick={()=> setEditing(false)}>
           cancel
           <span className="visually-hidden">renaming {name}</span>
           </button>

           <button type="submit" className="btn todo-save">
             Save
             <span className="visually-hidden">new name for {name}</span>
           </button>

         </div>

       </form>

  );

  return (
    <li className="todo">
      {isEditing ? edit : view}
    </li>
  );
}


function TodoList(props){
  const{tasks} = props;

  console.log(tasks);

  return(
    <div>
          {tasks.filter(filterMap[props.filter]).map((task)=>{
                return (
                   <Todo task={task} key={task.id} toggleTaskCompleted={props.toggleTaskCompleted} deleteTask={props.deleteTask} editTask={props.editTask}/>
                   )
           })}
    </div>
  )

}



const filterMap={
  All :() => true,
  Active : task => !task.completed,
  completed : task => task.completed
}

const filterNames =  Object.keys(filterMap);





function App(){
  const [tasks,setTasks] = useState([]);

  const [filter,setFilter] = useState("All");

  function addTask(name){
     console.log(name);
     const newTask = {id:"todo-"+nanoid(),name:name,completed:false};
     setTasks([...tasks,newTask]);
  }

  function toggleTaskCompleted(id){
     const updatedTasks = tasks.map(task=>{
       if(id===task.id){
         return{...task,completed: !task.completed}
       }
       return task;
     })
     setTasks(updatedTasks);
  }


  function deleteTask(id){
     const remaining = tasks.filter(task=> id!==task.id);
     setTasks(remaining);
  }

  function editTask(id,newName){
    
    const editedTaskList = tasks.map(task=>{
      if(id===task.id){
        return{...task,name:newName};
      }
      return task;
    });
    console.log(editedTaskList);
    setTasks(editedTaskList);
  }

  const filterList = filterNames.map(name=>(
    <Filter key={name} name={name} isPresssed={name === filter} setFilter={setFilter}/>
  
  ));
  
   
  const tasksNoun = tasks.length > 1 ? 'tasks' : 'task';
  const headingText = `${tasks.length} ${tasksNoun} remaining`;

  return(
    <div className="container">
      <Form  addTask={addTask}/>
      <div className="btn-group">
          {filterList}
       </div>
      <h3 id="list-heading">{headingText}</h3>
      <ul className="task-group">
      <TodoList tasks={tasks} toggleTaskCompleted={toggleTaskCompleted} deleteTask={deleteTask} editTask={editTask} filter={filter}/>
      </ul>
    </div>
  )

}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);



