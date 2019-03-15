'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _backButton = require('@react-ag-components/back-button');

var _backButton2 = _interopRequireDefault(_backButton);

var _TaskList = require('./TaskList/TaskList');

var _TaskList2 = _interopRequireDefault(_TaskList);

var _TaskDetail = require('./TaskDetail/TaskDetail');

var _TaskDetail2 = _interopRequireDefault(_TaskDetail);

var _messages = require('@react-ag-components/messages');

var _messages2 = _interopRequireDefault(_messages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TaskUIComponent = function (_React$Component) {
  _inherits(TaskUIComponent, _React$Component);

  function TaskUIComponent(props) {
    _classCallCheck(this, TaskUIComponent);

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

  TaskUIComponent.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(function (prevState, props) {
      return {
        id: nextProps.id || null
      };
    });
  };

  TaskUIComponent.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      null,
      !this.state.id && _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_TaskList2.default, {
          onChange: this.onTaskClick,
          showSearch: this.props.showSearch,
          assignedToUser: this.props.assignedToUser,
          taskCount: this.props.taskCount,
          heading: this.props.heading,
          searchTypeCode: this.props.searchTypeCode,
          searchKeyword: this.props.searchKeyword,
          quickLinkType: this.props.quickLinkType
        })
      ),
      this.state.id && _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_TaskDetail2.default, {
          taskid: this.state.id,
          setMessage: this.setMessage,
          onChange: this.onTaskClick
        })
      )
    );
  };

  return TaskUIComponent;
}(_react2.default.Component);

exports.default = TaskUIComponent;
module.exports = exports['default'];