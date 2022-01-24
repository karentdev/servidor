const { pool } = require('../database')
const { transaction } = require('../transaction')

const transaccionMantenimiento = async (req, res) => {

  const {
    iglesia_id,
    mantenimiento_id,
    rmantenimiento_valor,
    rmantenimiento_fecha
  } = req.body

  try {
    transaction(async (pool) => {

      const { rows } = await pool.query(
        'SELECT mantenimiento_costo FROM mantenimiento WHERE mantenimiento_id = $1', 
        [mantenimiento_id]
      )
      const costo = rows[0].mantenimiento_costo 

      const pagar = Number(rmantenimiento_valor).toFixed(2)
      const iglesia_estado = 'ACTIVO'

      if(costo == pagar){

        // Actualizar iglesia
        await pool.query(
          'UPDATE iglesia SET iglesia_estado = $1 WHERE iglesia_id = $2',
          [iglesia_estado, iglesia_id]
        )

        // Crear reporte
        const id = Math.ceil(Math.random() * 1000)
        await pool.query(
          'INSERT INTO reporte_mantenimiento VALUES($1, $2, $3, $4)',
          [id, mantenimiento_id, rmantenimiento_fecha, rmantenimiento_valor]
        )

        res.json({ mensaje: `¡Se creó correctamente la transacción!` })
      } else {
        res.json({ mensaje: `¡No se ejecutó la transacción!` })
      }
    })
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarTransacciones = async (req, res) => {
  try {
    const tramites = await pool.query(
      `SELECT iglesia.iglesia_id, iglesia_nombre, iglesia_estado, mantenimiento_tipo, `+
      'mantenimiento_costo, rmantenimiento_fecha '+
      'FROM iglesia '+
      'INNER JOIN mantenimiento ON iglesia.iglesia_id = mantenimiento.iglesia_id '+
      'INNER JOIN reporte_mantenimiento ON mantenimiento.mantenimiento_id = reporte_mantenimiento.mantenimiento_id'
    )
    res.json(tramites.rows)
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarMantenimiento = async (req, res) => {
  try {
    const tramites = await pool.query(
      'SELECT iglesia.iglesia_id, mantenimiento_id, iglesia_estado, mantenimiento_tipo, mantenimiento_costo '+
      'FROM iglesia INNER JOIN mantenimiento ON iglesia.iglesia_id = mantenimiento.iglesia_id'
    )
    res.json(tramites.rows)
  } catch (e) {
    res.json(e.message)
  }
}

module.exports = {
  transaccionMantenimiento,
  mostrarTransacciones,
  mostrarMantenimiento
}