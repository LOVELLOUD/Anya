import fs from 'fs'
import { join } from 'path'

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let nombreBot = global.namebot || 'KIYOMI MD'
    let imgBot = './storage/img/menu3.jpg'
    const botActual = conn.user?.jid?.split('@')[0]?.replace(/\D/g, '')
    const tipo = botActual === '+51958333972'.replace(/\D/g, '') ? 'Principal Bot' : 'Sub Bot'
    
    
    let botUptime = 0
    if (conn.startTime) {
      botUptime = Date.now() - conn.startTime
    }
    let botFormatUptime = clockString(botUptime)
    
   
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
    
    
    const memoryUsage = process.memoryUsage()
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)

    const text = `
╭─「 ✦ 𓆩⚡𓆪 ʙɪᴇɴᴠᴇɴɪᴅᴏ ✦ 」─╮
│
╰➺ ✧ *Usuario:* @${m.sender.split('@')[0]}
│
╰➺ ✧ *Bot:* ${nombreBot}
│
╰➺ ✧ *Tipo:* ${tipo}
│
╰➺ ✧ *Librería:* Baileys MD
│
╰➺ ✧ *Tiempo Activo:* ${botFormatUptime}
│
╰➺ ✧ *Plugins:* ${totalf}
│
╰➺ ✧ *Memoria:* ${memoryMB} MB


╭─「 ✦ 𓆩👑𓆪 ᴘʀᴏᴘɪᴇᴛᴀʀɪᴏs ✦ 」─╮
│
╰➺ ✧ +51942501966 ➺ Sung
╰➺ ✧ +51901437507 ➺ Sunkovv


╭─「 ✦ 𓆩💎𓆪 ᴄᴀɴᴀʟᴇs ᴏғɪᴄɪᴀʟᴇs ✦ 」─╮
│
╰➺ ✧ https://whatsapp.com/channel/0029VbAZUQ3002T9KZfx2O1M

╰➺ ✧ https://whatsapp.com/channel/0029Vb5Vinf72WTo11c5hJ3O


╭─「 ✦ 𓆩🐦‍🔥𓆪 ᴄᴏᴍᴀɴᴅᴏs ᴅɪsᴘᴏɴɪʙʟᴇs ✦ 」─╮
│
╰➺ ✧ *Owners* 𖤓
│   • ${usedPrefix}verplugin <nombre.js>
│   • ${usedPrefix}replugin <nombre.js>
│   • ${usedPrefix}addplugin <nombre.js>
│   • ${usedPrefix}nameplugins <archivo.js> > <nuevo.js>
│   • ${usedPrefix}update
│
╰➺ ✧ *Sub-bots* 𖤓
│   • ${usedPrefix}qr
│   • ${usedPrefix}code
│   • ${usedPrefix}bots
│   • ${usedPrefix}botinfo
│   • ${usedPrefix}reconnect
│   • ${usedPrefix}setbotname
│   • ${usedPrefix}setbotimg
│   • ${usedPrefix}setautoread
│
╰➺ ✧ *Economía* 𖤓
│   • ${usedPrefix}balance
│   • ${usedPrefix}bal
│   • ${usedPrefix}coins
│
╰➺ ✧ *Perfiles* 𖤓
│   • ${usedPrefix}profile
│   • ${usedPrefix}setbirth <fecha>
│   • ${usedPrefix}setdesc <descripción>
│   • ${usedPrefix}setfav <personaje>
│   • ${usedPrefix}setgenre <hombre/mujer>
│   • ${usedPrefix}birthdays
│   • ${usedPrefix}allbirthdays
│
╰➺ ✧ *Búsquedas* 𖤓
│   • ${usedPrefix}google <búsqueda>
│   • ${usedPrefix}yt <búsqueda>
│   • ${usedPrefix}tiktok <búsqueda>
│   • ${usedPrefix}onlyfans <username>
│
╰➺ ✧ *Inteligencia* 𖤓
│   • ${usedPrefix}gemini <texto>
│   • ${usedPrefix}deepseek <texto>
│
╰➺ ✧ *Descargas* 𖤓
│   • ${usedPrefix}play <query/url>
│   • ${usedPrefix}aptoide <app>
│
╰➺ ✧ *Stickers* 𖤓
│   • ${usedPrefix}sticker
│   • ${usedPrefix}toimg
│   • ${usedPrefix}setmeta <autor> | <pack>
│   • ${usedPrefix}delmeta
│
╰➺ ✧ *Administración* 𖤓
│   • ${usedPrefix}ban @usuario
│   • ${usedPrefix}promote @usuario
│   • ${usedPrefix}demote @usuario
│   • ${usedPrefix}tag
│   • ${usedPrefix}open
│   • ${usedPrefix}close
│   • ${usedPrefix}delete
│
╰➺ ✧ *Diversión* 𖤓
│   • ${usedPrefix}topgays
│   • ${usedPrefix}topfeos
│   • ${usedPrefix}toplindos
│   • ${usedPrefix}topburros
│   • ${usedPrefix}topmachos
│   • ${usedPrefix}topparejas
│   • ${usedPrefix}toppajeros
│   • ${usedPrefix}topmancos
│
╰➺ ✧ *NSFW* 𖤓
│   • ${usedPrefix}waifu
│   • ${usedPrefix}waifu2
│   • ${usedPrefix}neko
│
╰➺ ✧ *Información* 𖤓
│   • ${usedPrefix}id
│   • ${usedPrefix}menu
│   • ${usedPrefix}help
│
╰────────────────╯

> LOVELLOUD Official`.trim()

    await conn.sendFile(m.chat, imgBot, 'thumbnail.jpg', text, m, null, { 
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    })

  } catch (e) {
    console.error('Error en menú:', e)
    conn.sendMessage(m.chat, {
      text: '❎ Hubo un error al mostrar el menú.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
    throw e
  }
}

handler.command = ['menu', 'help', 'menú']
export default handler
