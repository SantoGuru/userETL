//const supabase = require('./config/db');
const express = require('express');
const router = require('./routes/uploadRoutes');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');

app.use('/usuario', router);

app.listen(3000, ()=>{
    console.log('executando...');
    //console.log(supabase);
})