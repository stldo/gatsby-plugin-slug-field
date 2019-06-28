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
      resolve: `gatsby-plugin-slug-field`,
      options: {
        filter: { internal: { type: 'PostsYaml' } }
        source = ['author', 'title', 'id'],
        fieldName = 'postSlug',
        urlSlugOptions = {
          separator: '_'
        }
      },
    }
  ],
}
```

```graphql
# Using the options set above

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

### filter

Type: `object`, `function` or `false`

Determines which nodes will be processed. It can be set to an object for simple matching (e.g.: `{ author: 'John Q.' }`) or a function, for complex cases. The function will receive the current node as parameter (e.g.: `(node) => node.field ? true : false`), and must return `true` if the node should be processed or `false` otherwise. If all nodes should be processed, `filter` must be explicitly set to `false`. Any other value will throw an error.

### source

Type: `string`, `array` or `function`

Defines the fields used to generate the slug. If set to a `string` or `array`, the matching fields will be used to generate the slug. If a field is `null` or `undefined`, it will be included as an empty string. For complex cases, a function can be used. It will receive the current node as parameter (e.g.: `(node) => node.field + '-slug'`), and must return a `string` to be processed by url-slug.

### fieldName

Type: `string`

The field name to be used in `createNodeField`. Its default value is `'slug'`.

### urlSlugOptions

Type: `object`

The options to be passed to url-slug. It accepts `separator` and `transformer` as parameters. More info about these options can be found on [url-slug documentation](https://github.com/stldo/url-slug).

## License

[The MIT License](./LICENSE)
