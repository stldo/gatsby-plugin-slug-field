# gatsby-plugin-slug-field

> ⚠️ __Warning__: This plugin was completely rewritten in version 0.3.0. Check
> the section "[Migrating from 0.2.0](#migrating-from-020)" for more
> information about what was changed.

Create slugs from node data, using specific fields to generate a source string.

```graphql
# Using default options, with source parameter set to 'title'

query {
  allPostsYaml {
    edges {
      node {
        id # 1234
        title # 'Blog Post Title'
        content # ...
        slug # blog-post-title
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
        baseField: 'title',
        fieldName: 'slug',
        nodeType: 'PostsYaml',
        urlSlug: {}
      },
    }
  ],
}
```

## Options

### baseField

Type: `string`, `Array` or `function`.

Defines the fields used to generate the slug. If set to a `string` or `array`,
the matching fields will be used to generate the slug — if a field is `null` or
`undefined`, it will be included as an empty string. For complex cases, you can
use a function with this option. It will receive the current node as parameter
(e.g. `node => node.field + '-slug'`), and must return a `string` to be
processed by [url-slug](https://github.com/stldo/url-slug).

### fieldName

Default: `'slug'`. Type: `string`.

The field name to store the generated slug. If the source node has a field with
the same name already, its value will be passed to
[url-slug](https://github.com/stldo/url-slug) and the `baseField` option will be
ignored for that node.

### nodeType

Default: `false`. Type: `string`, `Array` or `false`.

Filter which nodes will be processed. It can be a single node type (e.g.
`'PostsYaml'`), or an array of node types (e.g. `['AuthorsYaml', 'PostsYaml']`).
Set it to `false` to disable the plugin.

### uniqueSlugs

Default: `false`. Type: `boolean`.

If this option is set to true, a numerical suffix will be added to duplicated
slugs.

#### Caveats

The order of the nodes is not fixed in Gatsby so, after editing a node in
development environment, its suffixes can be changed.

### urlSlug

Default: `{}`. Type: `Object`.

The options object to be passed to
[url-slug](https://github.com/stldo/url-slug). More info about it can be found
in the [url-slug documentation](https://github.com/stldo/url-slug#readme).

## Usage

```javascript
// gatsby-config.js

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-slug-field',
      options: {
        nodeType: 'PostsYaml',
        source: ['author', 'title', 'id'],
        fieldName: 'postSlug',
        urlSlug: {
          separator: '_'
        }
      },
    }
  ],
}
```

```graphql
# The options set above will reflect in the following query

query {
  allPostsYaml {
    edges {
      node {
        id # 1234
        title # 'Blog Post Title'
        author # null
        postSlug # blog_post_title_1234
      }
    }
  }
}
```

## Migrating from 0.2.0

There are breaking changes in version 0.3.0 for users coming from 0.2.0.

### fieldName

In version 0.2.0, the `fieldName` field was available in the `fields` section.
Now, it'll be available right in the node, i.e.:

```graphql
# Version 0.2.0
query {
  contentNode {
    fields {
      slug
    }
  }
}

# Version 0.3.0
query {
  contentNode {
    slug
  }
}
```

### `filter` options was deprecated

Instead of using the `filter` option, use the new `nodeType` option. Starting in
version 0.3.0, this plugin will only filter nodes by their type. Due to the
GraphQL's nature, this will not affect most projects. If this change affects
you, please open an issue, so we can find a workaround.

### Renamed options

The following options were renamed:

- `source`: `baseField`;
- `urlSlugOptions`: `urlSlug`.

## License

[The MIT License](./LICENSE)
