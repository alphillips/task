# header

React header component for external web apps

> Note: This header doesn't not yet include the menu or logged in user.
But it will soon :v:

## Usage

### Install
```
npm i @react-ag-components/header --save
```
### Use in your project
```
import Header from '@react-ag-components/header'
```

```
<Header />
```

### Properties

| prop        | Type           | Note  |
| ------------- |:-------------:| -----:|
| showInbox      | boolean | inbox search visibility |
| menu     | object      |   {<ul><li>...} |
| abn | string      |  abn number   |
| userName | string      |    their logon id, normally their email |
| name | string      | page heading    |
| searchArray |  JSON Array     |    array to search on |
| searchKey |   string   |    "id"|
| searchDisplayAttributes | array      |    ['id','status','date','destinationCountry'] |


## Contributing

Get the repository
```
git clone https://github.com/alphillips/header.git
```

Update dependencies
```
npm install
```

Run the project
```
npm start
```

### Deploy to npm
#### Build
`npm run build -- --copy-files`

#### Publish
`npm publish --access public`
