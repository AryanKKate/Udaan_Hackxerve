const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const loanRoutes = require('./routes/loanRoutes');
const transactionRoutes=require('./routes/transactionRoutes')
const cors = require('cors'); 
// require('./corn');  

const app = express();
app.use(cors());

mongoose.connect('mongodb+srv://shivpratikhande2017:vxgCsfWIRu4qZKtJ@cluster0.b5k5y.mongodb.net/')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(bodyParser.json());

app.use('/api/loan', loanRoutes);
app.use('/api/transaction', transactionRoutes)

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
