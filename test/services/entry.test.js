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

  t.deepEqual(expectedEntries, value, 'Entries ordenation is wrong')
})

test.serial('Get list of entries filtered by some value', async t => {
  const value = await EntryService.index({orderByDay: true, filter: 'Rodolfo' })

  t.deepEqual(Object.assign({}, { '2017/12/09': expectedEntries['2017/12/09'] }), value, 'Could not filter')
})

test.serial('Insert a new entry', async t => {
  const value = await EntryService.create(newSampleEntry)
  t.deepEqual(newSampleEntry, value, 'New entry created')
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
  t.deepEqual(updatedList.pop(), newEntry, 'New entry added to the entries list')
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


test.serial('Edit an item from the list', async t => {
  const oldList = await EntryService.index()

  t.is(oldList.length, 4)

  const editedItem = oldList[0]
  const when = new Date().getTime()
  const newDesc = 'Changed my mind about x'

  const edited = await EntryService.edit(editedItem, when, newDesc)
  const updatedList = await EntryService.index()
  const updatedLength = updatedList.length

  t.is(edited, true, 'Item was edited')
  t.is(oldList.length, updatedLength, 'Entries list has one item modified')
  // t.is(updatedList[updatedLength - 1].when, when, 'Date changed')
  t.is(updatedList[updatedLength - 1].description, newDesc, 'Description changed')
})

test.serial('Erase all entries', async t => {
  const oldList = await EntryService.index()

  t.is(oldList.length, 4)

  const deleted = await EntryService.clean()
  const updatedList = await EntryService.index()

  t.is(deleted, true, 'All items removed')
  t.is(updatedList.length, 0, 'All entries deleted')
})