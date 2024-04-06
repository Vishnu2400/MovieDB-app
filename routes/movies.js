var express = require('express');
var router = express.Router();
const moviesController = require('../Controllers/MovieController');
const { body } = require('express-validator');

/* GET movies listing. */
router.get('/', moviesController.movies_list);

/* GET movies add */
router.get('/add', moviesController.movies_create_get);

/* POST movies add */

router.post('/add',
  body('title').trim().notEmpty().withMessage('Movie title cannot be empty!'),
  body('director').trim().notEmpty().withMessage('Director name cannot be empty!'),
  body('year').trim().notEmpty().withMessage('Year cannot be empty!').isInt().withMessage('Year must be a valid number!'),
  body('notes').optional({ nullable: true }).trim(), // Optional notes field
  moviesController.movies_create_post);

/* GET a movie */
router.get('/:uuid', moviesController.movies_detail);

/* GET movies delete */
router.get('/:uuid/delete', moviesController.movies_delete_get);

/* POST movies delete */
router.post('/:uuid/delete', moviesController.movies_delete_post);

/* GET movies edit */
router.get('/:uuid/edit', moviesController.movies_edit_get);

/* POST movies add */
router.post('/:uuid/edit', moviesController.movies_edit_post);

module.exports = router;