const userControllers = require('./controllers/users')
const placeController = require('./controllers/place')
const eventController = require('./controllers/event')
const productController = require('./controllers/product')

const router = require('express').Router()

// user routes
router.route('/users')
  .get(userControllers.getAll)
  .post(userControllers.create)
router.route('/users/:id')
  .get(userControllers.getById)
  .put(userControllers.update)
  .delete(userControllers.delete)

  // place routes
router.route('/places')
  .get(placeController.getAll)
  .post(placeController.create)
router.route('/places/:id')
  .get(placeController.getById)
  .put(placeController.update)
  .delete(placeController.delete)

  // event routes
router.route('/events')
  .get(eventController.getAll)
  .post(eventController.create)
router.route('/events/:id')
  .get(eventController.getById)
  .put(eventController.update)
  .delete(eventController.delete)

  // product routes
router.route('/products')
  .get(productController.getAll)
  .post(productController.create)
router.route('/products/:id')
  .get(productController.getById)
  .put(productController.update)
  .delete(productController.delete)

module.exports = router
