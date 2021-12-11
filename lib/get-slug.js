const { convert } = require('url-slug')

function getSlugParts (node, baseField) {
  if (baseField === undefined) {
    throw new Error('"baseField" is required')
  } else if (typeof baseField === 'string') {
    return node[baseField] != null
      ? String(node[baseField])
      : ''
  } else if (typeof baseField === 'function') {
    const result = baseField(node)
    if (typeof result !== 'string') {
      throw new Error('"baseField" function must return a string')
    }
    return result
  } else if (Array.isArray(baseField)) {
    return baseField.reduce((result, key) => {
      return node[key] != null ? `${result} ${node[key]}` : result
    }, '')
  } else {
    throw new Error(`"baseField" value is invalid: "${baseField}"`)
  }
}

module.exports = (node, baseField, urlSlugOptions) => {
  const slugParts = node.slug != null
    ? String(node.slug)
    : getSlugParts(node, baseField)

  return slugParts && convert(slugParts, urlSlugOptions)
}
