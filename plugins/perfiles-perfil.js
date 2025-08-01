import fs from 'fs'
import path, { join } from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  const user = m.sender
  const data = global.db.data.users[user]

  const texto = `
✿ Perfil de ${await conn.getName(user)}

✿ Género: ${data.genre || 'No establecido'}
✿ Cumpleaños: ${data.birth || 'No registrado'}
✿ Descripción: ${data.desc || 'Sin descripción'}
✿ Favorito: ${data.favourite || 'No establecido'}
✿ Nivel: ${data.level || 0}
✿ Coins: ${data.coins || 0}
✿ Experiencia: ${data.exp || 0}

❒ ID: ${user}
❒ Tipo: Usuario
❒ Registrado: ${data.registered ? 'Sí' : 'No'}
  `.trim()

  const botNumber = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
  const configPath = join('./Serbot', botNumber, 'config.json')

  let imgBot = './storage/img/menu3.jpg'
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      if (config.img) imgBot = config.img
    } catch {}
  }

  await conn.sendFile(m.chat, imgBot, 'profile.jpg', texto, m, null, rcanal, { mentions: [data.partner || user] })
}
handler.help = ['#profile • #perfil\n→ Revisa tu perfil completo con estadísticas y logros']
handler.tags = ['perfiles']
handler.command = /^profile|perfil$/i
export default handler
