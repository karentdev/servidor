const { pool } = require('../database')
const { transaction } = require('../transaction')

const transaccionTramite = async (req, res) => {

  const { rtramite_pago, tramite_id, cliente_id, rtramite_fecha } = req.body

  try {
    transaction(async (pool) => {

      const { rows } = await pool.query(
        'SELECT tramite_costo FROM tramite WHERE tramite_id = $1', 
        [tramite_id]
      )
      const costo = rows[0].tramite_costo

      const pagar = Number(rtramite_pago).toFixed(2)
      const cliente_tramite = 'NO'
      const tramite_estado = 'PAGADO'

      if(costo == pagar){

        // Actualizar tramite
        await pool.query(
          'UPDATE tramite SET tramite_estado = $1 WHERE tramite_id = $2',
          [tramite_estado, tramite_id]
        )

        // Actualizar cliente
        await pool.query(
          'UPDATE cliente SET cliente_tramite = $1 WHERE cliente_id = $2',
          [cliente_tramite, cliente_id]
        )

        // Crear resultado_tramite
        const id = Math.ceil(Math.random() * 1000)
        await pool.query(
          'INSERT INTO resultado_tramite VALUES($1, $2, $3, $4)',
          [id, tramite_id, rtramite_fecha, rtramite_pago]
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
      `SELECT cliente.cliente_id, cliente_nombre ||' '|| cliente_apellido as cliente_fullname, cliente_tramite, `+
      'tramite_tipo, tramite_costo, tramite_estado, '+
      'rtramite_pago, rtramite_fecha '+
      'FROM cliente '+
      'INNER JOIN tramite ON cliente.cliente_id = tramite.cliente_id '+
      'INNER JOIN resultado_tramite ON tramite.tramite_id = resultado_tramite.tramite_id'
    )
    res.json(tramites.rows)
  } catch (e) {
    res.json(e.message)
  }
}

const mostrarTramites = async (req, res) => {
  try {
    const tramites = await pool.query(
      'SELECT tramite_id, cliente_id, tramite_tipo, tramite_costo, tramite_estado '+
      'FROM tramite'
    )
    res.json(tramites.rows)
  } catch (e) {
    res.json(e.message)
  }
}

module.exports = {
  transaccionTramite,
  mostrarTransacciones,
  mostrarTramites
}