function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import BackButton from '@react-ag-components/back-button';

import TaskList from './TaskList/TaskList';
import TaskDetail from './TaskDetail/TaskDetail';
import Messages from '@react-ag-components/messages';

var Tasksx = function (_React$Component) {
  _inherits(Tasksx, _React$Component);

  function Tasksx(props) {
    _classCallCheck(this, Tasksx);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.goBack = function () {
      _this.props.onChange(null);
    };

    _this.onTaskClick = function (id) {
      if (id) {
        _this.setMessage(null);
      }
      _this.props.onChange(id);
    };

    _this.setMessage = function (message) {
      _this.setState({ success: message });
    };

    _this.state = {
      id: props.id || null
    };
    return _this;
  }

  Tasksx.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(function (prevState, props) {
      return {
        id: nextProps.id || null
      };
    });
  };

  Tasksx.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      !this.state.id && React.createElement(
        'div',
        null,
        React.createElement(Messages, { success: this.state.success }),
        React.createElement(TaskList, { onChange: this.onTaskClick })
      ),
      this.state.id && React.createElement(
        'div',
        null,
        React.createElement(TaskDetail, {
          taskid: this.state.id,
          setMessage: this.setMessage,
          onChange: this.onTaskClick
        })
      )
    );
  };

  return Tasksx;
}(React.Component);

export default Tasksx;