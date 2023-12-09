const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Successful response.')
})

// app.get('/second_pages/analysis.html', (req, res) => {
//     res.sendFile(__dirname + '/second_pages/analysis.html')
// })

mongoose.connect('mongodb://127.0.0.1:27017/citywalk')

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
})
mongoose.connection.once('close', () => {
    console.log('disConnected to MongoDB')
})

const cwSche = new mongoose.Schema({
    name: String,
    address: String,
    description: String,
    why: String,
    coords: Array,
    visited: Boolean,
})

const CW = mongoose.model('CW', cwSche)

// Test.create({
//     id: '110801',
//     des: 'a little di',
// }), (err, docs) => {
//     if(!err) {
//         console.log(docs+'has been done')
//     } else {
//         console.log(err)
//     }
// }
// let q = async () => {
//     let res = await Test.find({})
//     console.log(res)
//     return res
// }
// q()

// let q = async () => {
//     let res = await Test.find({ id: '110901' }).exec()
//     console.log(res)
//     return res
// }

app.get('/citywalk', async (req, res) => {
    let r = await CW.find({}).exec()
    res.send(r)
})

app.post('/createCW', (req, res) => {
    const cw = new CW(req.body)
    cw.save().then(r => {
        res.send(r)
    }).catch(err => {
        res.status(500).send(err)
    })
})

app.delete('/deleteCW/:name', (req, res) => {
    const name = req.params.name
    CW.deleteOne({ name: name }).then(r => {
        res.send(r)
    }).catch(err => {
        res.status(500).send(err)
    })
    // CW.findOneAndDelete({ name: name })
})

app.put('/updateCW/:lngLat', (req, res) => {
    const lngLat = req.params.lngLat.split(',')
    const newCW = req.body
    CW.updateOne({ coords: lngLat }, newCW).then(r => {
        res.send(r)
    }).catch(err => {
        res.status(500).send(err)
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

