const fs = require('node:fs')
const path = require("node:path");
const filePath = path.join(__dirname,'db.json')
// fs.writeFile(filePath,'[\n' +
//     '  {\n' +
//     '    "id": 1,\n' +
//     '    "name": "John Doe",\n' +
//     '    "age": 30,\n' +
//     '    "email": "john.doe@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 2,\n' +
//     '    "name": "Jane Smith",\n' +
//     '    "age": 28,\n' +
//     '    "email": "jane.smith@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 3,\n' +
//     '    "name": "Bob Johnson",\n' +
//     '    "age": 35,\n' +
//     '    "email": "bob.johnson@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 4,\n' +
//     '    "name": "Alice Brown",\n' +
//     '    "age": 25,\n' +
//     '    "email": "alice.brown@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 5,\n' +
//     '    "name": "David Wilson",\n' +
//     '    "age": 32,\n' +
//     '    "email": "david.wilson@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 6,\n' +
//     '    "name": "Sarah Miller",\n' +
//     '    "age": 29,\n' +
//     '    "email": "sarah.miller@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 7,\n' +
//     '    "name": "Michael Lee",\n' +
//     '    "age": 40,\n' +
//     '    "email": "michael.lee@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 8,\n' +
//     '    "name": "Emily Davis",\n' +
//     '    "age": 27,\n' +
//     '    "email": "emily.davis@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 9,\n' +
//     '    "name": "William Moore",\n' +
//     '    "age": 33,\n' +
//     '    "email": "william.moore@example.com"\n' +
//     '  },\n' +
//     '  {\n' +
//     '    "id": 10,\n' +
//     '    "name": "Olivia White",\n' +
//     '    "age": 24,\n' +
//     '    "email": "olivia.white@example.com"\n' +
//     '  }\n' +
//     ']\n',(err) => {
//     if (err) throw new Error(err.message)
// })



const express = require('express')
const app = express()
const PORT = 5001

app.listen(PORT, () => {
    console.log(`server has successfully started on ${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const usersFilePath = path.join(__dirname,'db.json')
app.get('/users', async (req,res) => {
    const usersData = await fs.promises.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);
    res.json(users);
})

app.get('/users/:id', async (req,res) => {
    const {id} = req.params
    const usersData = await fs.promises.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);
    const user = users.find((user) => user.id === Number(id));

    if (!user) {
        return res.status(404).json({ message: 'Користувача з вказаним id не знайдено' });
    }

    res.json(users[+id -1])
})


function validateName(req, res, next){
    const {name} = req.body
    if (!name || name.length < 3) {
        return res.status(400).json({
            message: 'min 3 characters'
        })
    }
    next();
}

function validateAge(req, res, next) {
    const {age} = req.body
    if (typeof age !=="number" || age < 0) {
        return res.status(400).json({
            message:'min 0'
        })
    }
    next();
}

app.post('/users', validateName, validateAge, async (req,res) => {
const newUser = {
    id: 11,
    name: 'Megan Smith',
    age: 26,
    email: 'megan.smith@example.com'
}
    const fileData = await fs.promises.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileData);

    const userExists = users.some((user) => user.id === newUser.id);

    if (userExists) {
        return res.status(409).json({ message: 'Користувач з таким id вже існує' });
    }

    users.push(newUser);
    await fs.promises.writeFile(filePath,JSON.stringify(users, null, 2), 'utf-8')
    res.status(201).json({
        message:" User created"
    })
})

app.delete('/users/:id', async (req,res) => {
    const {id} = req.params
    const fileData = await fs.promises.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileData);
    const indexToDelete = +id - 1;

    if (indexToDelete < 0 || indexToDelete >= users.length) {
        return res.status(404).json({ message: 'Користувача з вказаним id не знайдено' });
    }

    users.splice(indexToDelete, 1);
    res.sendStatus(204)
    await fs.promises.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
})

app.put('/users/:id', async (req, res) => {
    const {id} = req.params
    const fileData = await fs.promises.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileData);
    const indexToUpdate = users.findIndex((user) => user.id === Number(id));

    if (indexToUpdate === -1) {
        return res.status(404).json({ message: 'Користувача з вказаним id не знайдено' });
    }
    users[indexToUpdate] = req.body;

    await fs.promises.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    res.json({
        message:'User updated'
    })
})