const EventEmitter = require('events')

class Server extends EventEmitter {
  constructor(client) {
    super()
    this.tasks = {}
    this.taskId = 1
    
    process.nextTick(() => {
      this.emit('response', 'Type a command (help to list commands)')
    })

    client.on('command', (command, args) => {
      console.log(command, args)
      switch (command) {
        case 'add':
        case 'ls':
        case 'delete':
        case 'help':
          this[command](args)
          break
        default:
          this.emit('response', 'Unavailable Command')
      }

    })
  }

  takeString() {
    return Object.keys(this.tasks).map(key => {
      return `${key}: ${this.tasks[key]}`
    }).join('\n')
  }

  add(args) {
    this.tasks[this.taskId] = args.join(' ')
    this.emit('response', `Added task ${this.taskId}`)
    this.taskId++
  }

  ls() {
    this.emit('response', `Tasks: \n${this.takeString()}`)
  }

  delete(args) {
    delete (this.tasks[args[0]])
    this.emit('response', `Deleted ${args[0]} task`)
  }

  help() {
    this.emit('response', `Available Commands:
      add task
      ls
      help
      delete :id`)
  }
}

module.exports = (client) => new Server(client)