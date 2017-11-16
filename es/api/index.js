var URL_BASE = (process.env.API_HOST || '') + '/api/';

import { get, post, put, del, formPost } from '@react-ag-components/core/lib/api';

export function fetchUserTasksList() {
      // return get(URL_BASE + 'v1/user/context')
      return get('/task-service-rest/api/taskservice/v1/tasks');
}

export function fetchTaskDetailsById(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks
      return get('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/detail');
}

export function addComment(taskid, comment) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return put('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/comments/add', comment);
}

export function fetchComments(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return get('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/comments');
}

export function performTaskAction(taskid, action) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
      return put('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/action', action);
}

export function performSearchByTitleKeyword(titleSearchKeyword) {

      return get('/task-service-rest/api/taskservice/v1/tasks/search/' + titleSearchKeyword);
}