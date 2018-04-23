import 'fetch-everywhere';
import store from '../redux/configureStore';
import variables from '../../variables';

const apiUrl = variables.url.localURL;
export const CONTENTCARDSUCCESS = 'CONTENTCARDSUCCESS';
export const CONTENTCARDERROR = 'CONTENTCARDERROR';
export const CONTENTCARDREQUEST = 'CONTENTCARDREQUEST';

export function contentCardRequest() {
  return {
    type: CONTENTCARDREQUEST,
    message: 'Loading...',
  };
}

// sending received response from backed to reducer
export function contentCardSuccess(res) {
  return {
    type: CONTENTCARDSUCCESS,
    payload: res,
    message: 'Data Success',
  };
}

// to hndle error
export function contentCardError(err) {
  return {
    type: CONTENTCARDERROR,
    message: err.message,
  };
}

// sorting content cards acc to likes, trends
export function getContentCard(likeFilter, trendFilter, pageno) {
  let url = '';
  if (likeFilter == false && trendFilter == true) {
    url = `${apiUrl}/api/articles/trending/`;
  } else if (likeFilter == true && trendFilter == false) {
    url = `${apiUrl}/api/articles/likes/`;
  } else if (likeFilter == true && trendFilter == true) {
    url = `${apiUrl}/api/articles/both/`;
  } else {
    url = `${apiUrl}/api/articles/latest/`;
  }
  return (dispatch, state) => {
    dispatch(contentCardRequest());
    fetch(url + pageno, {
      method: 'get',
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            const content = res;
            return dispatch(contentCardSuccess(content));
          }
          return dispatch(contentCardError(res));
        }
      })
      .catch(error => dispatch(contentCardError(error)));
  };
}

// receiving content data for quickCategories from backend
export function getCategoryFilter_Data(categoryFilter) {
  return (dispatch, state) =>
    fetch(`${apiUrl}/api/categories/${categoryFilter}/1`, {
      method: 'get',
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          const data = res;
          return dispatch(contentCardSuccess(data));
        }
        return dispatch(contentCardError(res));
      })
      .catch(error => dispatch(contentCardError(error)));
}

// receiving content data for dropdown
export function getTypeFilter(filter, likeFilter, trendFilter) {
  let url = '';
  if (filter && likeFilter == false && trendFilter == true) {
    url = `${apiUrl}/api/articles/trending/${filter}/`;
  } else if (filter && likeFilter == true && trendFilter == false) {
    url = `${apiUrl}/api/articles/likes/${filter}/`;
  } else if (filter && likeFilter == true && trendFilter == true) {
    url = `${apiUrl}/api/articles/both/${filter}/`;
  } else {
    url = `${apiUrl}/api/articles/latest/${filter}/`;
  }
  return (dispatch, state) =>
    fetch(`${url}1`, {
      method: 'get',
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          const filtered_data = res;
          return dispatch(contentCardSuccess(filtered_data));
        }
        return dispatch(contentCardError(res));
      })
      .catch(error => dispatch(contentCardError(error)));
}

// sending like request
// export function sendLike()
