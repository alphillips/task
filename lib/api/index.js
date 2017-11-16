'use strict';

exports.__esModule = true;
exports.fetchUserTasksList = fetchUserTasksList;
exports.fetchTaskDetailsById = fetchTaskDetailsById;
exports.addComment = addComment;
exports.fetchComments = fetchComments;
exports.performTaskAction = performTaskAction;
exports.performSearchByTitleKeyword = performSearchByTitleKeyword;

var _api = require('@react-ag-components/core/lib/api');

var URL_BASE = (process.env.API_HOST || '') + '/api/';

function fetchUserTasksList() {
      // return get(URL_BASE + 'v1/user/context')
      return (0, _api.get)('/task-service-rest/api/taskservice/v1/tasks');
}

function fetchTaskDetailsById(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks
      return (0, _api.get)('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/detail');
}

function addComment(taskid, comment) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return (0, _api.put)('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/comments/add', comment);
}

function fetchComments(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return (0, _api.get)('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/comments');
}

function performTaskAction(taskid, action) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return (0, _api.put)('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/action', action);
}

function performSearchByTitleKeyword(titleSearchKeyword) {

      return (0, _api.get)('/task-service-rest/api/taskservice/v1/tasks/search/' + titleSearchKeyword);
}