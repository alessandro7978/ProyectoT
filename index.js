const express = require('express')
const cors = require('cors')
const pregunta = require('./src/routes/preguntas')
const db = require('./src/db/database')
const app = express()
const port = process.env.PORT || 3000

GetConnection()
async function GetConnection(){
    try {
        await db.authenticate();
        await db.sync(/* {force:true} */);
        console.log("Conexion exitosa con la BD")
    } catch (error) {
        throw new Error(error)
    }
}

//middleware, convierte el req en un objeto javascript
app.use(express.json());//recibir informacion
app.use(cors());// habilitar otras aplicaciones para realizar solicitudes a nuestra aplicacion

app.use('/api/delitos',pregunta);

app.listen(port, ()=>{
    console.log('Servidor escuchando en el puerto ', port)
}) 