const express = require('express')
const router = express.Router()
const db = require('../database/data.js')


router.post('/', (req, res) => {
    let body = req.body
    let data = db.readData()

    if (!(body.id && body.firstname && body.lastname && body.email && body.phone && body.date_of_birth && body.address)) {
        res.status(400).send("Please, enter all details (id, firstname, lastname, email, phone, date_of_birth, address)")
        return
    }
    for (i = 0; i < data.customers.length; i++) {
        const element = data.customers[i]
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} this is customer already exists`)
            return
        }
    }
    body.created_at = new Date()
    data.customers.push(body)
    db.writeData(data)

    res.status(201).send("Successfully created")
})


router.get('/', (req, res) => {
    let data = db.readData()

    if (!data.customers.length) {
        res.status(404).send("Customers not found")
        return
    }

    res.status(200).json(data.customers)
})


router.get('/:id', (req, res) => {
    let idElement = req.params.id
    let data = db.readData()
    let customer = data.customers.find(e => e.id == idElement)

    if (!customer) {
        res.status(404).send(`id:${idElement} this is customer not found`)
        return
    }

    res.status(200).json(customer)
})


router.get('/name/:firstname', (req, res) => {
    let firstname = req.params.firstname.toLowerCase()
    let data = db.readData()
    let customer = data.customers.filter(e => (e.firstname + ' ' + e.lastname).toLowerCase().includes(firstname))

    if (customer.length == 0) {
        res.status(404).send("This is customer not found")
        return
    }

    res.status(200).json(customer)
})


router.put('/', (req, res) => {
    let body = req.body
    let data = db.readData()
    let customer = data.customers.find(e => e.id == body.id)

    if (!customer) {
        res.status(404).send(`id:${body.id} this is customer not found`)
        return
    }
    for (i = 0; i < data.customers.length; i++) {
        let element = data.customers[i]
        if (element.id == body.id) {
            body.created_at = data.customers[i].created_at
            body.updated_at = new Date()
            data.customers[i] = body
            break;
        }
    }

    db.writeData(data)
    res.status(200).send("Successfully updated")
})


router.delete('/:id', (req, res) => {
    let idElement = req.params.id
    let data = db.readData()
    let customer = data.customers.find(e => e.id == idElement)

    if (!customer) {
        res.status(404).send(`id:${idElement} this is customer not found`)
        return
    }
    data.customers = data.customers.filter(e => e.id != idElement)
    db.writeData(data)

    res.status(200).send("Successfully deleted")
})


module.exports = router