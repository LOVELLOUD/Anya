import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile, readFileSync, existsSync } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
clearTimeout(this)
resolve()
}, ms))

export async function handler(chatUpdate) {
this.msgqueque = this.msgqueque || []
if (!chatUpdate) return
this.pushMessage(chatUpdate.messages).catch(console.error)
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m) return
if (global.db.data == null) await global.loadDatabase()

try {
m = smsg(this, m) || m
if (!m) return
if (m.messageStubType) return
m.exp = 0
m.limit = false

try {  
  let user = global.db.data.users[m.sender] ||= {}  
  if (!isNumber(user.exp)) user.exp = 0  
  if (!isNumber(user.limit)) user.limit = 10  
  if (!('registered' in user)) user.registered = false  
  if (!user.registered) {  
    if (!('name' in user)) user.name = m.name  
    if (!isNumber(user.age)) user.age = -1  
    if (!isNumber(user.regTime)) user.regTime = -1  
  }  
  if (!('banned' in user)) user.banned = false  
  if (!isNumber(user.level)) user.level = 0  
  if (!isNumber(user.coins)) user.coins = 0  

  let chat = global.db.data.chats[m.chat] ||= {}  
  if (!('isBanned' in chat)) chat.isBanned = false  
  if (!('bienvenida' in chat)) chat.bienvenida = true  
  if (!('antiLink' in chat)) chat.antiLink = false  
  if (!('onlyLatinos' in chat)) chat.onlyLatinos = false  
  if (!('nsfw' in chat)) chat.nsfw = false  
  if (!isNumber(chat.expired)) chat.expired = 0  

  let settings = global.db.data.settings[this.user.jid] ||= {}  
  if (!('self' in settings)) settings.self = false  
  if (!('autoread' in settings)) settings.autoread = true 
  if (!('autoread' in opts)) opts.autoread = true 
} catch (e) {  
  console.error(e)  
}  

if (opts['nyimak']) return  
if (!m.fromMe && opts['self']) return  
if (opts['swonly'] && m.chat !== 'status@broadcast') return  
if (typeof m.text !== 'string') m.text = ''  

let _user = global.db.data?.users?.[m.sender]  

const createOwnerIds = (number) => {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  return [
    cleanNumber + '@s.whatsapp.net',
    cleanNumber + '@lid'
  ]
}

const allOwnerIds = [
  conn.decodeJid(global.conn.user.id),
  ...global.owner.flatMap(([number]) => createOwnerIds(number)),
  ...(global.ownerLid || []).flatMap(([number]) => createOwnerIds(number))
]

const isROwner = allOwnerIds.includes(m.sender)
const isOwner = isROwner || m.fromMe  
const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)  
const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.prem == true  

if (opts['queque'] && m.text && !(isMods || isPrems)) {  
  let queque = this.msgqueque, time = 1000 * 5  
  const previousID = queque[queque.length - 1]  
  queque.push(m.id || m.key.id)  
  setInterval(async function () {  
    if (queque.indexOf(previousID) === -1) clearInterval(this)  
    await delay(time)  
  }, time)  
}  

if (m.isBaileys) return  
m.exp += Math.ceil(Math.random() * 10)  

const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}  
const participants = (m.isGroup ? groupMetadata.participants : []) || []  
const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}  
const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}  
const isRAdmin = user?.admin == 'superadmin' || false  
const isAdmin = isRAdmin || user?.admin == 'admin' || false  
const isBotAdmin = bot?.admin || false  

const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')  

global.idcanal = '120363403143798163@newsletter'  
global.namecanal = 'LOVELLOUD Official Channel'  
global.rcanal = {  
  contextInfo: {  
    isForwarded: true,  
    forwardedNewsletterMessageInfo: {  
      newsletterJid: idcanal,  
      serverMessageId: 100,  
      newsletterName: namecanal  
    }  
  }  
}  

let usedPrefix = '.'  


let commandExecuted = false

