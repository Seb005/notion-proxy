import express from 'express'
import axios from 'axios'

const app = express()
app.use(express.json())

const NOTION_TOKEN = process.env.NOTION_TOKEN
const NOTION_VERSION = '2022-06-28'
const DATABASE_ID = process.env.DATABASE_ID

app.post('/notion/fiche', async (req, res) => {
  try {
    const bodyWithDatabase = {
      parent: {
        database_id: DATABASE_ID
      },
      ...req.body
    }

    const response = await axios.post(
      'https://api.notion.com/v1/pages',
      bodyWithDatabase,
      {
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json'
        }
      }
    )

    res.status(200).json(response.data)
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: 'Erreur Notion',
      details: err.response?.data || err.message
    })
  }
})

app.listen(3000, () => {
  console.log('✅ Notion proxy en ligne sur le port 3000')
})
