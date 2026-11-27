
require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')

const noteRoutes = require('./routes/noteRoutes')
const {errorHandler} = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

//Built in Middleware
app.use(express.json())

//Routes
app.get('/', (req, res) => res.json({ message: 'Express API running' }));
app.use('/api/notes',noteRoutes)
app.use(errorHandler);

mongoose.connect(process.env.DB_URI)
    .then(()=>{
        console.log('Connected to MongoDB');
        app.listen(PORT, ()=> console.log(`Server on PORT: ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB Connection failed : ', err.message);
        process.exit(1);
    });