for (let name in global.plugins) {  
  let plugin = global.plugins[name]  
  if (!plugin) continue  
  if (plugin.disabled) continue  

  const __filename = join(___dirname, name)  

  if (typeof plugin.all === 'function') {  
    try {  
      await plugin.all.call(this, m, {  
        chatUpdate,  
        __dirname: ___dirname,  
        __filename  
      })  
    } catch (e) {  
      console.error(e)  
    }  
  }  

  if (!opts['restrict']) {  
    if (plugin.tags && plugin.tags.includes('admin')) continue  
  }  

  const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')  
  let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix  
  let match = (_prefix instanceof RegExp ?  
    [[_prefix.exec(m.text), _prefix]] :  
    Array.isArray(_prefix) ?  
      _prefix.map(p => {  
        let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))  
        return [re.exec(m.text), re]  
      }) :  
      typeof _prefix === 'string' ?  
        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :  
        [[[], new RegExp]]  
  ).find(p => p[1] && p[0])  

  if (!match) continue  

  const prefixMatch = match[0]  
  const noPrefix = m.text.slice(prefixMatch[0].length).trim()  
  const [commandText, ...args] = noPrefix.split(/\s+/)  
  const command = commandText?.toLowerCase()  

  const isMatchCommand = plugin.command && (  
    typeof plugin.command === 'string'  
      ? command === plugin.command  
      : plugin.command instanceof RegExp  
        ? plugin.command.test(command)  
        : Array.isArray(plugin.command)  
          ? plugin.command.includes(command)  
          : false  
  )  

  if (isMatchCommand) {  
    commandExecuted = true 
    try {  
      await plugin.call(this, m, {  
        match,  
        conn: this,  
        participants,  
        groupMetadata,  
        user,  
        bot,  
        isROwner,  
        isOwner,  
        isRAdmin,  
        isAdmin,  
        isBotAdmin,  
        isPrems,  
        chatUpdate,  
        __dirname: ___dirname,  
        __filename,  
        usedPrefix: prefixMatch[0],  
        command,  
        args,  
        text: args.join(' ').trim()
      })  
      m.plugin = name  
      m.command = command  
      m.args = args  
    } catch (e) {  
      m.error = e  
      console.error(e)  
    }  
  }  
}  


if (m.text && !commandExecuted) {
  
  const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  let _prefix = conn.prefix ? conn.prefix : global.prefix
  let match = (_prefix instanceof RegExp ?  
    [[_prefix.exec(m.text), _prefix]] :  
    Array.isArray(_prefix) ?  
      _prefix.map(p => {  
        let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))  
        return [re.exec(m.text), re]  
      }) :  
      typeof _prefix === 'string' ?  
        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :  
        [[[], new RegExp]]  
  ).find(p => p[1] && p[0])

  if (match) {
    const prefixMatch = match[0]
    const noPrefix = m.text.slice(prefixMatch[0].length).trim()
    const [commandText, ...args] = noPrefix.split(/\s+/)
    const command = commandText?.toLowerCase()

    if (command) {
      
      const fullCommand = prefixMatch[0] + commandText
      const menuCommand = prefixMatch[0] + 'menu'
      
      
      let bestSuggestion = null
      let bestScore = 0
      const allCommands = []
      
      
      for (let name in global.plugins) {
        let plugin = global.plugins[name]
        if (!plugin || plugin.disabled) continue
        
        if (plugin.command) {
          if (Array.isArray(plugin.command)) {
            plugin.command.forEach(cmd => allCommands.push(cmd))
          } else if (typeof plugin.command === 'string') {
            allCommands.push(plugin.command)
          } else if (plugin.command instanceof RegExp) {
            
            const testText = 'test'
            if (plugin.command.test(testText)) {
              allCommands.push(testText)
            }
          }
        }
      }
      
      
      allCommands.forEach(cmd => {
        if (cmd.toLowerCase() !== command) {
          let score = 0
          const cmdLower = cmd.toLowerCase()
          
          
          if (command.length === 1) {
            if (cmdLower.startsWith(command)) score += 50
            if (cmdLower.includes(command)) score += 30
          }
          
         
          if (command.length <= 3) {
            if (cmdLower.startsWith(command)) score += 40
            if (cmdLower.includes(command)) score += 25
          }
          
         
          if (command.length === cmdLower.length) {
            let charMatches = 0
            for (let i = 0; i < command.length; i++) {
              if (command[i] === cmdLower[i]) charMatches++
            }
            
            if (charMatches / command.length >= 0.7) score += 35
          }
          
          
          if (cmdLower.includes(command)) score += 20
          
          
          if (command.includes(cmdLower)) score += 15
          
          
          if (cmdLower.startsWith(command) || command.startsWith(cmdLower)) score += 10
          
          
          if (cmdLower.endsWith(command) || command.endsWith(cmdLower)) score += 8
          
         
          for (let i = 0; i < Math.min(command.length, cmdLower.length); i++) {
            if (command[i] === cmdLower[i]) score += 3
          }
          
          
          if (command.length === cmdLower.length) score += 5
          
          if (score > bestScore) {
            bestScore = score
            bestSuggestion = cmd
          }
        }
      })
      
      let message = `《✧》El comando *${fullCommand}* no existe en KIYOMI MD.\n\n`
      
      if (bestSuggestion && bestScore >= 10) {
        
        const cmdLower = bestSuggestion.toLowerCase()
        let similarityScore = 0
        
       
        let charMatches = 0
        for (let i = 0; i < Math.min(command.length, cmdLower.length); i++) {
          if (command[i] === cmdLower[i]) charMatches++
        }
        
        
        const charSimilarity = charMatches / Math.max(command.length, cmdLower.length)
        
        
        let contentSimilarity = 0
        if (cmdLower.includes(command)) contentSimilarity = command.length / cmdLower.length
        else if (command.includes(cmdLower)) contentSimilarity = cmdLower.length / command.length
        
       
        let startSimilarity = 0
        const minLength = Math.min(command.length, cmdLower.length)
        for (let i = 0; i < minLength; i++) {
          if (command[i] === cmdLower[i]) startSimilarity += 1
        }
        startSimilarity = startSimilarity / minLength
        
      
        const finalSimilarity = (charSimilarity * 0.4 + contentSimilarity * 0.4 + startSimilarity * 0.2)
        const percentage = Math.min(100, Math.round(finalSimilarity * 100))
        
        message += `*Posibilidad de que sea:*\n`
        message += `╰➺ *${prefixMatch[0]}${bestSuggestion}* (${percentage}%)\n\n`
      }
      
      message += `> Por favor usa *${menuCommand}* para ver la lista de comandos disponibles.`
      
      return conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
  }
}

