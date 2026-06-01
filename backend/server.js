const express = require('express');
const cors = require('cors');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3012;

app.use(cors({
  origin: ['https://think4good.org', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

app.post('/api/contacto', async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await pool.query(
      'INSERT INTO contactos (nombre, email, asunto, mensaje, ip_origen) VALUES ($1, $2, $3, $4, $5)',
      [nombre.trim(), email.trim().toLowerCase(), asunto?.trim() || null, mensaje.trim(), ip]
    );
    res.json({ success: true, message: 'Mensaje recibido. Nos comunicaremos contigo pronto.' });
  } catch (err) {
    console.error('Error guardando contacto:', err.message);
    res.status(500).json({ error: 'Error interno. Intenta nuevamente.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'webinterna-backend' }));

initDB().then(() => {
  app.listen(PORT, () => console.log(`webinterna-backend corriendo en puerto ${PORT}`));
});
