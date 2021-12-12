const { convert } = require('url-slug')

const getSlug = require('./lib/get-slug')

exports.setFieldsOnGraphQLNodeType = ({ type }, {
  baseField,
  fieldName = 'slug',
  nodeType = false,
  uniqueSlugs = false,
  urlSlug: urlSlugOptions = {}
}) => {
  if (typeof nodeType === 'string') {
    if (type.name !== nodeType) return
  } else if (Array.isArray(nodeType)) {
    if (!nodeType.includes(type.name)) return
  } else if (nodeType !== false) {
    throw new Error(`"nodeType" value is invalid: "${nodeType}"`)
  } else {
    return
  }

  return {
    [fieldName]: {
      type: 'String',
      resolve: node => {
        if (!uniqueSlugs) {
          return getSlug(node, baseField, urlSlugOptions)
        }

        const counter = {}

        for (const typeNode of type.nodes) {
          const slug = getSlug(typeNode, baseField, urlSlugOptions)

          if (typeNode.id !== node.id) {
            counter[slug] = (counter[slug] || 0) + 1
            continue
          }

          return counter[slug]
            ? convert(`${slug} ${counter[slug]}`, urlSlugOptions)
            : slug
        }

        throw new Error('Unable to process slug')
      }
    }
  }
}
