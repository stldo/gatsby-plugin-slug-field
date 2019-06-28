const isPlainObject = require(`is-plain-object`)
const urlSlug = require(`url-slug`)

function validateFilter(node, filter) {
  const entries = Object.entries(filter)

  for (let [key, value] of entries) {
    if (isPlainObject(value)) {
      if (!isPlainObject(node[key]) || !validateFilter(node[key], value)) {
        return false
      }
    } else if (node[key] !== value) {
      return false
    }
  }

  return true
}

exports.onCreateNode = function (
  { node, actions },
  { filter, source, fieldName = 'slug', urlSlugOptions = {} }
) {
  if (typeof filter === 'function') {
    if (!filter(node)) return
  } else if (isPlainObject(filter)) {
    if (!validateFilter(node, filter)) return
  } else if (filter !== false) {
    throw new Error(`Invalid 'filter' value: '${String(filter)}'`)
  }

  const typeOfSource = typeof source
  let baseString

  if (typeOfSource === 'string') {
    baseString = node[source] != null ? String(node[source]) : ''
  } else if (typeOfSource === 'function') {
    baseString = source(node)
    if (typeof baseString !== 'string') {
      throw new Error(`'source' function must return a string`)
    }
  } else if (Array.isArray(source)) {
    baseString = source.reduce((result, key) => {
      return `${result} ${node[key] != null ? node[key] : ''}`
    }, '')
  } else {
    throw new Error(`Invalid 'source' value: '${String(source)}'`)
  }

  const { createNodeField } = actions
  const { separator, transformer } = urlSlugOptions

  createNodeField({
    node,
    name: fieldName,
    value: baseString.length ? urlSlug(baseString, separator, transformer) : '',
  })
}
