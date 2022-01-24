const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const corsOpciones = {
  origin: '*',
  optionsSuccessStatus: 200
}

const {
  tramiteRoutes,
  mantenimientoRoutes,
  personalRoutes,
  clienteRoutes
} = require('../routes')

const app = express()
const router = express.Router()

app
  .use(express.json())
  .use(cors(corsOpciones))
  .use(morgan('dev'))

router.use('/tramite', tramiteRoutes)
router.use('/mantenimiento', mantenimientoRoutes)
router.use('/personal', personalRoutes)
router.use('/cliente', clienteRoutes)

app.use(router)

module.exports = { app }