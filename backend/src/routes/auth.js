import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../database/connection.js'
import { generateToken } from '../middleware/auth.js'

const router = express.Router()

// Login/Register
router.post('/login', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('course').notEmpty().withMessage('Curso é obrigatório'),
  body('university').notEmpty().withMessage('Universidade é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, course, university, avatar_url } = req.body

    // Verificar se usuário já existe
    let user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (user.rows.length === 0) {
      // Criar novo usuário
      const result = await pool.query(
        `INSERT INTO users (name, email, course, university, avatar_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name, email, course, university, avatar_url, created_at`,
        [name, email, course, university, avatar_url]
      )
      user = result
    }

    const userData = user.rows[0]
    const token = generateToken(userData.id)

    res.json({
      user: userData,
      token
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token necessário' })
    }

    const jwt = await import('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'profai-secret-key')
    
    const result = await pool.query(
      'SELECT id, name, email, course, university, avatar_url, created_at FROM users WHERE id = $1',
      [decoded.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Update user profile
router.put('/profile', [
  body('name').optional().notEmpty().withMessage('Nome não pode ser vazio'),
  body('course').optional().notEmpty().withMessage('Curso não pode ser vazio'),
  body('avatar_url').optional().isURL().withMessage('URL do avatar inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token necessário' })
    }

    const jwt = await import('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'profai-secret-key')
    
    const { name, course, avatar_url } = req.body
    const updateFields = []
    const values = []
    let paramCount = 1

    if (name) {
      updateFields.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }
    if (course) {
      updateFields.push(`course = $${paramCount}`)
      values.push(course)
      paramCount++
    }
    if (avatar_url) {
      updateFields.push(`avatar_url = $${paramCount}`)
      values.push(avatar_url)
      paramCount++
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' })
    }

    values.push(decoded.userId)

    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, course, university, avatar_url, updated_at`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router

