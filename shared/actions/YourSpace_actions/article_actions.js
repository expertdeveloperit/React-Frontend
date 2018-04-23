export const ERROR_ARTICLE = 'ERROR_ARTICLE';
export const REQUEST_ARTICLE = 'REQUEST_ARTICLE';
export const SUCCESS_ARTICLE = 'SUCCESS_ARTICLE';
export const DRAFTSUCCESS = 'DRAFTSUCCESS';
export const DRAFTERROR = 'DRAFTERROR';

import variables from '../../../variables';

const apiURL = variables.url.localURL;

function articleRequest(from) {
  return {
    type: REQUEST_ARTICLE,
    from,
    message: 'Loading',
  };
}

function articleSuccess(res, from) {
  return {
    type: SUCCESS_ARTICLE,
    payload: res,
    from,
    message: 'Success',
  };
}

function articleError(err, from) {
  console.log('articleError', err);
  return {
    type: ERROR_ARTICLE,
    payload: err,
    from,
    message: err.message,
  };
}
function draftSuccess(res) {
  return {
    type: DRAFTSUCCESS,
    payload: res,
    message: 'Data Recieved',
  };
}

function draftError(err) {
  return {
    type: DRAFTERROR,
    payload: err,
    message: err.message,
  };
}

export function getAllDrafts(token, pageno) {
  return (dispatch, state) => {
    dispatch(articleRequest('get_drafts'));
    fetch(`${apiURL}/api/drafts/${pageno}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) {
            return dispatch(articleSuccess(res, 'get_drafts'));
          }
          return dispatch(articleError(res, 'get_drafts'));
        }
      })
      .catch(err => dispatch(articleError(err, 'get_drafts')));
  };
}

export function saveNewDraft(
  token,
  main_title,
  draft_title,
  published_channel,
  content_type,
  quick_category,
  content_description,
  article_data,
  featuring_image,
  featuring_data,
  creation_time,
) {
  return (dispatch, state) => {
    dispatch(articleRequest('save_drafts'));
    fetch(`${apiURL}/api/articles/draft`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        main_title,
        draft_title,
        published_channel,
        content_type,
        quick_category,
        content_description,
        article_data,
        featuring_image,
        featuring_data,
        creation_time,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) return dispatch(articleSuccess(res, 'save_drafts'));
        }
        return dispatch(articleError(res, 'save_drafts'));
      })
      .catch(err => dispatch(articleError(err, 'save_drafts')));
  };
}

export function publishArticle(
  token,
  draft_id,
  main_title,
  published_channel,
  content_type,
  quick_category,
  content_description,
  article_data,
  featuring_image,
  featuring_data,
  published_time,
) {
  return (dispatch, state) => {
    dispatch(articleRequest('publish_article'));
    fetch(`${apiURL}/api/articles/publish`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        draft_id,
        main_title,
        published_channel,
        content_type,
        quick_category,
        content_description,
        article_data,
        featuring_image,
        featuring_data,
        published_time,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) {
            return dispatch(articleSuccess(res, 'publish_article'));
          }
        }
        return dispatch(articleError(res, 'publish_article'));
      })
      .catch(err => dispatch(articleError(err, 'publish_article')));
  };
}

export function overrideDraft(
  token,
  main_title,
  draft_title,
  draft_id,
  published_channel,
  content_type,
  quick_category,
  content_description,
  article_data,
  featuring_image,
  featuring_data,
  creation_time,
) {
  return (dispatch, state) => {
    dispatch(articleRequest('override_draft'));
    fetch(`${apiURL}/api/articles/draft`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        main_title,
        draft_title,
        draft_id,
        published_channel,
        content_type,
        quick_category,
        content_description,
        article_data,
        featuring_image,
        featuring_data,
        creation_time,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) {
            return dispatch(articleSuccess(res, 'override_draft'));
          }
          return dispatch(articleError(res, 'override_draft'));
        }
      })
      .catch(err => dispatch(articleError(err, 'override_draft')));
  };
}
