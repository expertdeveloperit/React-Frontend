export const LOGIN = 'LOGIN';
export const FORGETPASSWORD = 'FORGETPASSWORD';
export const ERROR = 'ERROR';
import variables from '../../variables';

const apiURL = variables.url.localURL;
// sending received response from backend to reducer function
export function handleLogin(res) {
  return {
    type: LOGIN,
    payload: res,
  };
}

// to handle error recieved
export function handleLoginError(err) {
  return {
    type: ERROR,
    message: err,
  };
}

// sending post request to backend for login request
export function fetchLogin(email, password, params) {
  const res = {
    email,
    password,
  };
  let url;
  if (params == undefined) {
    url = `${apiURL}/api/login`;
  } else {
    url = `${apiURL}/api/login/${params}`;
  }
  // const url = `${apiURL}/api/login`;
  return (dispatch, state) =>
    fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json , text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(res),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          return dispatch(handleLogin(res));
        }
        return dispatch(handleLoginError(res));
      })
      .catch(err => dispatch(handleLoginError(res)));
}

// sending forgetpassword data to reducer
export function handleForgetPassword(res) {
  return {
    type: FORGETPASSWORD,
    payload: res,
  };
}

// sending post request to handle forget password request
export function fetchForgetPassword(email) {
  const res = {
    email,
  };
  return (dispatch, state) =>
    fetch(`${apiURL}/api/forgot_password`, {
      method: 'post',
      headers: {
        Accept: 'application/json , text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(res),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          return dispatch(handleForgetPassword(res));
        }
        return dispatch(handleLoginError(res));
      })
      .catch(err => dispatch(handleLoginError(res)));
}

// sending post request to reset password
export function resetPassword(newPassword, verifyPassword, params) {
  const res = {
    newPassword,
    verifyPassword,
  };
  return (dispatch, state) =>
    fetch(`${apiURL}/api/reset_password/${params}`, {
      method: 'post',
      headers: {
        Accept: 'application/json , text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(res),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          return dispatch(handleForgetPassword(res));
        }
        return dispatch(handleLoginError(res));
      })
      .catch(err => dispatch(handleLoginError(res)));
}
