import { cpus as _cpus, totalmem, freemem, platform, hostname, version, release, arch } from 'os'
import speed from 'performance-now'
import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import ws from 'ws'
import { join } from 'path'
import fs from 'fs'

let format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix }) => {
  let uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  let users = [...uniqueUsers.values()]
  let totalUsers = users.length
  let totalreg = Object.keys(global.db.data.users).length
  let totalbots = Object.keys(global.db.data.settings).length
  let totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0)
  const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let totalchats = Object.keys(global.db.data.chats).length
  let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
  const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
  const used = process.memoryUsage()

  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })

  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })

  let _muptime
  if (process.send) {
    process.send('uptime')
    _muptime = await new Promise(resolve => {
      process.once('message', resolve)
      setTimeout(resolve, 1000)
    }) * 1000
  }
  let muptime = clockString(_muptime)

  const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
  const configPath = join('./Serbot', botActual, 'config.json')

  let nombreBot = global.namebot || 'Anya Forger'
  let moneyName = 'Money'
  let imgBot = './storage/img/menu3.jpg'

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      if (config.name) nombreBot = config.name
      if (config.coinName) moneyName = config.moneyName
      if (config.img) imgBot = config.img
    } catch (err) { }
  }
  
  const tipo = botActual === '+5363172635'.replace(/\D/g, '')
      ? 'Principal Bot'
      : 'Prem Bot'

  let timestamp = speed()
  let latensi = speed() - timestamp

  let txt = `Nombre largo: ${nombreBot}\n`
  txt += `Nombre corto: ${nombreBot}\n`
  txt += `Moneda: ${moneyName}\n\n`
  txt += `Prefijo: ${usedPrefix}\n`
  txt += `Plugins: ${totalf}\n`
  txt += `Speed: ${latensi.toFixed(4)} ms\n\n`
  txt += `Host: Akirax\n`
  txt += `conectado a: Akirax_1\n`
  txt += `Tipo: ${tipo}\n`
  txt += `\n> LOVELLOUD Official`

  await conn.sendFile(m.chat, imgBot, 'thumbnail.jpg', txt, m, null, rcanal)
}

handler.help = ['info']
handler.tags = ['main']
handler.command = ['info', 'infobot']

export default handler

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' D ', h, ' H ', m, ' M ', s, ' S'].map(v => v.toString().padStart(2, 0)).join('')
}
