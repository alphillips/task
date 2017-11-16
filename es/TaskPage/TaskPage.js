function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { hashHistory } from 'react-router';
import TaskList from './../TaskList/TaskList';
import TaskDetail from './../TaskDetail/TaskDetail';

var TaskPage = function (_React$Component) {
  _inherits(TaskPage, _React$Component);

  function TaskPage(props) {
    _classCallCheck(this, TaskPage);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleIdChange = function (id) {
      hashHistory.push('/task-page/' + (id || ''));
    };

    _this.state = {
      id: props.params.id || null
    };
    return _this;
  }

  TaskPage.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(function (prevState, props) {
      return {
        id: nextProps.params.id || null
      };
    });
  };

  TaskPage.prototype.render = function render() {
    return (
      //    <div>
      // <Tasks
      //   id={this.state.id}
      //   onChange={this.handleIdChange}
      // />

      React.createElement(
        'div',
        null,
        !this.state.id && React.createElement(TaskList, null),
        this.state.id && React.createElement(TaskDetail, { taskid: this.state.id })
      )

      //    </div>

    );
  };

  return TaskPage;
}(React.Component);

export default TaskPage;