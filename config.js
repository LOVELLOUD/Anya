import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51942501966', 'Sung', true],
  ['51901437507', 'Sunkovv', true],
]


global.ownerLid = [
  ['114263544885392', 'Sunkovv', true],
  ['78186205446362', 'Sung', true],
]

global.sessions = 'Sessions'
global.bot = 'Serbot' 
global.AFBots = true

global.packname = 'LOVELLOUD'
global.namebot = 'KIYOMI MD'
global.author = 'Sung'


global.canal = 'https://whatsapp.com/channel/0029VbAZUQ3002T9KZfx2O1M'

global.ch = {
ch1: '120363403143798163@newsletter',
}

global.mods = []
global.prems = []

global.multiplier = 69 
global.maxwarn = '2'

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
