import express from 'express'
import { body, validationResult } from 'express-validator'
import pool from '../database/connection.js'

const router = express.Router()

// Get all documents for user
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, 
              COUNT(c.id) as correction_count,
              COUNT(CASE WHEN c.accepted = true THEN 1 END) as accepted_corrections
       FROM documents d
       LEFT JOIN corrections c ON d.id = c.document_id
       WHERE d.user_id = $1
       GROUP BY d.id
       ORDER BY d.updated_at DESC`,
      [req.user.id]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Get specific document
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const documentResult = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (documentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    const correctionsResult = await pool.query(
      'SELECT * FROM corrections WHERE document_id = $1 ORDER BY created_at ASC',
      [id]
    )

    const document = documentResult.rows[0]
    document.corrections = correctionsResult.rows

    res.json(document)
  } catch (error) {
    console.error('Erro ao buscar documento:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Create new document
router.post('/', [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('content').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, content = '' } = req.body
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

    const result = await pool.query(
      `INSERT INTO documents (user_id, title, content, original_content, word_count) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [req.user.id, title, content, content, wordCount]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Erro ao criar documento:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Update document
router.put('/:id', [
  body('title').optional().notEmpty().withMessage('Título não pode ser vazio'),
  body('content').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { title, content, progress } = req.body

    // Verificar se documento existe e pertence ao usuário
    const existingDoc = await pool.query(
      'SELECT * FROM documents WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (existingDoc.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    const updateFields = []
    const values = []
    let paramCount = 1

    if (title) {
      updateFields.push(`title = $${paramCount}`)
      values.push(title)
      paramCount++
    }
    if (content !== undefined) {
      updateFields.push(`content = $${paramCount}`)
      values.push(content)
      paramCount++
    }
    if (progress !== undefined) {
      updateFields.push(`progress = $${paramCount}`)
      values.push(progress)
      paramCount++
    }

    if (content !== undefined) {
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length
      updateFields.push(`word_count = $${paramCount}`)
      values.push(wordCount)
      paramCount++
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' })
    }

    values.push(id)

    const result = await pool.query(
      `UPDATE documents SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      [...values, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Erro ao atualizar documento:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    res.json({ message: 'Documento deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar documento:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Get document versions
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params

    // Verificar se documento existe e pertence ao usuário
    const docExists = await pool.query(
      'SELECT id FROM documents WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (docExists.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    const result = await pool.query(
      'SELECT * FROM versions WHERE document_id = $1 ORDER BY created_at DESC',
      [id]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Erro ao buscar versões:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Create new version
router.post('/:id/versions', [
  body('content').notEmpty().withMessage('Conteúdo é obrigatório'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { content, description, changes = [] } = req.body

    // Verificar se documento existe e pertence ao usuário
    const docExists = await pool.query(
      'SELECT id FROM documents WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    )

    if (docExists.rows.length === 0) {
      return res.status(404).json({ error: 'Documento não encontrado' })
    }

    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length

    const result = await pool.query(
      `INSERT INTO versions (document_id, content, description, word_count, changes) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [id, content, description, wordCount, JSON.stringify(changes)]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Erro ao criar versão:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router

