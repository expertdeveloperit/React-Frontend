import store from '../redux/configureStore';
import 'fetch-everywhere';
import variables from '../../variables';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export const UPLOADSUCCESS = 'UPLOADSUCCESS';
export const UPLOADREQUEST = 'UPLOADREQUEST';
export const UPLOADERROR = 'UPLOADERROR';

const apiURL = variables.url.localURL;

function uploadSuccess(res) {
  return {
    type: UPLOADSUCCESS,
    payload: res,
    message: 'File Uploaded',
  };
}

function uploadRequest() {
  return {
    type: UPLOADREQUEST,
    message: 'Loading',
  };
}

function uploadError(err) {
  return {
    type: UPLOADERROR,
    payload: err,
    message: err.message,
  };
}

export function imgUpload(path, token_val, id, fromType) {
  return (dispatch, state) => {
    dispatch(uploadRequest());

    fetch(`${apiURL}/api/article/upload/images`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token_val}`,
        enctype: 'multipart/formdata',
        id,
        fromType,
      },
      body: path,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            return dispatch(uploadSuccess(res));
          }
          return dispatch(uploadError(res));
        }
      })
      .catch(error => dispatch(uploadError(error)));
  };
}

export function channelImgUpload(data, token) {
  return (dispatch, state) => {
    fetch(`${apiURL}/api/channelCover`, {
      method: 'put',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token}`,
        enctype: 'multipart/formdata',
      },
      body: data,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            return dispatch(uploadSuccess(res));
          }
          return dispatch(uploadError(res));
        }
      })
      .catch(error => dispatch(uploadError(error)));
  };
}

export function channelVideoUpload(data, token) {
  return (dispatch, state) => {
    fetch(`${apiURL}/api/channelVideo`, {
      method: 'put',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token}`,
        enctype: 'multipart/formdata',
      },
      body: data,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            return dispatch(uploadSuccess(res));
          }
          return dispatch(uploadError(res));
        }
      })
      .catch(error => dispatch(uploadError(error)));
  };
}
