const db = require("../db/database");
const { RespuestaCaso, SugerenciaCondena } = require("../models/model");

async function preguntas() {
    const [consulta, metapreguntas] = await db.query("SELECT OPR.idOR, PR.pregunta, OPR.respuesta FROM `OpcionesRespuesta` OPR "
    +"INNER JOIN Pregunta PR on OPR.Idpregunta=PR.idpregunta ORDER by PR.idpregunta ASC");
    return await consulta;
}

const delitos = async () => {
    const [consulta, metapreguntas] = await db.query("SELECT idDCL FROM `DelitosContraLibertads`");
    return await consulta;
}

const respDelitosUsuario = async (id,idCaso) => {
    const [consulta, metapreguntas] = await db.query(`SELECT DC.idDCL, count(RU.idOR) as total_usuario, (
        SELECT count(ORE.idOR)
        FROM DelitosContraLibertads DC
        inner join ActosDelitos AD on DC.idDCL = AD.idDCL
        INNER JOIN Actos ACT on AD.IdActos = ACT.IdActos
        INNER JOIN OpcionesRespuesta ORE on ACT.OpcionesRespuestumIdOR = ORE.idOR
        where DC.idDCL = '${id}'
        ) as Total_delito, ((
        SELECT count(ORE.idOR)
        FROM DelitosContraLibertads DC
        inner join ActosDelitos AD on DC.idDCL = AD.idDCL
        INNER JOIN Actos ACT on AD.IdActos = ACT.IdActos
        INNER JOIN OpcionesRespuesta ORE on ACT.OpcionesRespuestumIdOR = ORE.idOR
        where DC.idDCL = '${id}'
        ) - count(RU.idOR)) as probable, DC.Nombre
        FROM DelitosContraLibertads DC
        inner join ActosDelitos AD on DC.idDCL = AD.idDCL
        INNER JOIN Actos ACT on AD.IdActos = ACT.IdActos
        INNER JOIN OpcionesRespuesta ORE on ACT.OpcionesRespuestumIdOR = ORE.idOR
        INNER JOIN Pregunta pe on ORE.IdPregunta = pe.idpregunta
        INNER JOIN respuestaUsuarios RU on ORE.idOR = RU.idOR
        INNER JOIN RespuestaCasos RC on RU.IdRC = RC.IdRC
        where DC.idDCL = '${id}' and RC.IdRC = '${idCaso}'`);
    return await consulta;
}

const delitoUsuario = async (id,idCaso) => {
    const [consulta, metapreguntas] = await db.query(`SELECT DC.Nombre, pe.pregunta, ORE.respuesta, ACT.descripcion FROM DelitosContraLibertads DC
    inner join ActosDelitos AD on DC.idDCL = AD.idDCL
    INNER JOIN Actos ACT on AD.IdActos = ACT.IdActos
    INNER JOIN OpcionesRespuesta ORE on ACT.OpcionesRespuestumIdOR = ORE.idOR
    INNER JOIN Pregunta pe on ORE.IdPregunta = pe.idpregunta
    INNER JOIN respuestaUsuarios RU on ORE.idOR = RU.idOR
    INNER JOIN RespuestaCasos RC on RU.IdRC = RC.IdRC
    where DC.idDCL = '${id}' and RC.IdRC = '${idCaso}'`);
    
    const grouped = consulta.reduce((acc, item) => { 
        // "acc" es el acumulador, que es "grouped".
        // "item" es el elemento actual de la lista "nai" que estamos procesando.
      
        // Verificamos si el "Nombre" del "item" actual ya está en "grouped".
        if (!acc[item.Nombre]) { 
          // Si no está, lo añadimos con la estructura deseada.
          acc[item.Nombre] = {
            nombre: item.Nombre,
            respuestas: []
          };
        }
      
        // Ahora, añadimos el "item" actual a la lista de respuestas de ese "Nombre".
        acc[item.Nombre].respuestas.push({
          pregunta: item.pregunta,
          respuesta: item.respuesta,
          razon: item.descripcion,
        });
      
        // Devolvemos el "acc" para la próxima iteración.
        return acc;
      }, {}); // {} al final es el valor inicial de "grouped"/"acc".

      const respuesta = Object.values(grouped);
    return await respuesta;
}


const caso = async (id) => {
    const caso = await RespuestaCaso.findOne({ where: { IdRC: id } })
    return caso;
}

const almSugerencia = async (Array,idCaso) => {
    for await (let [index, num] of Array.entries()){
        
        await SugerenciaCondena.create({
            IdRC: idCaso,
            IdCondena: num.idDCL,
            probabilidad: num.probable,
            elegida: (index+1)
        })
    }
}

module.exports = {
    preguntas,
    delitos,
    respDelitosUsuario,
    delitoUsuario,
    caso,
    almSugerencia
}