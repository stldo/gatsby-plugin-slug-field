# gatsby-plugin-slug-field [![npm][1]][2]

Create a `slug` field in nodes using data from their other fields.

## Installation

```sh
npm install gatsby-plugin-slug-field
```

## Usage

```js
/* gatsby-config.js */

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-slug-field',
      options: {
        /* gatsby-plugin-slug-field options here */
      }
    }
  ]
}
```

The `nodeType` option must be set to enable the plugin. A `slug` field will be
added to node types matching this option, and the slug will be generated using
the data from `baseField` option.

### Example

Using the following options:

```js
/* gatsby-config.js */

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-slug-field',
      options: {
        baseField: ['author', 'title', 'id'],
        fieldName: 'postSlug',
        nodeType: 'PostsYaml',
        urlSlug: {
          separator: '_'
        }
      },
    }
  ],
}
```

The query:

```graphql
query {
  allPostsYaml {
    nodes {
      id
      title
      author
      postSlug
    }
  }
}
```

Will return:

```js
{
  data: {
    allPostsYaml: {
      nodes: {
        id: 1234,
        title: 'Blog Post Title',
        author: undefined,
        postSlug: 'blog_post_title_1234'
      }
    }
  }
}
```

## Options

### baseField

Type: `string`, `Array` or `function`.

Defines the fields used to generate the slug. If set to a `string` or an
`Array`, the matching fields will be used to generate the slug — if a field is
`null` or `undefined`, it will be included as an empty string. For more complex
use cases, a function is also accepted. It will receive the current node as the
only parameter (e.g. `node => node.field + '-slug'`) and must return a `string`
— which will be used by [url-slug][3] to generate the slug.

### fieldName

Type: `string`. Default: `'slug'`.

The field name to store the generated slug. If the source node already has a
field with the same name, its value will be passed to `url-slug`, and the
`baseField` option will be ignored for that node.

### nodeType

Type: `string`, `Array` or `false`. Default: `false`.

Filter which node types will be processed. It can be a single node type (e.g.
`'PostsYaml'`), or an array of node types (e.g. `['AuthorsYaml', 'PostsYaml']`).
Set it to `false` to disable the plugin.

### uniqueSlugs

Type: `boolean`. Default: `false`.

If this option is set to true, a numerical suffix will be added to duplicated
slugs.

> __Caveat:__ the numerical suffix can change during development or between
> production builds.

### urlSlug

Type: `Object`. Default: `{}`.

`url-slug` options, more info can be found [here][4].

## License

[The MIT License][license]

[1]: https://img.shields.io/npm/v/gatsby-plugin-slug-field
[2]: https://www.npmjs.com/package/gatsby-plugin-slug-field
[3]: https://github.com/stldo/url-slug
[4]: https://github.com/stldo/url-slug#readme
[license]: ./LICENSE
