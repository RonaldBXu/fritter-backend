/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFreetCooldown(fields) {
  fetch(`/api/cooldowns/${fields.freetId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function getCooldown(fields) {
  fetch(`/api/cooldowns/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
}
