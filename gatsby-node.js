const { GraphQLString } = require('gatsby/graphql')
const { convert } = require('url-slug')

function getBase (node, baseField, reporter) {
  if (typeof baseField === 'string') {
    return node[baseField] != null ? String(node[baseField]) : ''
  } else if (typeof baseField === 'function') {
    const base = baseField(node)
    if (typeof base === 'string') {
      return base
    }
    reporter.error(
      '[gatsby-plugin-slug-field] "baseField" function must return a string.'
    )
  } else if (Array.isArray(baseField)) {
    return baseField.reduce((result, key) => {
      return `${result} ${node[key] != null ? node[key] : ''}`
    }, '')
  } else {
    reporter.error(
      `[gatsby-plugin-slug-field] "baseField" value is invalid: ` +
      `"${String(baseField)}".`
    )
  }

  return ''
}

function getSlug (node, baseField, urlSlugOptions, reporter) {
  const base = node.slug != null
    ? String(node.slug)
    : getBase(node, baseField, reporter)
  return base && convert(base, urlSlugOptions)
}

exports.setFieldsOnGraphQLNodeType = ({
  reporter,
  type
}, {
  baseField,
  fieldName = 'slug',
  nodeType = false,
  uniqueSlugs = false,
  urlSlug = {}
}) => {
  if (typeof nodeType === 'string') {
    if (type.name !== nodeType) return
  } else if (Array.isArray(nodeType)) {
    if (!nodeType.includes(type.name)) return
  } else {
    if (nodeType !== false) {
      reporter.error(
        `[gatsby-plugin-slug-field] "nodeType" value is invalid: ` +
        `"${String(nodeType)}".`
      )
    }
    return
  }

  return {
    [fieldName]: {
      type: GraphQLString,
      resolve: node => {
        if (!uniqueSlugs) {
          return getSlug(node, baseField, urlSlug, reporter)
        }

        const counter = {}

        for (const sibling of type.nodes) {
          const slug = getSlug(sibling, baseField, urlSlug, reporter)

          if (sibling.id !== node.id) {
            counter[slug] = (counter[slug] || 0) + 1
            continue
          }

          return !counter[slug]
            ? slug
            : convert(`${slug} ${counter[slug]}`, urlSlug)
        }

        reporter.error('Unable to process slug.')
        return ''
      }
    }
  }
}
