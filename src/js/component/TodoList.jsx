import React, { useState, useEffect } from "react";

export const TodoList = () => {

    const [inputValue, setinputValue] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch('https://playground.4geeks.com/todo/users/JefersonPilligua')
            .then(resp => resp.json())
            .then(respJson => {
                console.log(respJson)
                console.log(respJson.todos)
                const serverTodos = respJson.todos;
                setTodos(serverTodos);
            })
    }, [])

    const createTodo = async (task) => {
        await fetch('https://playground.4geeks.com/todo/todos/JefersonPilligua', {
            method: 'POST',
            body: JSON.stringify({
                "label": task,
                "is_done": false

            }),
            headers: {
                'content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(respJson => {
                const newTodos = [...todos, respJson];
                setTodos([...newTodos])
            });
    }


    const handleOnChange = (evt) => {
        if (evt.key === 'Enter' && evt.target.value.trim() !== '') {
            createTodo(evt.target.value)
            setinputValue('')
        }
    }

    const deleteTask = async (id) => {
        return fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok) {
                setTodos(todos.filter(todos => todos.id !== id))
            }
        })
    }

    const deleteAllTasks = async () => {
        const deleteAll = todos.map(item => deleteTask(item.id))
        await Promise.all(deleteAll).then(() => setTodos([]));
    }


    return (
        <div className="container box-list">
            <h1 className="text-center">Todo List</h1>
            <input
                value={inputValue}
                type="text"
                className="form-control"
                onChange={evt => setinputValue(evt.target.value)}
                onKeyDown={handleOnChange}
                placeholder="Añadir Tarea"
            />
            <div className="container px-5 mt-4">
                <div className="row">

                    {
                        todos.map((item, index) => (
                            <div className="container-fluid px-5" key={item.id}>
                                <div className="row py-2">
                                    <div className="col">
                                        {item.label}
                                    </div>
                                    <div className="col text-end">
                                        <button type="button" className="btn-close" aria-label="Close" onClick={() => deleteTask(item.id)}></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {todos.length === 0 ? (
                    <p className="h6 text-center my-4">No hay tareas, añadir tareas</p>
                ) : (<p className="h6 text-center my-4"> Tienes {todos.length} tareas pendientes</p>)}
            </div>
            <div className="col text-center">
                <button type="button" className="btn btn-primary" onClick={deleteAllTasks}> Delete all task</button>
            </div>
        </div>
    )
}