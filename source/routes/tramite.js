const { Router } = require('express')
const router = Router()

const {
  mostrarTramites,
  mostrarTransacciones,
  transaccionTramite
} = require('../controllers/tramite')

router.get('/', mostrarTransacciones)

router.get('/listar', mostrarTramites)

router.post('/', transaccionTramite)

module.exports = router