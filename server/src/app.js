const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.post('/register', (req, res) => 
    res.send({
        message: `Hello ${req.body.email}, your user was registered!`
    })
)//get request to a status inpoint

app.listen(3000, () => 
    console.log('Server running on port 3000')
);
