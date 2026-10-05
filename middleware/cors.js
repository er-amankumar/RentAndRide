const express = require('express');
const cors= require('cors');

const app = express();

app.use(cors({
    origin:'http://localhost:8080',
    methods:['GET','POST','PUT','DELETE']

}));

app.use(express.json);

app.get('/api/data',(req,res)=>{
    res.json({message:"hello from backend"})
})
