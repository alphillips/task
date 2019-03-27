"use strict";

exports.__esModule = true;
exports.fetchUserTasksList = fetchUserTasksList;
exports.fetchTaskDetailsById = fetchTaskDetailsById;
exports.fetchAttachmentsByServiceId = fetchAttachmentsByServiceId;
exports.addComment = addComment;
exports.fetchComments = fetchComments;
exports.performTaskAction = performTaskAction;
exports.performSearchByTitleKeyword = performSearchByTitleKeyword;
exports.getTasksAssignedToMe = getTasksAssignedToMe;
exports.getTasksBySearch = getTasksBySearch;
exports.getTasksByQuickLink = getTasksByQuickLink;
exports.createNewCorrespondence = createNewCorrespondence;
exports.getAllCorrespondences = getAllCorrespondences;
exports.fetchEmployeesByGroupName = fetchEmployeesByGroupName;
exports.getMail = getMail;
exports.getArchived = getArchived;
exports.getMails = getMails;
exports.getUnreadCount = getUnreadCount;
exports.getMailFromAll = getMailFromAll;
exports.setArchive = setArchive;
exports.sendMail = sendMail;
exports.sendFile = sendFile;
exports.getMailAttachment = getMailAttachment;

var _api = require("@react-ag-components/core/lib/api");

var URL_BASE_ORIG = (process.env.API_HOST || "") + URL_BASE + "/api/";

var DEV_URL_BASE = "http://act001appd0001.devagdaff.gov.au:9001";

var URL_BASE = DEV_URL_BASE;

function fetchUserTasksList(state) {
  // return get(URL_BASE + 'v1/user/context')
  if (state && state.trim().length > 0 && state === "ASSIGNEDTOME") {
    return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/ASSIGNED/assignedtome");
  } else if (state && state.trim().length > 0) {
    return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/" + state);
  } else {
    return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks");
  }
}

function fetchTaskDetailsById(taskid) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/detail");
}

function fetchAttachmentsByServiceId(serviceRequestId) {
  return (0, _api.get)(URL_BASE + "/service-request-data-service-rs-ui/api/v1/servicerequest/attachments/" + serviceRequestId);
}

function addComment(taskid, comment) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return (0, _api.put)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/comments/add", comment);
}

function fetchComments(taskid) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/comments");
}

function performTaskAction(taskid, action) {
  // return get(URL_BASE + 'v1/user/context')
  // /task-service-rest/api/taskservice/v1/tasks comments/add
  return (0, _api.put)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/" + taskid + URL_BASE + "/action", action);
}

var returnVal = function returnVal() {
  [{ steve: "steve" }];
};

function performSearchByTitleKeyword(titleSearchKeyword, state) {
  console.log("here");
  console.log(returnVal);
  return new Promise(returnVal);
  // console.log(process.env.API_HOST);
  // console.log(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/search/" + titleSearchKeyword + URL_BASE + "/state/" + state);
  //return get("http://act001appd0001.devagdaff.gov.au:9001/task-service-rest/api/taskservice/v1/tasks/search/" + titleSearchKeyword + URL_BASE + "/state/" + state);
}

function getTasksAssignedToMe(state) {
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/state/" + state + URL_BASE + "/assignedtome");
  //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
}

// export function getTasksBySearch(payload) {
//        return get('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//       //return put('/task-service-rest/api/taskservice/v1/tasks/search', payload);
//        //return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword+'/state/'+state)
// }

function getTasksBySearch(taskState, searchType, searchKey) {
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/search/type/" + searchType + URL_BASE + "/key/" + searchKey);
}

function getTasksByQuickLink(quickLinkType) {
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/taskservice/v1/tasks/quicklink/" + quickLinkType);
}

function createNewCorrespondence(payload) {
  return (0, _api.post)(URL_BASE + "/message-rest-ui/api/v1/mail/task/new", payload);
}

function getAllCorrespondences(serviceRequestId) {
  return (0, _api.get)(URL_BASE + "/service-request-data-service-rs-ui/api/v1/servicerequest/correspondence/" + serviceRequestId);
}

function fetchEmployeesByGroupName(groupName) {
  // return get(URL_BASE + 'v1/user/context')
  //if(groupName && groupName.trim().length>0){
  return (0, _api.get)(URL_BASE + "/task-service-rest/api/identityservice/internal/v1/groupname/" + groupName + URL_BASE + "/employees");
  //}
}

//mail
var URL_BASE2 = URL_BASE + "/message-rest-ui/api/";
var URL_BASE3 = URL_BASE + "/inbox-rest-ui/api/";

function getMail(id) {
  return (0, _api.get)(URL_BASE2 + "v1/mail/thread/" + id);
}
function getArchived() {
  return (0, _api.get)(URL_BASE2 + "v1/mail/archive");
}
function getMails() {
  return (0, _api.get)(URL_BASE3 + "v1/all");
}
function getUnreadCount() {
  return (0, _api.get)(URL_BASE3 + "v1/all/count");
}
function getMailFromAll(id) {
  return (0, _api.get)(URL_BASE3 + "v1/notification/" + id);
}
function setArchive(statusBody) {
  return (0, _api.put)(URL_BASE2 + "v1/mail/archive/status", statusBody);
}
function sendMail(mail) {
  return (0, _api.post)(URL_BASE2 + "v1/mail/reply", mail);
}
//send it one by one and create the array output at the end
function sendFile(file) {
  return (0, _api.post)(URL_BASE2 + "v1/mail/new/attachments", file);
}
function getMailAttachment(id) {
  return (0, _api.get)(URL_BASE2 + "v1/mail/attachment/download/" + id);
}