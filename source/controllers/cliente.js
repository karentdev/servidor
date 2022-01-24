const { pool } = require('../database')

const leerCliente = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cliente')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const actualizarCliente = async (req, res) => {
  let {
    cliente_id,
    cliente_nombre, 
    cliente_apellido,
    cliente_direccion,
    cliente_telefono,
    cliente_correo,
    cliente_identificador,
    cliente_tramite
  } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM cliente WHERE cliente_id = $1', 
      [cliente_id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO cliente VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        [ cliente_id,
          cliente_nombre, 
          cliente_apellido,
          cliente_direccion,
          cliente_telefono,
          cliente_correo,
          cliente_identificador,
          cliente_tramite ]
      )
      res.json({mensaje: '¡Registro insertado!'})
    } else {
      await pool.query(
        'UPDATE cliente SET '+
        'cliente_nombre = $1, '+
        'cliente_apellido = $2, '+
        'cliente_direccion = $3, '+
        'cliente_telefono = $4, '+ 
        'cliente_correo = $5, '+
        'cliente_identificador = $6, '+
        'cliente_tramite = $7 '+
        'WHERE cliente_id = $8',
        [ cliente_nombre, 
          cliente_apellido,
          cliente_direccion,
          cliente_telefono,
          cliente_correo,
          cliente_identificador,
          cliente_tramite,
          cliente_id]
      )
      res.json({mensaje: '¡Registro actualizado!'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

const eliminarCliente = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM cliente WHERE cliente_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        mensaje: '¡El cliente no fue encontrado!'
      })
    } else {
      await pool.query(
        'DELETE FROM cliente WHERE cliente_id = $1',
        [id]
      )
      res.json({mensaje: '¡Registro eliminado!'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  leerCliente,
  actualizarCliente,
  eliminarCliente
}