const router = require('express').Router();
const { route } = require('./pizza-routes');
const pizzaRoutes = require('./pizza-routes');

//add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/pizzas', pizzaRoutes);

module.exports = router;