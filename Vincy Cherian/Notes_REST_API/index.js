
require('dotenv').config();
const express = require('express')
const noteRoutes = require('./routes/noteRoutes')

const app = express();
const PORT = process.env.PORT || 3000;

//Built in Middleware
app.use(express.json())

//Routes
app.get('/', (req, res) => res.json({ message: 'Express API running' }));
app.use('/api/notes',noteRoutes)

app.listen(PORT, ()=> console.log(`Server on PORT: ${PORT}`));