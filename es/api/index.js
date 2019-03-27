var URL_BASE_ORIG = (process.env.API_HOST || "") + URL_BASE + "/api/";

var DEV_URL_BASE = "http://act001appd0001.devagdaff.gov.au:9001";

var URL_BASE = DEV_URL_BASE;

import { get, post, put } from "@react-ag-components/core/lib/api";

export function fetchUserTasksList(state) {
  // return get(URL_BASE + 'v1/user/context')
  if (state && state.trim().length > 0 && state === "ASSIGNEDTOME") {
    return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/ASSIGNED/assignedtome");
  } else if (state && state.trim().length > 0) {
    return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/" + state);
  } else {
    return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks");
  }
}

export function fetchTaskDetailsById(taskid) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks
  return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/detail");
}

export function fetchAttachmentsByServiceId(serviceRequestId) {
  return get(URL_BASE + "/service-request-data-service-rs-ui/api/v1/servicerequest/attachments/" + serviceRequestId);
}

export function addComment(taskid, comment) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return put(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/comments/add", comment);
}

export function fetchComments(taskid) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/comments");
}

export function performTaskAction(taskid, action) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return put(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/action", action);
}

var returnVal = function returnVal() {
  [{ steve: "steve" }];
};

export function performSearchByTitleKeyword(titleSearchKeyword, state) {
  console.log("here");
  console.log(returnVal);
  return new Promise(returnVal);
  // console.log(process.env.API_HOST);
  // console.log(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/search/" + titleSearchKeyword + URL_BASE + "/state/" + state);
  //return get("http://act001appd0001.devagdaff.gov.au:9001/task-service-rest/api/taskservice/v1/tasks/search/" + titleSearchKeyword + URL_BASE + "/state/" + state);
}

export function getTasksAssignedToMe(state) {
  return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/" + state + URL_BASE + "/assignedtome");
  //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
}

// export function getTasksBySearch(payload) {
//        return get('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//       //return put('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//        //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
// }

export function getTasksBySearch(taskState, searchType, searchKey) {
  return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/search/type/" + searchType + URL_BASE + "/key/" + searchKey);
}

export function getTasksByQuickLink(quickLinkType) {
  return get(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/quicklink/" + quickLinkType);
}

export function createNewCorrespondence(payload) {
  return post(URL_BASE + "/message-rest-ui/api/v1/mail/task/new", payload);
}

export function getAllCorrespondences(serviceRequestId) {
  return get(URL_BASE + "/service-request-data-service-rs-ui/api/v1/servicerequest/correspondence/" + serviceRequestId);
}

export function fetchEmployeesByGroupName(groupName) {
  // return get(URL_BASE + 'v1/user/context')
  //if(groupName && groupName.trim().length>0){
  return get(URL_BASE + "/task-service-rest/api/identityservice/internal/v1/groupname/" + groupName + URL_BASE + "/employees");
  //}
}

//mail
var URL_BASE2 = URL_BASE + "/message-rest-ui/api/";
var URL_BASE3 = URL_BASE + "/inbox-rest-ui/api/";

export function getMail(id) {
  return get(URL_BASE2 + "v1/mail/thread/" + id);
}
export function getArchived() {
  return get(URL_BASE2 + "v1/mail/archive");
}
export function getMails() {
  return get(URL_BASE3 + "v1/all");
}
export function getUnreadCount() {
  return get(URL_BASE3 + "v1/all/count");
}
export function getMailFromAll(id) {
  return get(URL_BASE3 + "v1/notification/" + id);
}
export function setArchive(statusBody) {
  return put(URL_BASE2 + "v1/mail/archive/status", statusBody);
}
export function sendMail(mail) {
  return post(URL_BASE2 + "v1/mail/reply", mail);
}
//send it one by one and create the array output at the end
export function sendFile(file) {
  return post(URL_BASE2 + "v1/mail/new/attachments", file);
}
export function getMailAttachment(id) {
  return get(URL_BASE2 + "v1/mail/attachment/download/" + id);
}