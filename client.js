let token = null 
const BASE_URL = 'https://task-api-production-8dca.up.railway.app'

async function getReq() {
    const res = await fetch(`${BASE_URL}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })  
    const text = await res.text()                    
    console.log(text)
}

async function postReq() {
    const res = await fetch(`${BASE_URL}/tasks`, {
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
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const text = await res.text()
    console.log(text)
}

async function putReq(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
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
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: "teste", password: "teste"})
    })
    const text = await res.text()
    console.log(text)
}

async function loginReq() {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
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