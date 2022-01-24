const { Router } = require('express')
const router = Router()

const {
  mostrarMantenimiento,
  mostrarTransacciones,
  transaccionMantenimiento
} = require('../controllers/mantenimiento')

router.get('/', mostrarTransacciones)

router.get('/listar', mostrarMantenimiento)

router.post('/', transaccionMantenimiento)

module.exports = router