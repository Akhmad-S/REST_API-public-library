const express = require('express')
const router = express.Router()
const db = require('../database/data')


router.post('/:customer_id/:book_id', (req, res) => {
    let req_customer_id = parseInt(req.params.customer_id)
    let req_book_id = parseInt(req.params.book_id)
    let data = db.readData()


    let Customer = data.customers.find(e => e.id == req_customer_id)

    if (!Customer) {
        res.status(404).send("The customer is not registred")
        return
    }

    let Book = data.books.find(e => e.id == req_book_id)

    if (!Book) {
        res.status(404).send("This book does not exist")
        return
    }


    for (i = 0; i < data.rental_info.length; i++) {
        let element = data.rental_info[i]
        if (element.customer_id == req_customer_id && element.book_id == req_book_id) {
            res.status(400).send(`This is book is already rentaled by customer_id ${req_customer_id}`)
            return
        }
    }

    data.rental_info.push({
        customer_id: req_customer_id,
        book_id: req_book_id,
        booked_day: new Date(),
        returned_day: null,
        created_at: new Date()
    })

    db.writeData(data)
    res.status(201).send("Successfully created")
})


router.get('/', (req, res) => {
    let data = db.readData()
    res.status(200).json(data.rental_info)
})


router.get('/customer/:customer_id', (req, res) => {
    let data = db.readData()
    let req_customer_id = parseInt(req.params.customer_id)

    let Customer = data.customers.find(e => e.id == req_customer_id)

    if (!Customer) {
        res.status(400).send("The customer is not registred");
        return
    }

    let CustomerRentalIinfo = data.rental_info.find(e => e.customer_id == req_customer_id)

    if (!CustomerRentalIinfo) {
        res.status(400).send("This customer does not have rental book")
        return
    }

    let RentalBooks = data.rental_info.filter(e => e.customer_id == req_customer_id)

    let RentalBooksInfo = []

    for (let i = 0; i < RentalBooks.length; i++) {
        let element = RentalBooks[i]
        for (let j = 0; j < data.books.length; j++) {
            if (element.book_id == data.books[j].id) {
                element.book = data.books[j]
                RentalBooksInfo.push(element.book)
                break
            }
        }
    };

    res.json({ Customer, RentalBooksInfo })
})


module.exports = router