global.dfail = (type, m, conn) => {  
  const msg = {  
    rowner: `✤ Hola, este comando solo puede ser utilizado por el *Creador* de la Bot.`,  
    owner: `✤ Hola, este comando solo puede ser utilizado por el *Creador* de la Bot y *Sub Bots*.`,  
    mods: `✤ Hola, este comando solo puede ser utilizado por los *Moderadores* de la Bot.`,  
    premium: `✤ Hola, este comando solo puede ser utilizado por Usuarios *Premium*.`,  
    group: `✤ Hola, este comando solo puede ser utilizado en *Grupos*.`,  
    private: `✤ Hola, este comando solo puede ser utilizado en mi Chat *Privado*.`,  
    admin: `✤ Hola, este comando solo puede ser utilizado por los *Administradores* del Grupo.`,  
    botAdmin: `✤ Hola, la bot debe ser *Administradora* para ejecutar este Comando.`,  
    unreg: `✤ Hola, para usar este comando debes estar *Registrado.*`,  
    restrict: `✤ Hola, esta característica está *deshabilitada.*`  
  }[type]  
  if (msg) return conn.reply(m.chat, msg, m, rcanal)  
}

} catch (e) {
console.error(e)
} finally {
if (opts['queque'] && m.text) {
const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
}

let user, stats = global.db.data.stats  
if (m) {  
  if (m.sender && (user = global.db.data.users[m.sender])) {  
    user.exp += m.exp  
    user.limit -= m.limit * 1  
  }  

  let stat  
  if (m.plugin) {  
    let now = +new Date  
    stat = stats[m.plugin] ||= {  
      total: 0,  
      success: 0,  
      last: 0,  
      lastSuccess: 0  
    }  
    stat.total += 1  
    stat.last = now  
    if (m.error == null) {  
      stat.success += 1  
      stat.lastSuccess = now  
    }  
  }  
}  

try {  
  if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)  
} catch (e) {  
  console.log(m, m.quoted, e)  
}  

const settingsREAD = global.db.data.settings[this.user.jid] || {}


const isSubBot = this.user.jid !== global.conn.user.jid
let shouldAutoRead = true

if (isSubBot) {
  try {
    const botNumber = this.user.jid.split('@')[0].replace(/\D/g, '')
    const configPath = `./Serbot/${botNumber}/config.json`
    
    if (existsSync(configPath)) {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'))
     
      if (config.autoRead === false) {
        shouldAutoRead = false
      }
    }
  } catch (error) {
   
    console.error('Error leyendo configuración de auto-leer:', error)
  }
}


if (shouldAutoRead) {
  try {
    await this.readMessages([m.key])
    
    if (m.isGroup) {
      await this.readMessages([m.key], { readEphemeral: true })
    }
  } catch (e) {
    console.error('Error al marcar como leído:', e)
  }
}

}
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
unwatchFile(file)
console.log(chalk.magenta("Se actualizó 'handler.js'"))
if (global.reloadHandler) console.log(await global.reloadHandler())
})
