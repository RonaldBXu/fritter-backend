/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllScheduledFreets(fields) {
  fetch('/api/scheduledfreets')
    .then(showResponse)
    .catch(showResponse);
}

function viewScheduledFreetsByAuthor(fields) {
  fetch(`/api/scheduledfreets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createScheduledFreet(fields) {
  fetch('/api/scheduledfreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editScheduledFreet(fields) {
  fetch(`/api/scheduledfreets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteScheduledFreet(fields) {
  fetch(`/api/scheduledfreets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
