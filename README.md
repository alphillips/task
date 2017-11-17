# Task

Task list and details as reusable component


## Usage

### Install
```
npm i @react-ag-components/task --save
```
### Use in your project
```
import {Tasks} from '@react-ag-components/task'
```
Your page should look like this
```
constructor(props) {
  super(props);
  this.state = {
    id:props.params.id || null,
    success:props.success,
    error:props.error,
  }
}

componentWillReceiveProps(nextProps){
  this.setState((prevState, props) => ({
    success:'',
    id:nextProps.params.id || null
  }))
}

handleIdChange = (id) => {
  hashHistory.push('/tasks/' + (id || ''))
}

render() {
  return (
    <div>

      <Tasks
        id={this.state.id}
        onChange={this.handleIdChange}
      />

    </div>
  )
}
```


## Contributing

Get the repository
```
git clone https://github.com/alphillips/task.git
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
