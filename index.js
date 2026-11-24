const express = require('express')
const morgan = require('morgan') //Adicionando o middleware morgan - Exercício 3.7 - Esse middleware configura as mensagems no log do console, possuindo presets e customizações
const { error } = require('node:console')
const { request } = require('node:http')
const { type } = require('node:os')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    next()
}

app.use(express.json())
app.use (morgan('tiny')) //Definindo o preset do morgan como tiny
app.use(requestLogger)

let fones = [//Notas criadas por padrão - Exercício 3.1
    {
        id: 1,
        nome: "Arto Hellas" ,
        numero: "040-123456"
    },
    {
        id: 2,
        nome: "Ada Lovelace" ,
        numero: "39-44-5323523"
    },
    {
        id: 3,
        nome: "Dan Abramov" ,
        numero: "12-43-234345"
    },
    {
        id: 4,
        nome: "Mary Poppendieck" ,
        numero: "39-23-6423122"
    },
    {
        id: 5,
        nome: "Jonas" ,
        numero: "32-123-62332"
    }
]

app.get('/', (request, response) =>{
    response.send('<h1>Página telefonica!</h1>')
})

app.get('/api/persons', (request, response) => {//Listagem de números - Exercício 3.1
    response.json(fones)    
})

app.get('/api/info', (request, response) => {//Página de informações - Exercício 3.2
    const totFones = fones.length// Conta o número total de entradas na lista de fones e coloca na const
    const data = new Date() // Criando um const do tipo Date
    response.send(`Phonebook has info for ${totFones} persons <br> ${data}`)//Informando o total de entradas na lista e mostrando a data e horário da request
})

app.get('/api/persons/:id', (request, response) => {//Listagem de uma pessoa específica - Exercício 3.3
    const id = Number(request.params.id)
    const person = fones.find(fone => fone.id == id)
    
    /*if (person) {//Se a pessoa estiver na lista informa somente os dados dessa pessoa, se não existir na lista leva para 404 Not Found
        response.json(person)
    } else {
        response.status(404).end()
    }*/

    if (!person) {//Maneira alternativa de executar o if, com o mesmo resutlado que o de cima
        return response.status(404).end()
    }

    console.log(person)
    response.json(person)
})

const generateId = () => { //Gera um ID aleatorio - Exercício 3.5
    /*const maxId = fones.length > 0
    ? Math.max(...fones.map(n => n.id))
    : 0
    return maxId + 1*/
    return Math.floor(Math.random() * 100000) + 1
}

app.post('/api/persons', (request, response) => {//Metodo para criar uma novos contatos - Exercício 3.5
    const body = request.body
    
    if (!body.nome || !body.numero) {//Classifica como erro 404 caso não encontre o formato correto pro conteudo ou algum erro
        return response.status(400).json({
            error: 'Parâmetros necessários não informados'
        })
    } else if (fones.find(fone => fone.nome === body.nome)){
         return response.status(400).json({
            error: 'Nome ja cadastrado!'
        })
    }

    const fone = {//Classifica os parâmetros informados
        nome: body.nome,
        numero: body.numero,
        id: generateId(),
    }

    fones = fones.concat(fone)

    response.json(fone)
})

app.delete(`/api/persons/:id`, (request, response) => { //Deletando os dados de uma pessoa, usar rest ou postman para enviar o DELETE para a página - Exercício 3.4
    const id = Number(request.params.id)
    fones = fones.filter(fone => fone.id !== id)

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})

