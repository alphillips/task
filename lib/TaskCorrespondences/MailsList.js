"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _input = require("@react-ag-components/input");

var _input2 = _interopRequireDefault(_input);

var _api = require("./../api");

var api = _interopRequireWildcard(_api);

require("./task-correspondences.css");

var _reactRouter = require("react-router");

var _pathwayList = require("@react-ag-components/pathway-list");

var _pathwayList2 = _interopRequireDefault(_pathwayList);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _Mail = require("./../Mail");

var _Mail2 = _interopRequireDefault(_Mail);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import Mail from "@react-ag-components/inbox/lib/Mail";

var MailsList = function (_React$Component) {
  _inherits(MailsList, _React$Component);

  function MailsList(props) {
    _classCallCheck(this, MailsList);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref;

          return _ref = {}, _ref[field] = value, _ref;
        });
      };
    };

    _this.getCreatedDateDisplayString = function (millisecs) {
      return _this.formatDateToString(millisecs);
    };

    _this.epochSecondToDate = function (epochSecond) {
      var eps = epochSecond * 1000;
      var m = (0, _moment2.default)(eps);
      var s = m.format("D/M/YYYY hh:mm:ss");
      return s;
    };

    _this.setupMail = function (id, type, subject) {
      _this.setState(function (prevState, props) {
        return {
          messageId: id,
          type: type,
          showMail: true,
          subject: subject,
          totalMessagesCount: _this.state.messageThreads.length
        };
      });

      _this.props.callbackCloseParentTask();
    };

    _this.callbackCloseSelf = function () {
      _this.setState(function (prevState, props) {
        return {
          showMail: false
        };
      });

      _this.props.callbackOpenParentTask();
    };

    _this.callbackSetMessage = function (type, msg) {
      _this.setState(function (prevState, props) {
        var _ref2;

        return _ref2 = {}, _ref2[type] = msg, _ref2;
      });

      _this.props.setMessage(msg);
    };

    _this.readAllCorrespondenceThreads = function () {
      _this.setState({ loading: true });

      if (_this.props.serviceRequestId) {
        api.getAllCorrespondences(_this.props.serviceRequestId).then(function (data) {
          _this.setState({ loading: false, messageThreads: data == null ? [] : data });
        });
      }
    };

    _this.createNewMessageThread = function () {
      if (_this.props.serviceRequestId && _this.state.messageSubject && _this.state.messageText && _this.state.messageSubject.trim().length > 0 && _this.state.messageText.trim().length > 0) {
        var payload = {
          serviceRequestId: _this.props.serviceRequestId,
          subject: _this.state.messageSubject,
          body: _this.state.messageText
        };

        api.createNewCorrespondence(payload).then(function (data) {
          _this.props.callbackShowMessage("success", "New external message  '" + _this.state.messageSubject + "' created");
          _this.props.callbackShowMessage("error", "");

          _this.setState({ messageSubject: "", messageText: "" });
          _this.readAllCorrespondenceThreads();
          var payload = { type: "ADD_NEW_EXTERNAL_MESSAGE" };
          api.performTaskAction(_this.props.taskid, payload);
          window.scrollTo(0, 0);
          _this.refs.messageText.state.value = "";
          _this.refs.messageSubject.state.value = "";
        });
      } else {
        _this.props.callbackShowMessage("error", "Subject and Message are required to create a new external message ");
        _this.props.callbackShowMessage("success", "");
        window.scrollTo(0, 0);
      }
    };

    _this.onClose = function () {
      _this.props.callbackCloseSelf();
      _this.props.callbackSetMessage("success", "");
    };

    _this.state = {
      loading: false,
      messageThreads: _this.props.messageThreads
    };
    _this.serviceRequestId = props.serviceRequestId || null;
    return _this;
  }

  MailsList.prototype.render = function render() {
    var _this2 = this;

    var mailNode = null;

    if (this.state.showMail && this.props.callbackCloseParentTask && this.props.callbackOpenParentTask) {
      mailNode = _react2.default.createElement(_Mail2.default, {
        messageId: this.state.messageId,
        type: this.state.type,
        subject: this.state.subject,
        totalMessagesCount: this.state.totalMessagesCount,
        callbackCloseSelf: this.callbackCloseSelf,
        callbackShowMessage: this.props.callbackShowMessage
      });
    }

    return _react2.default.createElement(
      "div",
      { className: "task-detail" },
      !this.state.showMail && _react2.default.createElement(
        "div",
        { style: { paddingTop: "1em" } },
        _react2.default.createElement(
          "span",
          { style: { fontSize: "1.2em", fontWeight: "bold" }, className: "notesicon" },
          "External Messages ",
          _react2.default.createElement("span", { className: "mail-link" }),
          " ",
          _react2.default.createElement(
            "span",
            null,
            "(",
            this.state.messageThreads && this.state.messageThreads.length,
            ")"
          ),
          " "
        ),
        this.state.messageThreads != null && this.state.messageThreads.length > 0 && _react2.default.createElement(
          "div",
          { className: "  nexdoc-inbox", style: { paddingTop: "1.2em" } },
          _react2.default.createElement(
            "div",
            { className: "inbox" },
            _react2.default.createElement(
              _pathwayList2.default,
              null,
              this.state.messageThreads.map(function (mail) {
                return _react2.default.createElement(
                  "li",
                  { className: "inbox-listing " + (!mail.read ? "unread" : ""), key: mail.corroId + mail.notificationId },
                  _react2.default.createElement("div", { className: "border-unread" }),
                  _react2.default.createElement(
                    _reactRouter.Link,
                    { onClick: _this2.setupMail.bind(null, mail.notificationId, mail.type, mail.description) },
                    _react2.default.createElement(
                      "span",
                      { className: "inbox-date" },
                      _this2.epochSecondToDate(mail.createdTimeStamp.epochSecond)
                    ),
                    _this2.state.attachment && _react2.default.createElement("span", { className: "inbox-attachment" }),
                    _react2.default.createElement(
                      "span",
                      { className: "inbox-from" },
                      mail.fromParty
                    ),
                    _react2.default.createElement(
                      "span",
                      { className: "inbox-subject" },
                      mail.description
                    ),
                    _react2.default.createElement("span", { className: "inbox-body" })
                  )
                );
              })
            )
          )
        ),
        !(this.props.task.state == null || this.props.task.state == "COMPLETED") && _react2.default.createElement(
          "div",
          { className: "uikit-grid" },
          _react2.default.createElement(
            "div",
            { className: "row" },
            _react2.default.createElement(
              "div",
              { className: "col-md-6" },
              _react2.default.createElement(_input2.default, {
                label: "Subject",
                value: this.state.messageSubject,
                onChange: this.onChange("messageSubject"),
                rows: 1,
                multiLine: true,
                maxlength: "300",
                id: "messageSubject",
                ref: "messageSubject"
              }),
              _react2.default.createElement(_input2.default, {
                ref: "messageText",
                label: "Message",
                value: this.state.messageText,
                onChange: this.onChange("messageText"),
                rows: 2,
                multiLine: true,
                maxlength: "10000",
                id: "messageText"
              }),
              _react2.default.createElement(
                "button",
                { className: "uikit-btn uikit-btn--tertiary comment-btn comment-detail-btn", onClick: this.createNewMessageThread },
                "Create"
              )
            ),
            _react2.default.createElement("div", { className: "col-md-6" })
          )
        )
      ),
      this.state.showMail && mailNode
    );
  };

  return MailsList;
}(_react2.default.Component);

exports.default = MailsList;
module.exports = exports["default"];