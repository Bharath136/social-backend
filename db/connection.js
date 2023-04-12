const mongoose = require('mongoose')

const db = `mongodb+srv://<username>:<password>@cluster0.swlgwsp.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(db, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("database connected successfully")
}).catch((e) => {
    console.log(e,'error')
})