const { validationResult } = require('express-validator');
const moviesRepo = require('../src/mongodbRepository');
const Movie = require('../src/Movie');

/* GET movies listing. */
exports.movies_list = async function(req, res, next) {
    const data = await moviesRepo.findAll();
    res.render('movies', { title: 'movies Database', movies: data } );
};
  
  /* GET movies add */
  exports.movies_create_get = function(req, res, next) {
    res.render('movie_add', { title: 'Add a movie'} );
  };
  
  /* POST movies add */
  exports.movies_create_post = async function(req, res, next) {
    //console.log(req.body);
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render('movie_add', { title: 'Add a movie', msg: result.array() });
    } else {
        const { title, director, year, notes } = req.body;
        const newMovie = new Movie('', title, director, year, notes);
      await moviesRepo.create(newMovie);
      res.redirect('/movies');
    }
  };
  
  /* GET a movie */
  exports.movies_detail = async function(req, res, next) {
    const movie = await moviesRepo.findById(req.params.uuid);
    if (movie) {
      res.render('movie', { title: 'movie', movie: movie} );
    } else {
      res.redirect('/movies');
    }
  };
  
  /* GET movies delete */
  exports.movies_delete_get = async function(req, res, next) {
    const movie = await moviesRepo.findById(req.params.uuid);
    res.render('movie_delete', { title: 'Delete movie', movie: movie} );
  };
  
  /* POST movies delete */
  exports.movies_delete_post  = async function(req, res, next) {
    await moviesRepo.deleteById(req.params.uuid);
    res.redirect('/movies');
  };
  
  /* GET movies edit */
  exports.movies_edit_get  = async function(req, res, next) {
    const movie = await moviesRepo.findById(req.params.uuid);
    res.render('movie_edit', { title: 'Edit Movie', movie });
  }
  
  /* POST movies edit */
  exports.movies_edit_post  = async function(req, res, next) {
    //console.log(req.body);
    if (req.body.title.trim() === '') {
        const movie = await moviesRepo.findById(req.params.uuid);
        res.render('movie_edit', { title: 'Edit Movie', msg: 'Movie title cannot be empty!', movie });
    } else {
        const updatedMovie = new Movie(req.params.uuid, req.body.title, req.body.director, req.body.year, req.body.notes);
        // Call the update method of the moviesRepo to update the movie
        await moviesRepo.update(updatedMovie);
        // Redirect the user to the movies list page after successfully updating the movie
        res.redirect('/movies');
    }
  };