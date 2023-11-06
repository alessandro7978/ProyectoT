const { preguntas } = require("../helpers/validators");
const { crearRespuesta, sugerencia, casoValidate } = require("../Logica/Analisis");
const router = require("express").Router();
const { NumeroCaso, RespuestaCaso } = require("../models/model");

router.post("/caso", async (req, res) => {
  const { Nombre } = req.body;
  if (!Nombre) {
    return res.status(400).json({
      error: "complete todos los campos",
    });
  }
  try {
    const caso = await NumeroCaso.create({ nombre: Nombre });
    const idCaso = await RespuestaCaso.create({ NumeroCasoIdNC: caso.IdNC });
    res
      .status(200)
      .json({ idCaso: idCaso.IdRC, sucess: "respuesta registrada" });
  } catch (error) {
    res.status(400).json({ sucess: "Error" });
  }
});

//obtiene las preguntas del modulo de dominio (nube)
router.get("/preguntas", async (req, res) => {

  try {
    await casoValidate(req, res)
    
    const pregunta = await preguntas();
    res.status(200).json(pregunta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }

});

//almacena las preguntas
router.post("/respuesta", async (req, res) => {

  const { idOR } = req.body;

  if (!idOR) {
    return res.status(400).json({
      error: "complete todos los campos",
    });
  }

  try {
    await casoValidate(req, res)
    await crearRespuesta(idOR,req.header("idCaso"));
    res.status(200).json({ sucess: "respuesta registrada" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
  
});

router.get("/sugerencia", async (req, res) => {
    try {
        await casoValidate(req, res)
        const recomendaciones = await sugerencia(req.header("idCaso"));
        res.status(200).json(recomendaciones);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
  
});

module.exports = router;
