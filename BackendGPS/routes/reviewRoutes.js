const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');
const Publication = require('../models/publicationModel');

router.post('/crear', async (req, res) => {
  try {
    const { rutUser, idPublicacion, rating, comentario } = req.body;

    const publication = await Publication.findById(idPublicacion);
    if (!publication) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const rutCarrier = publication.rutCarrier;

    const newReview = new Review({
      idPublicacion,
      rutUser,
      rutCarrier,
      rating,
      comentario
    });

    await newReview.save();

    res.status(201).json({ message: 'Reseña creada exitosamente', review: newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reseña', error });
  }
});

router.delete('/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    res.status(200).json({ message: 'Reseña eliminada exitosamente', review: deletedReview });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la reseña', error });
  }
});

router.get('/vertodo', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reseñas', error });
  }
});

router.get('/ver/:rutCarrier', async (req, res) => {
  try {
    const rutCarrier = req.params.rutCarrier;
    const reviews = await Review.find({ rutCarrier });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reseñas', error });
  }
});
module.exports = router;