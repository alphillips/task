const URL_BASE = (process.env.API_HOST || '') + '/api/'

import {get, post, put, del, formPost} from '@react-ag-components/core/lib/api'


export function fetchUserTasksList() {
      // return get(URL_BASE + 'v1/user/context')
       return get('/task-service-rest/api/taskservice/v1/tasks')
}

export function fetchTaskDetailsById(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks
       return get('/task-service-rest/api/taskservice/v1/tasks/'+taskid+'/detail')
}

export function addComment(taskid,comment) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
       return put('/task-service-rest/api/taskservice/v1/tasks/'+taskid+'/comments/add', comment)
}


export function fetchComments(taskid) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
       return get('/task-service-rest/api/taskservice/v1/tasks/'+taskid+'/comments')
}

export function performTaskAction(taskid, action) {
      // return get(URL_BASE + 'v1/user/context')
      // /task-service-rest/api/taskservice/v1/tasks comments/add
       return put('/task-service-rest/api/taskservice/v1/tasks/'+taskid+'/action', action)
}

export function performSearchByTitleKeyword(titleSearchKeyword) {

       return get('/task-service-rest/api/taskservice/v1/tasks/search/'+titleSearchKeyword)
}


export function createNewCorrespondence(payload) {
       return post('/message-rest-ui/api/v1/mail/task/new', payload);
}

export function getAllCorrespondences(serviceRequestId) {
       return get('/service-request-data-service-rs-ui/api/v1/servicerequest/correspondence/'+serviceRequestId)
}


//mail
const URL_BASE2 = '/message-rest-ui/api/'
const URL_BASE3 = '/inbox-rest-ui/api/'

export function getMail(id){
  return get(URL_BASE2 + 'v1/mail/thread/' + id)
}
export function getArchived(){
  return get(URL_BASE2 + 'v1/mail/archive')
}
export function getMails(){
  return get(URL_BASE3 + 'v1/all')
}
export function getUnreadCount(){
  return get(URL_BASE3 + 'v1/all/count')
}
export function getMailFromAll(id){
  return get(URL_BASE3 + 'v1/notification/' + id)
}
export function setArchive(statusBody){
  return put(URL_BASE2 + 'v1/mail/archive/status', statusBody)
}
export function sendMail(mail){
  return post(URL_BASE2 + 'v1/mail/reply', mail)
}
//send it one by one and create the array output at the end
export function sendFile(file){
  return post(URL_BASE2 + 'v1/mail/new/attachments', file)
}
export function getMailAttachment(id){
  return get(URL_BASE2 + 'v1/mail/attachment/download/' + id)
}
