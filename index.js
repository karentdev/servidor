const { app } = require('./source/config')
const PORT = 4040

app.listen(PORT, () => {
  console.log(`Servidor funcionando en: http://localhost:${PORT}`)
})