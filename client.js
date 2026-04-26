const { get } = require("./app")

let token = null 

async function getReq() {
    const res = await fetch('http://localhost:3000/tasks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })  
    const text = await res.text()                    
    console.log(text)
}

async function postReq() {
    const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({titulo: "Fazer mais compras"})
    }) 
    const text = await res.text()
    console.log(text)
}

async function delReq(id) {
    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const text = await res.text()
    console.log(text)
}

async function putReq(id) {
    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({titulo: "Novo Titulo"})
    })
    const text = await res.text()
    console.log(text)
}

async function registerReq() {
    const res = await fetch(`http://localhost:3000/auth/register`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({username: "teste", password: "teste"})
    })
    const text = await res.text()
    console.log(text)
}

async function loginReq() {
    const res = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({username: "teste", password: "teste"})
    })
    token = await res.text()
    console.log(token)
}

async function main() {
    await registerReq()
    await loginReq()
    await postReq()
    await getReq()
    await putReq(170)
    await delReq(170)
}

main()