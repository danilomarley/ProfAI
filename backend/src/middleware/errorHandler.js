export const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err)

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message
    })
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }

  // Erro de token expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    })
  }

  // Erro de banco de dados
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      error: 'Violação de restrição de dados',
      details: err.detail
    })
  }

  // Erro padrão
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

