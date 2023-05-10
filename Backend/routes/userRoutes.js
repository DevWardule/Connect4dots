const { application } = require('express')
const userController = require('../controllers/UserController.js')

const router = require('express').Router()

// router.get('/check',userController.check);
router.post('/finduser',userController.findUser)
router.post('/adduser',userController.adduser)  
router.get('/getuser',userController.printUser)
router.get('/:email',userController.getOneUser)
router.put('/:email',userController.updatePrd)
router.delete('/:email',userController.deletePrd)

module.exports = router