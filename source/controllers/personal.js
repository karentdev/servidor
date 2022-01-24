const { pool } = require('../database')

const leerPersonal = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM personal')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const actualizarPersonal = async (req, res) => {
  let {
    personal_id,
    personal_nombre, 
    personal_apellido,
    personal_identificacion,
    personal_direccion, 
    personal_fechanacimiento,
    personal_fechaingreso,
    personal_telefono,
    personal_correo
  } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM personal WHERE personal_id = $1', 
      [personal_id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO personal VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [ personal_id,
          personal_nombre, 
          personal_apellido,
          personal_identificacion,
          personal_direccion, 
          personal_fechanacimiento,
          personal_fechaingreso,
          personal_telefono,
          personal_correo ]
      )
      res.json({mensaje: '¡Registro insertado!'})
    } else {
      await pool.query(
        'UPDATE personal SET '+
        'personal_nombre = $1, '+
        'personal_apellido = $2, '+
        'personal_identificacion = $3, '+
        'personal_direccion = $4, '+ 
        'personal_fechanacimiento = $5, '+
        'personal_fechaingreso = $6, '+
        'personal_telefono = $7, '+
        'personal_correo = $8 '+
        'WHERE personal_id = $9',
        [ personal_nombre, 
          personal_apellido,
          personal_identificacion,
          personal_direccion, 
          personal_fechanacimiento,
          personal_fechaingreso,
          personal_telefono,
          personal_correo,
          personal_id]
      )
      res.json({mensaje: '¡Registro actualizado!'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

const eliminarPersonal = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM personal WHERE personal_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        mensaje: '¡El personal no fue encontrado!'
      })
    } else {
      await pool.query(
        'DELETE FROM personal WHERE personal_id = $1',
        [id]
      )
      res.json({mensaje: '¡Registro eliminado!'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  leerPersonal,
  actualizarPersonal,
  eliminarPersonal
}