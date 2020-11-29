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
  { node, actions, getNodes },
  { filter = true, source, fieldName = 'slug', urlSlugOptions = {}, avoidCollision = false }
) {
  if (typeof filter === 'function') {
    if (!filter(node)) return
  } else if (isPlainObject(filter)) {
    if (!validateFilter(node, filter)) return
  } else if (filter === false) {
    return
  } else if (filter !== true) {
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


  const slugs = avoidCollision
    ? getNodes()
      .filter(existingNode => validateFilter(existingNode, filter))
      .map(existingNode => existingNode?.fields?.[fieldName])
      .filter(Boolean)
    : []

  let increment = 0
  let slug = ''

  do {
    slug = urlSlug(
      `${baseString}${increment ? ` ${increment}` : ''}`,
      urlSlugOptions
    )
    increment++
  } while (slugs.includes(slug))

  createNodeField({
    node,
    name: fieldName,
    value: baseString.length ? slug : '',
  })
}
