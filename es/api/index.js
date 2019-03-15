var URL_BASE = (process.env.API_HOST || '') + '/api/';

import { get, post, put, del, formPost } from '@react-ag-components/core/lib/api';

export function fetchUserTasksList(state) {
  // return get(URL_BASE + 'v1/user/context')
  if (state && state.trim().length > 0 && state === "ASSIGNEDTOME") {
    return get('/task-service-rest/api/taskservice/v1/tasks/state/ASSIGNED/assignedtome');
  } else if (state && state.trim().length > 0) {
    return get('/task-service-rest/api/taskservice/v1/tasks/state/' + state);
  } else {
    return get('/task-service-rest/api/taskservice/v1/tasks');
  }
}

export function fetchTaskDetailsById(taskid) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks
  return get('/task-service-rest/api/taskservice/v1/tasks/' + taskid + '/detail');
}

export function fetchAttachmentsByServiceId(serviceRequestId) {
  return get('/service-request-data-service-rs-ui/api/v1/servicerequest/attachments/' + serviceRequestId);
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

export function performSearchByTitleKeyword(titleSearchKeyword, state) {

  return get('/task-service-rest/api/taskservice/v1/tasks/search/' + titleSearchKeyword + '/state/' + state);
}

export function getTasksAssignedToMe(state) {
  return get('/task-service-rest/api/taskservice/v1/tasks/state/' + state + '/assignedtome');
  //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
}

// export function getTasksBySearch(payload) {
//        return get('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//       //return put('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//        //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
// }

export function getTasksBySearch(taskState, searchType, searchKey) {
  return get('/task-service-rest/api/taskservice/v1/tasks/search/type/' + searchType + '/key/' + searchKey);
}

export function getTasksByQuickLink(quickLinkType) {
  return get('/task-service-rest/api/taskservice/v1/tasks/quicklink/' + quickLinkType);
}

export function createNewCorrespondence(payload) {
  return post('/message-rest-ui/api/v1/mail/task/new', payload);
}

export function getAllCorrespondences(serviceRequestId) {
  return get('/service-request-data-service-rs-ui/api/v1/servicerequest/correspondence/' + serviceRequestId);
}

export function fetchEmployeesByGroupName(groupName) {
  // return get(URL_BASE + 'v1/user/context')
  //if(groupName && groupName.trim().length>0){
  return get('/task-service-rest/api/identityservice/internal/v1/groupname/' + groupName + '/employees');
  //}
}

//mail
var URL_BASE2 = '/message-rest-ui/api/';
var URL_BASE3 = '/inbox-rest-ui/api/';

export function getMail(id) {
  return get(URL_BASE2 + 'v1/mail/thread/' + id);
}
export function getArchived() {
  return get(URL_BASE2 + 'v1/mail/archive');
}
export function getMails() {
  return get(URL_BASE3 + 'v1/all');
}
export function getUnreadCount() {
  return get(URL_BASE3 + 'v1/all/count');
}
export function getMailFromAll(id) {
  return get(URL_BASE3 + 'v1/notification/' + id);
}
export function setArchive(statusBody) {
  return put(URL_BASE2 + 'v1/mail/archive/status', statusBody);
}
export function sendMail(mail) {
  return post(URL_BASE2 + 'v1/mail/reply', mail);
}
//send it one by one and create the array output at the end
export function sendFile(file) {
  return post(URL_BASE2 + 'v1/mail/new/attachments', file);
}
export function getMailAttachment(id) {
  return get(URL_BASE2 + 'v1/mail/attachment/download/' + id);
}