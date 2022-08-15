const port = 3000
const express = require('express')
const app = express()

app.use(express.json())

const customerRouter = require('./routers/customers')
const bookRouter = require('./routers/books')
const rentalRouter = require('./routers/rental')

app.use('/customers', customerRouter)
app.use('/books', bookRouter)
app.use('/rental-info', rentalRouter)


app.listen(port, () => {
    console.log(`Server is listening on PORT ${port}`)
})
