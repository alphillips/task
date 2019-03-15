"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _api = require("./../api");

var api = _interopRequireWildcard(_api);

var _reactRouter = require("react-router");

var _reactDropzone = require("react-dropzone");

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _messages = require("@react-ag-components/messages");

var _messages2 = _interopRequireDefault(_messages);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _Paper = require("material-ui/Paper");

var _Paper2 = _interopRequireDefault(_Paper);

require("./mail.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import "@react-ag-component/lib/Inbox/mail.css";

var Mail = function (_React$Component) {
  _inherits(Mail, _React$Component);

  function Mail(props) {
    _classCallCheck(this, Mail);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleReplyState = function () {
      _this.setState(function (prevState, props) {
        return {
          replyState: !_this.state.replyState,
          showAttach: false
        };
      });
      _this.clearAttachment();
      _this.clearReplyContent();
    };

    _this.handleReplyContent = function (event) {
      _this.setState({ html: event.target.value });
    };

    _this.handleShowAttach = function () {
      _this.setState(function (prevState, props) {
        return {
          showAttach: !_this.state.showAttach
        };
      });
      if (!_this.state.showAttach) {
        _this.clearAttachment();
      }
    };

    _this.handleSend = function () {

      //check if message is keyed in
      if (!_this.state.html || _this.state.html.trim().length == 0) {
        _this.setState({ error: "Please key in a text to send " });
        //   this.props.callbackCloseSelf();
        return;
      }

      var reply = {};

      reply.subject = _this.state.subject.indexOf("Re:") > -1 ? _this.state.subject : "Re: " + _this.state.subject;
      reply.body = _this.state.html;
      reply.linkedAttachment = _this.state.files;
      reply.parentId = _this.state.id;

      api.sendMail(reply).then(function (data) {
        _this.props.callbackShowMessage("success", "Message " + '"' + _this.state.subject + '"' + " has been sent"), _this.props.callbackCloseSelf();
      });
    };

    _this.clearAttachment = function () {
      _this.setState(function (prevState, props) {
        return {
          files: []
        };
      });
    };

    _this.clearReplyContent = function () {
      _this.setState({ html: "" });
    };

    _this.handleArchive = function (e) {
      var statusBody = {};
      statusBody.messageId = _this.state.id;
      statusBody.archived = true;
      api.setArchive(statusBody).then(function (data) {
        _this.props.callbackShowMessage("success", "Message " + '"' + _this.state.mails[0].subject + '"' + " has been archived");
        _this.props.callbackCloseSelf();
      }).catch(function (error) {
        console.log(error + " with archiving mail");
      });
    };

    _this.handleRestore = function (e) {
      var statusBody = {};
      statusBody.messageId = _this.state.id;
      statusBody.archived = false;
      api.setArchive(statusBody).then(function (data) {
        _this.props.callbackShowMessage("success", "Message " + '"' + _this.state.mails[0].subject + '"' + " has been unarchived");
        _this.props.callbackCloseSelf();
      }).catch(function (error) {
        console.log(error + " with restoring mail");
      });
    };

    _this.onDrop = function (files) {
      files.forEach(function (file) {
        var reader = new FileReader();
        var fileObj = {};
        reader.readAsDataURL(file);
        reader.onload = function () {
          fileObj.name = file.name;
          fileObj.mimeType = file.type;
          fileObj.size = _this.bytesToSize(file.size);
          fileObj.data = unescape(encodeURIComponent(reader.result.split(",")[1]));
          var thisStateFiles = _this.state.files;
          thisStateFiles.push(fileObj);
          _this.setState(function (prevState, props) {
            return {
              files: thisStateFiles
            };
          });
        };
      });
    };

    _this.removeFile = function (e) {
      var array = _this.state.files;
      var index = e.target.getAttribute("data-value");
      array.splice(index, 1);
      _this.setState(function (prevState, props) {
        return {
          files: array
        };
      });
    };

    _this.downloadFile = function (id) {
      api.getMailAttachment(id).then(function (data) {
        var fileHeader = "data:" + data.mimeType + ";base64,";

        var fileData = "";

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // IE workaround
          var byteCharacters = atob(data.data);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: data.mineType });
          window.navigator.msSaveOrOpenBlob(blob, data.name);
        } else {
          // much easier if not IE
          fileData = fileHeader + data.data;
        }

        var dlnk = document.getElementById("downloadLink" + id);
        dlnk.href = fileData;
        dlnk.click();
      });
    };

    _this.bytesToSize = function (bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    };

    _this.epochSecondToDate = function (epochSecond) {
      var eps = epochSecond * 1000;
      var m = (0, _moment2.default)(eps);
      var s = m.format("D/M/YYYY hh:mm:ss");
      return s;
    };

    _this.onClose = function (e) {
      e.preventDefault();
      _this.props.callbackCloseSelf();
      _this.props.callbackShowMessage("success", "");
    };

    _this.state = {
      mails: [],
      success: props.success,
      error: props.error,
      id: -1,
      messageId: props.messageId || -1,
      type: props.type || "MESSAGE",
      reply: "",
      replyState: false,
      showAttach: false,
      html: "",
      subject: "",
      user: null,
      files: [],
      read: false,
      archived: false,
      info: ""
    };
    _this.replies = [];
    _this.handleReplyContent = _this.handleReplyContent.bind(_this);
    return _this;
  }

  Mail.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var expiryDate = "31/01/2018";
    this.setState(function (prevState, props) {
      return {
        info: "This notification will expire on " + expiryDate + "."
      };
    });

    if (this.state.type === "MESSAGE") {
      api.getMail(this.state.messageId).then(function (data) {
        var threadMessage = data.linkedMessage;
        threadMessage.push(data);
        _this2.setState(function (prevState, props) {
          return {
            mails: threadMessage,
            read: data.read,
            archived: data.archived,
            id: data.messageId,
            subject: data.subject
          };
        });

        if (!_this2.state.read) {
          var statusBody = {};
          statusBody.messageId = _this2.state.id;
          statusBody.status = true;
        }
      });
    } else {
      api.getMailFromAll(this.state.messageId).then(function (data) {
        var threadMessage = [];
        threadMessage.push(data);
        _this2.setState(function (prevState, props) {
          return {
            mails: threadMessage,
            read: data.read,
            archived: data.archived,
            id: data.messageId,
            subject: data.subject
          };
        });

        if (!_this2.state.read) {
          var statusBody = {};
          statusBody.messageId = _this2.state.id;
          statusBody.status = true;
        }
      });
    }
  };

  Mail.prototype.render = function render() {
    var _this3 = this,
        _React$createElement2;

    return _react2.default.createElement(
      "div",
      { className: "mail-wrapper" },
      _react2.default.createElement(_messages2.default, { success: this.state.success, error: this.state.error }),
      _react2.default.createElement(
        "a",
        { className: "back-button uikit-direction-link uikit-direction-link--left",
          onClick: this.onClose,
          href: "#" },
        " ",
        "  Back",
        " "
      ),
      _react2.default.createElement(
        "div",
        { style: { 'padding-top': '1em' } },
        _react2.default.createElement(
          "span",
          { style: { 'fontSize': '1.2em', 'fontWeight': 'bold' } },
          this.props.subject
        )
      ),
      _react2.default.createElement(
        "div",
        (_React$createElement2 = {
          className: ""
        }, _React$createElement2["className"] = this.state.replyState ? "nexdoc-mail-container reply" : "nexdoc-mail-container", _React$createElement2),
        _react2.default.createElement(
          "div",
          { className: "nexdoc-mail" },
          _react2.default.createElement(
            _Paper2.default,
            { zDepth: 1 },
            _react2.default.createElement("textarea", {
              value: this.state.html,
              onChange: this.handleReplyContent,
              className: this.state.replyState ? "reply-area reply" : "reply-area"
            })
          ),
          this.state.showAttach && _react2.default.createElement(
            _Paper2.default,
            { zDepth: 1 },
            _react2.default.createElement(
              "div",
              null,
              _react2.default.createElement(
                _reactDropzone2.default,
                {
                  onDrop: this.onDrop.bind(this),
                  className: "file-drop-zone"
                },
                this.state.name ? _react2.default.createElement(
                  "p",
                  null,
                  "File ",
                  _react2.default.createElement(
                    "strong",
                    null,
                    this.state.name
                  ),
                  " selected"
                ) : _react2.default.createElement(
                  "p",
                  null,
                  "Select or drag and drop a file"
                )
              ),
              this.state.files.length > 0 && _react2.default.createElement(
                "aside",
                { className: "attach-files" },
                _react2.default.createElement(
                  "h2",
                  null,
                  "Attaching files"
                ),
                _react2.default.createElement(
                  "ul",
                  null,
                  this.state.files.map(function (f, i) {
                    var _React$createElement;

                    return _react2.default.createElement(
                      "li",
                      (_React$createElement = {
                        key: f.name + f.size,
                        "data-value": i,
                        onClick: _this3.removeFile.bind(_this3)
                      }, _React$createElement["key"] = f.name, _React$createElement),
                      f.name,
                      " - ",
                      f.size
                    );
                  })
                )
              )
            )
          ),
          this.state.mails && this.state.mails.map(function (reply) {
            return _react2.default.createElement(
              _Paper2.default,
              { zDepth: 1 },
              _react2.default.createElement(
                "div",
                { key: reply.messageId, style: { backgroundColor: '#fafafa' } },
                _react2.default.createElement(
                  "div",
                  { className: "mail-from" },
                  "From: ",
                  _react2.default.createElement(
                    "span",
                    { className: "text-normal" },
                    reply.fromParty
                  ),
                  !_this3.state.replyState && _react2.default.createElement(
                    "div",
                    null,
                    _this3.state.type === "MESSAGE" && _react2.default.createElement(
                      "div",
                      null,
                      !_this3.state.archived && _react2.default.createElement(
                        "button",
                        {
                          className: "btn-reply-action reply",
                          onClick: _this3.handleReplyState
                        },
                        "Reply"
                      ),
                      !_this3.state.archived && _react2.default.createElement(
                        "button",
                        {
                          className: "btn-archive",
                          onClick: _this3.handleArchive
                        },
                        "Archive"
                      ),
                      _this3.state.archived && _react2.default.createElement(
                        "button",
                        {
                          className: "btn-unarchive",
                          onClick: _this3.handleRestore
                        },
                        "Unarchive"
                      )
                    )
                  ),
                  _this3.state.replyState && _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement(
                      "button",
                      {
                        className: "btn-reply-action discard",
                        onClick: _this3.handleReplyState
                      },
                      "Discard"
                    ),
                    _react2.default.createElement(
                      "button",
                      {
                        className: "btn-reply-action send",
                        onClick: _this3.handleSend
                      },
                      "Send"
                    ),
                    _react2.default.createElement(
                      "button",
                      {
                        className: "btn-reply-action attach",
                        onClick: _this3.handleShowAttach
                      },
                      !_this3.state.showAttach ? "Attach" : "Remove"
                    )
                  )
                ),
                _react2.default.createElement(
                  "div",
                  { className: "mail-subject-container" },
                  _react2.default.createElement(
                    "span",
                    { className: "mail-subject" },
                    "Subject:",
                    " ",
                    _react2.default.createElement(
                      "span",
                      { className: "text-normal" },
                      reply.subject
                    )
                  ),
                  _react2.default.createElement(
                    "span",
                    { className: "mail-date" },
                    "Sent:",
                    " ",
                    _react2.default.createElement(
                      "span",
                      { className: "text-normal" },
                      _this3.epochSecondToDate(reply.messageTimestamp.epochSecond)
                    )
                  ),
                  _this3.state.type !== "MESSAGE" && _react2.default.createElement(
                    "span",
                    { className: "mail-date" },
                    "Notice:",
                    " ",
                    _react2.default.createElement(
                      "span",
                      { className: "text-normal" },
                      _this3.state.info
                    )
                  ),
                  _this3.state.type === "MESSAGE" && reply.linkedAttachment && _react2.default.createElement(
                    "span",
                    { className: "mail-date" },
                    "Attachment:",
                    _react2.default.createElement(
                      "span",
                      { className: "text-normal" },
                      reply.linkedAttachment.map(function (file, i) {
                        return _react2.default.createElement(
                          "div",
                          { key: file.externalRefId },
                          _react2.default.createElement("a", {
                            id: "downloadLink" + file.externalRefId,
                            download: file.name
                          }),
                          _react2.default.createElement(
                            _reactRouter.Link,
                            {
                              className: "mail-attachment",
                              onClick: _this3.downloadFile.bind(_this3, file.externalRefId)
                            },
                            " ",
                            file.name,
                            " ",
                            "(",
                            file.size,
                            ")",
                            " "
                          )
                        );
                      })
                    )
                  )
                ),
                _react2.default.createElement(
                  "div",
                  { className: "mail-body-container" },
                  _react2.default.createElement("span", {
                    className: "mail-body",
                    dangerouslySetInnerHTML: { __html: reply.body }
                  })
                )
              )
            );
          })
        )
      )
    );
  };

  return Mail;
}(_react2.default.Component);

exports.default = Mail;
module.exports = exports["default"];