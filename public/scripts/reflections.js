/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function editReflection(fields) {
  fetch(`/api/reflections/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getUserReflections(fields) {
  fetch(`/api/reflections?id=${fields.id}?public=${fields.public}`)
    .then(showResponse)
    .catch(showResponse);
}

function createReflection(fields) {
  fetch('/api/reflections', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
