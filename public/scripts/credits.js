/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function modifyCredit(fields) {
  fetch(`/api/credits/${fields.other_username}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getCredit(fields) {
  fetch(`/api/credits/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
