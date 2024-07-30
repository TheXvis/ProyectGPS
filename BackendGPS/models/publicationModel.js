const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
  rutUser: { type: String, required: true },
  rutCarrier: { type: String },
  nombre: { type: String, required: true },
  tipoMercancia: { type: String, required: true },
  imagen: { type: String },
  peso: { type: Number, required: true },
  precio: { type: Number, required: false },
  ubicacionCarga: { type: Schema.Types.Mixed, required: false },
  ubicacionDescarga: { type: Schema.Types.Mixed, required: false },
  estado: { type: String, required: true, default: 'Disponible' },
});

module.exports = mongoose.model('Publication', publicationSchema);

/* const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
    rutUser: { type: String, required: true },
    rutCarrier: { type: String },
    nombre: { type: String, required: true },
    tipoMercancia: { type: String, required: true }, //Cargas pesadas-Fragiles-Perecederas-Quimicos-etc
    imagen: { type: String },
    peso: { type: Number, required: true },
    volumen: { type: Number, required: true },
    precio: { type: Number, required: true },
    ubicacion: { type: String, required: true }, //Ubicacion Actual
    origen: { type: String, required: true }, //Ubicacion de origen de la carga
    destino: { type: String, required: true }, //Ubicacion de destino de la carga
    estado: { type: String}, //Publicada-Aceptada-En camino-Entregada
    condicionesEspeciales: { type: String }, //Costo elevado-Entrega rapida-Congelados -etc
  });

module.exports = mongoose.model('Publication', publicationSchema); */