// Dependencies
import test from 'ava'
import EntryService from '../../services/entry.js'

// Setup
const sampleEntries = [
  {
    when: 1512843286890,
    description: "Paired with Rodolfo to work on the CLI"
  },
  {
    when: 1513707029231,
    description: "Created a new feature for XYZ project"
  },
  {
    when: 1513353663070,
    description: "Paired with Paulo on Green story"
  },
  {
    when: 1513354558567,
    description: "Went to the supermarket"
  }
]

const now = new Date().getTime()
const newSampleEntry = {
  when: now,
  description: 'Added the create method'
}

// Reset db after every test
test.beforeEach(t => EntryService.reset())

// Tests
test.serial('Get list of entries', async t => {
  const value = await EntryService.index()
  t.deepEqual(sampleEntries, value, 'Entries are not the same')
})

test.serial('Get list of entries ordered by day', async t => {
  const value = await EntryService.index({orderByDay: true})
  const expectedEntries = {
    '2017/12/09':
      [{
        when: 1512843286890,
        description: 'Paired with Rodolfo to work on the CLI'
      }],
    '2017/12/19':
      [{
        when: 1513707029231,
        description: 'Created a new feature for XYZ project'
      }],
    '2017/12/15':
      [{
        when: 1513353663070,
        description: 'Paired with Paulo on Green story'
      },
      { when: 1513354558567, description: 'Went to the supermarket' }]
  }

  t.deepEqual(expectedEntries, value, 'Entries ordenation is wrong')
})

test.serial('Insert a new entry', async t => {
  const value = await EntryService.create(newSampleEntry)
  t.deepEqual(newSampleEntry, value, 'New entry not created')
})

test.serial('Return list updated after add a new entry', async t => {
  const oldList = await EntryService.index()
  const newEntry = {
    when: new Date().getTime(),
    description: 'New entry for the updated list'
  }

  const newEntryAdded = await EntryService.create(newEntry)
  const updatedList = await EntryService.index()

  t.is(oldList.length + 1, updatedList.length, 'Entries list has one more item')
  t.deepEqual(updatedList.pop(), newEntry, 'New entry was not added to the entries list')
})

test.serial('Erase an item from the list', async t => {
  const oldList = await EntryService.index()

  t.is(oldList.length, 4)

  const byeItem = oldList[0]

  const deleted = await EntryService.destroy(byeItem)
  const updatedList = await EntryService.index()

  t.is(deleted, true, 'Item was removed')
  t.is(oldList.length - 1, updatedList.length, 'Entries list has one less item')
})