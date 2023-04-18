const { Router } = require('express')

const ContactController = require('./app/controllers/contact-controller')
const CategoryController = require('./app/controllers/category-controller')

const router = Router()

router.get('/contacts', ContactController.list)
router.get('/contacts/:id', ContactController.show)
router.post('/contacts', ContactController.create)
router.put('/contacts/:id', ContactController.update)
router.delete('/contacts/:id', ContactController.delete)

router.get('/categories', CategoryController.list)
router.post('/categories', CategoryController.create)


module.exports = router