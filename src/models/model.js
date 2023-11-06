const { DataTypes } = require("sequelize")
const db = require("../db/database")

const Pregunta = db.define('Pregunta', {
    idpregunta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        utoIncrement: true
    },
    pregunta: {
        type: DataTypes.STRING
    }
},{
    timestamps: false
});

const DelitosContraLibertad = db.define('DelitosContraLibertad',{
    idDCL:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre:{
        type: DataTypes.STRING
    },
    Descripcion:{
        type: DataTypes.STRING
    }
},{
    timestamps: false
});

const RespuestaCaso = db.define('RespuestaCaso',{
    IdRC:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

const OpcionesRespuesta = db.define('OpcionesRespuesta', {
    idOR:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        utoIncrement: true
    },
    IdPregunta: {
        type: DataTypes.INTEGER,
        references:{
            model: Pregunta,
            key: 'idpregunta'
        }
    },
    respuesta: {
        type: DataTypes.STRING,
    }
},{
    timestamps: false
});

const respuestaUsuario = db.define('respuestaUsuario', {
    idRU:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdRC: {
        type: DataTypes.INTEGER,
        references:{
            model: RespuestaCaso,
            key: 'IdRC'
        }
    },
    idOR: {
        type: DataTypes.INTEGER,
        references:{
            model: OpcionesRespuesta,
            key: 'idOR'
        }
    }
});

const NumeroCaso = db.define('NumeroCaso',{
    IdNC:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    nombreAfectado: {
        type: DataTypes.STRING
    },
},{
    timestamps: false
});

const SugerenciaCondena =db.define('sugerencia',{
    IdSC: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdRC:{
        type: DataTypes.INTEGER,
        references:{
            model: RespuestaCaso,
            key: 'IdRC'
        }
    },
    IdCondena:{
        type: DataTypes.INTEGER,
        references:{
            model: DelitosContraLibertad,
            key: 'idDCL'
        }
    },
    probabilidad:{
        type: DataTypes.DECIMAL
    },
    elegida:{
        type: DataTypes.BOOLEAN
    }
})

const Actos = db.define('Actos', {
    IdActos: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion:{
        type: DataTypes.STRING
    },
    puntuacion: {
        type: DataTypes.INTEGER
    }
},{
    timestamps: false
});

const ActosDelito = db.define('ActosDelito', {
    IdActoDelito:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IdActos: {
        type: DataTypes.INTEGER,
        references:{
            model: Actos,
            key: 'IdActos'
        }
    },
    idDCL:{
        type:DataTypes.INTEGER,
        references:{
            model: DelitosContraLibertad,
            key: 'idDCL'
        }
    }
},{
    timestamps: false
});

/* opcionesRespuestaPregunta.hasMany(Caracteristica); */
Actos.belongsTo(OpcionesRespuesta);

NumeroCaso.hasMany(RespuestaCaso);

module.exports = {
    respuestaUsuario,
    RespuestaCaso,
    ActosDelito,
    SugerenciaCondena,
    DelitosContraLibertad,
    NumeroCaso
}

