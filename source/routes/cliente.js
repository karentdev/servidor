const { Router } = require('express')
const router = Router()

const {
  leerCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/cliente')

router.get('/', leerCliente)

router.post('/actualizar', actualizarCliente)

router.delete('/:id', eliminarCliente)

module.exports = router