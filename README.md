# gatsby-plugin-slug-field

Create slugs from node data, using specific fields to generate a source string.

```graphql
# Using default options, with source parameter set to 'title'

{
  allPostsYaml {
    edges {
      node {
        id # 1234
        title # 'Blog Post Title'
        content # ...
        fields {
          slug # blog-post-title
        }
      }
    }
  }
}
```

## Install

```bash
$ npm install gatsby-plugin-slug-field
```

## Configure

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-slug-field',
      options: {
        filter: { internal: { type: 'Yaml' } },
        source: 'field-name',
        fieldName: 'slug',
      },
    }
  ],
}
```

## Options

### filter

Default: `true`. Type: `Object`, `function` or `boolean`.

Determines which nodes will be processed. It can be set to an object for simple
matching (e.g.: `{ author: 'John Q.' }`) or a function, useful in complex cases.
The function will receive the current node as parameter (e.g.:
`node => node.field ? true : false`) and must return `true` if the node
should be processed or `false` to ignore it. Set `filter` to `true` if every
node should be processed or `false` to ignore all nodes.

### source

Default: `undefined`. Type: `string`, `Array` or `function`.

Defines the fields used to generate the slug. If set to a `string` or `array`,
the matching fields will be used to generate the slug — if a field is `null` or
`undefined`, it will be included as an empty string. For complex cases, you can
use a function with this option. It will receive the current node as parameter
(e.g.: `node => node.field + '-slug'`), and must return a `string` that will be
processed by [url-slug](https://github.com/stldo/url-slug).

### fieldName

Default: `'slug'`. Type: `string`.

The field name to be used by `createNodeField`, it will contain the generated
slug.

### urlSlugOptions

Default: `{}`. Type: `Object`.

The options object to be passed to __url-slug__. More info about it can be found
on [url-slug documentation](https://github.com/stldo/url-slug#readme).

## Usage

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-slug-field',
      options: {
        filter: { internal: { type: 'PostsYaml' } },
        source: ['author', 'title', 'id'],
        fieldName: 'postSlug',
        urlSlugOptions: {
          separator: '_'
        }
      },
    }
  ],
}
```

```graphql
# The options set above will enable the following query

{
  allPostsYaml {
    edges {
      node {
        id # 1234
        title # 'Blog Post Title'
        author # null
        fields {
          postSlug # blog_post_title_1234
        }
      }
    }
  }
}
```

## License

[The MIT License](./LICENSE)
