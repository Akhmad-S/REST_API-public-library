const express = require('express')
const router = express.Router()
const db = require('../database/data')


router.post('/', (req, res) => {
    let body = req.body
    let data = db.readData()
    if (!(body.id && body.isbn && body.title && body.genre && body.description && body.author && body.publish_year && body.cover_photo_url)) {
        res.status(400).send("Please, enter all details (id, isbn, title, genre, description, author, publish yer, cover photo url)")
        return
    }
    for (i = 0; i < data.books.length; i++) {
        const element = data.books[i]
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} this is book already exists`)
            return
        }
    }
    body.created_at = new Date()
    data.books.push(body)
    db.writeData(data)

    res.status(201).send("Successfully created")
})


router.get('/', (req, res) => {
    let data = db.readData()

    if (data.books.length == 0) {
        res.status(404).send("Books not found")
        return
    }

    res.status(200).json(data.books)
})


router.get('/:id', (req, res) => {
    let idElement = req.params.id
    let data = db.readData()
    let book = data.books.find(e => e.id == idElement)

    if (!book) {
        res.status(404).send(`id:${idElement} this is book not found`)
        return
    }

    res.status(200).json(book)
})


router.get('/title/:title', (req, res) => {
    let title = req.params.title.toLowerCase()
    let data = db.readData()
    let book = data.books.filter(e => e.title.toLowerCase().includes(title))

    if (book.length == 0) {
        res.status(404).send("Book not found")
        return
    }

    res.json(book)
})


router.put('/', (req, res) => {
    let body = req.body
    let data = db.readData()
    let book = data.books.find(e => e.id == body.id)

    if (!book) {
        res.status(404).send(`id:${idElement} this is book not found`)
        return
    }
    for (i = 0; i < data.books.length; i++) {
        let element = data.books[i]
        if (element.id == body.id) {
            body.created_at = data.books[i].created_at
            body.updated_at = new Date()
            data.books[i] = body
            break;
        }
    }

    db.writeData(data)
    res.status(200).send("Successfully updated")
})


router.delete('/:id', (req, res) => {
    let idElement = req.params.id
    let data = db.readData()
    let book = data.books.find(e => e.id == idElement)

    if (!book) {
        res.status(404).send(`id:${idElement} this is book not found`)
        return
    }
    data.books = data.books.filter(e => e.id != idElement)

    db.writeData(data)
    res.status(200).send("Successfully deleted")
})


module.exports = router