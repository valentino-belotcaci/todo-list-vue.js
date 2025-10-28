const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(morgan('combined'))
app.use(cors())

app.get('/status', (req, res) => 
    res.send({
        message: 'Hello world'
    })
)//get request to a status inpoint

app.listen(3000, () => 
    console.log('Server running on port 3000')
);
