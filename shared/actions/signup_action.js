import variables from '../../variables';

export const SIGNUPSUCCESS = 'SIGNUPSUCCESS';
export const SIGNUPREQUEST = 'SIGNUPREQUEST';
export const SIGNUPERROR = 'SIGNUPERROR';

const apiURL = variables.url.liveURL;
// sending received response form fetchSignup to reducer
export function handleSignUpSuccess(res) {
  return {
    type: SIGNUPSUCCESS,
    payload: res,
    message: res.message,
  };
}

export function handleSignUpRequest() {
  return {
    type: SIGNUPREQUEST,
    message: 'loading',
  };
}

// to handle error
export function handleSignupError(err) {
  return {
    type: SIGNUPERROR,
    payload: err,
    message: err.message,
  };
}

// sending post request of signup data i.e. email and password to backend
export function fetchSignup(email, password) {
  const res = {
    email,
    password,
  };
  const url = `${apiURL}/api/register`;
  return (dispatch, state) => {
    dispatch(handleSignUpRequest());
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
          if (res.status) {
            return dispatch(handleSignUpSuccess(res));
          }
          return dispatch(handleSignupError(res));
        }
      })
      .catch(err => dispatch(handleSignupError(err)));
  };
}
