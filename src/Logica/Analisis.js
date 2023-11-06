const {
  preguntas,
  delitos,
  respDelitosUsuario,
  delitoUsuario,
  caso,
  almSugerencia,
} = require("../helpers/validators");
const { respuestaUsuario, RespuestaCaso } = require("../models/model");

async function crearRespuesta(a,idCaso) {
  const pregunta = await preguntas();
  const respuesta = await respuestaUsuario.findAll();
  const conclucion = await RespuestaCaso.findAll();

  for await (let num of pregunta) {
    if (a == num.idOR) {
      try {
        await respuestaUsuario.create({ idOR: a, IdRC: idCaso });
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function sugerencia(idCaso) {
  const delito = await delitos();
  const resp = await ciclo(delito, respDelitosUsuario,idCaso);

  const sugerencia = resp.filter((elem, indice) => {
    if (elem.total_usuario != 0) {
      return elem.probable >= 0 && elem.probable <= 1;
    }
  });
  console.log(sugerencia)
  await almSugerencia(sugerencia,idCaso)
  const recomendacion = await ciclo(sugerencia, delitoUsuario,idCaso);

  return recomendacion;
}

const ciclo = async (array, consulta,idCaso) => {
  let delitosResp;
  for await (let num of array) {
    if (delitosResp === undefined) {
      delitosResp = await consulta(num.idDCL,idCaso);
    } else {
      const resp = await consulta(num.idDCL,idCaso);
      if(resp.length === 1){
        delitosResp.push(resp[0]);
      }else{
        delitosResp.push(resp);
      }
    }
  }
  return delitosResp;
};

const casoValidate = async (req, res ) => {
  
    const idCaso = req.header("idCaso");

  
    if (!idCaso) {
        throw new Error("complete todos los campos")
    }
  
    const existCaso = await caso(idCaso);
    if (!existCaso) {
      throw new Error("El caso no existe")
    }
  
};

module.exports = {
  crearRespuesta,
  sugerencia,
  casoValidate,
};
