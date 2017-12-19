const Conf = require('conf')

const defaults = {
  entries: [
    {
      when: 1512843286890,
      description: "Paired with Rodolfo to work on the CLI"
    },
    {
      when: 1513707029231,
      description: "Created a new feature for XYZ project"
    }
  ]
}

const config = new Conf({
  projectName: `wrklogger${process.env.NODE_ENV === 'test' ? 'test' : ''}`,
  defaults: defaults
})

module.exports = {
  index() {
    return Promise.resolve(config.get('entries'))
  },

  create(entryParams) {
    const oldState = config.get('entries')
    oldState.push(entryParams)
    config.set('entries', oldState)

    return Promise.resolve(entryParams)
  },

  destroy(entry) {
    const entryString = JSON.stringify(entry).toString()
    const oldState = config.get('entries')

    const newState = oldState.filter((item) => {
      const currentString = JSON.stringify(item).toString()

      if (currentString !== entryString) return item
    })

    config.set('entries', newState)

    return Promise.resolve(true)
  },

  reset() {
    config.set('entries', defaults.entries)
  }
}