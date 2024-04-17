const express = require('express')
const {createHmac} = require('crypto')
const knex = require('knex')(require('./knexfile.js')['development'])
const cors = require('cors')

const hash = input => createHmac('sha256',input[1]).update(input[0]).digest('hex')

const server = express()

const port = 8080

server.use(express.json())

server.use(cors())

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

server.get('/', (req, res) => {
    res.status(200).send('<!doctype html><html lang="en"><head><title>epic api</title><style>body{font-family:Ubuntu,"Segoe UI",sans-serif;}</style></head><body><h1>hi</h1><p>whatcha doin here</p></body></html>')
})

server.get('/users', (req, res) => {
    knex('users').select('*').then(data => res.status(200).json(data))
})

server.post('/users', (req, res) => {
    let user = {
        firstname: req.body.firstname || 'Firstname',
        lastname: req.body.lastname || 'Lastname',
        username: req.body.username,
        password: hash([req.body.username, req.body.password])
    }
    knex('users').select('username').where('username', 'like', user.username).then(data => {
        if(!data.length){
            knex('users').insert(user, ['id','firstname','lastname','username']).then(data => res.status(201).json(data[0]))
        }else{
            res.status(409).send('username taken')
        }
    })  
})

server.post('/login', (req, res) => {
    knex('users').select('*').where({username: req.body.username}).then(data => {
        if(!data.length){
            return res.status(400).send('bad username')
        }
        if(data.length > 1){
            return res.status(418).send('how the fuck did you even manage this you grand hooligan')
        }
        let dbdata = data[0]
        if(hash([req.body.username, req.body.password]) !== dbdata.password){
            return res.status(401).send('nuh uh')
        }else{
            return res.status(200).json({id:dbdata.id,firstname:dbdata.firstname,lastname:dbdata.lastname,username:dbdata.username})
        }
    })
})

server.patch('/users/:id', (req, res) => {
    let {id} = req.params
    let isGoodname = true
    knex('users').select('*').where({id}).then(data => {
        if(!data.length){
            return res.status(400).send('bad id')
        }
        let dbdata = data[0]
        if(!(req.body.username && req.body.password)){
            return res.status(400).send('invalid body')
        }
        if(hash([req.body.username, req.body.password]) !== dbdata.password){
            return res.status(403).send('you really shouldnt be seeing this but username/password is wrong')
        }
        if(req.body.newUsername){
            knex('users').select('username').where('username', 'like', req.body.newUsername).then(data => {
                if(data.length){
                    res.status(409).send('username taken')
                    isGoodname = false
                }
            })
        }
        if(isGoodname){
            let newdata = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.newUsername,
                password: hash([req.body.newUsername || req.body.username, req.body.newPassword || req.body.password])
            }
            knex('users').where({id}).update(newdata).then(() => {
                res.status(200).send('updated')
            })
        }
    })
})

server.get('/items', (req, res) => {
    knex('items').select('*').then(data => res.status(200).json(data))
})

server.get('/items/:id', (req, res) => {
    let {id} = req.params
    knex('items').select('*').where({userid:id}).then(data => res.status(200).json(data))
})

server.post('/items', (req, res) => {
    if(!req.body.id){
        return res.status(401).send('logged out')
    }
    let newitem = {
        userid: req.body.id,
        name: req.body.name || 'new item',
        desc: req.body.desc || 'new item',
        quantity: req.body.quantity || 1,
    }
    knex('items').insert(newitem).then(() => res.status(201).send('coolio'))
})

server.patch('/items/:id', (req, res) => {
    let {id} = req.params
    knex('items').select('*').where({id}).then(data => {
        if(!data.length){
            return res.status(404).send('bad id')
        }
        itemuser = data[0]
        if(req.body.userid !== itemuser.userid){
            return res.status(401).send('nope')
        }
        let item = {
            name: req.body.name || itemuser.name,
            desc: req.body.desc || itemuser.desc,
            quantity: req.body.quantity || itemuser.quantity
        }
        knex('items').where({id}).update(item).then(() => res.status(200).send('ye'))
    })
})

server.delete('/items/:id', (req, res) => {
    let {id} = req.params
    knex('items').select('*').where({id}).then(data => {
        if(!data.length){
            return res.status(404).send('bad id')
        }
        itemuser = data[0]
        if(req.body.userid !== itemuser.userid){
            return res.status(401).send('nope')
        }
        knex('items').where({id}).del().then(() => {
            res.status(200).send('it gone')
        })
    })
})

server.listen(port, () => {
    console.log(`server do be goin on localhost:${port}`)
})