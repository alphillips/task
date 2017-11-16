'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _TaskList = require('./../TaskList/TaskList');

var _TaskList2 = _interopRequireDefault(_TaskList);

var _TaskDetail = require('./../TaskDetail/TaskDetail');

var _TaskDetail2 = _interopRequireDefault(_TaskDetail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TaskPage = function (_React$Component) {
  _inherits(TaskPage, _React$Component);

  function TaskPage(props) {
    _classCallCheck(this, TaskPage);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleIdChange = function (id) {
      _reactRouter.hashHistory.push('/task-page/' + (id || ''));
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

      _react2.default.createElement(
        'div',
        null,
        !this.state.id && _react2.default.createElement(_TaskList2.default, null),
        this.state.id && _react2.default.createElement(_TaskDetail2.default, { taskid: this.state.id })
      )

      //    </div>

    );
  };

  return TaskPage;
}(_react2.default.Component);

exports.default = TaskPage;
module.exports = exports['default'];