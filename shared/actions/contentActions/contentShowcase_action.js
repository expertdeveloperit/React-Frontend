import variables from '../../../variables';

export const CONTENTSUCCESS = 'CONTENTSUCCESS';
export const CONTENTREQUEST = 'CONTENTREQUEST';
export const CONTENTERROR = 'CONTENTERROR';

const apiURL = variables.url.localURL;

function contentDataSuccess(res) {
  return {
    type: CONTENTSUCCESS,
    payload: res,
    message: res.message,
  };
}

function contentDataRequest() {
  return {
    type: CONTENTREQUEST,
    message: 'Loading Data',
  };
}

function contentDataError(err) {
  return {
    type: CONTENTERROR,
    payload: err,
    message: err.error,
  };
}

export function getContentData(id) {
  return (dispatch, state) => {
    dispatch(contentDataRequest());
    fetch(`${apiURL}/api/article/${id}`, {
      method: 'get',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            return dispatch(contentDataSuccess(res));
          }
          return dispatch(contentDataError(res));
        }
      })
      .catch(err => dispatch(contentDataError(err)));
  };
}
