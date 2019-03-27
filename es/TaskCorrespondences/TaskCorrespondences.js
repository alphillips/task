function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import * as api from "./../api";
import "./task-correspondences.css";

//import Mail from "./../Mail";
import MailsList from "./MailsList";

var TaskCorrespondences = function (_React$Component) {
  _inherits(TaskCorrespondences, _React$Component);

  function TaskCorrespondences(props) {
    _classCallCheck(this, TaskCorrespondences);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.readAllCorrespondenceThreads = function () {
      _this.setState({ loading: true });

      if (_this.props.serviceRequestId) {
        api.getAllCorrespondences(_this.props.serviceRequestId).then(function (data) {
          _this.setState({ loading: false, messageThreads: data == null ? [] : data });
        });
      }
    };

    _this.toggleMailsListVisible = function () {
      if (_this.state.mailsListVisible) {
        _this.setState({ mailsListVisible: false });
        _this.props.callbackOpenParentTask();
      } else {
        _this.setState({ mailsListVisible: true });
        _this.props.callbackCloseParentTask();
      }
    };

    _this.callbackCloseSelf = function () {
      _this.setState(function (prevState, props) {
        return {
          mailsListVisible: false
        };
      });
      _this.props.callbackOpenParentTask();
    };

    _this.state = {
      loadin: false,
      messageThreads: null,
      mailsListVisible: true
    };
    _this.serviceRequestId = props.serviceRequestId || null;
    return _this;
  }

  TaskCorrespondences.prototype.componentDidMount = function componentDidMount() {
    this.readAllCorrespondenceThreads();
  };

  TaskCorrespondences.prototype.render = function render() {
    var mailsListNode = null;
    if (this.state.mailsListVisible && this.props.serviceRequestId && this.state.messageThreads && this.props.task) {
      mailsListNode = React.createElement(MailsList, {
        task: this.props.task,
        messageThreads: this.state.messageThreads,
        serviceRequestId: this.props.serviceRequestId,
        callbackCloseSelf: this.callbackCloseSelf,
        callbackOpenParentTask: this.props.callbackOpenParentTask,
        callbackCloseParentTask: this.props.callbackCloseParentTask,
        callbackShowMessage: this.props.callbackShowMessage,
        taskid: this.props.taskid
      });
    }

    return React.createElement(
      "div",
      { style: { border: "solid 0px #e8e8ee" }, className: " uikit-grid" },
      React.createElement(
        "div",
        null,
        mailsListNode
      )
    );
  };

  return TaskCorrespondences;
}(React.Component);

export default TaskCorrespondences;