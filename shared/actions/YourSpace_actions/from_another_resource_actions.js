export const ERROR_RELATED_ARTICLE = 'ERROR_RELATED_ARTICLE';
export const REQUEST_RELATED_ARTICLE = 'REQUEST_RELATED_ARTICLE';
export const SUCCESS_RELATED_ARTICLE = 'SUCCESS_RELATED_ARTICLE';

import variables from '../../../variables';

const apiURL = variables.url.localURL;

function success(res) {
  return {
    type: SUCCESS_RELATED_ARTICLE,
    payload: res,
    message: res.message,
  };
}

function request() {
  return {
    type: REQUEST_RELATED_ARTICLE,
    message: 'Loading Data',
  };
}

function error(err) {
  return {
    type: ERROR_RELATED_ARTICLE,
    payload: err,
    message: err.error,
  };
}

export function downloadSelected(token_val, url) {
  return (dispatch, state) => {
    dispatch(request());
    fetch(`${apiURL}/api/otherArticle/download`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token_val}`,
      },
      body: JSON.stringify({
        url,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            return dispatch(success(res));
          }
          return dispatch(error(res));
        }
      })
      .catch(err => dispatch(error(err)));
  };
}
