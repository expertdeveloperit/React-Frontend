import {
  ERROR_ARTICLE,
  REQUEST_ARTICLE,
  SUCCESS_ARTICLE,
  DRAFTSUCCESS,
  DRAFTERROR,
} from '../actions/YourSpace_actions/article_actions';

const initialState = {
  result: '',
  loading: false,
  success: false,
  error: false,
  from: '',
  message: '',
};

export default function fetchArticleData(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ARTICLE:
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
        from: action.from,
        message: 'Loading Data',
      };
      break;

    case SUCCESS_ARTICLE:
      return {
        ...state,
        result: action.payload,
        loading: false,
        success: true,
        error: false,
        from: action.from,
        message: 'Data received from Api',
      };
      break;

    case ERROR_ARTICLE:
      return {
        ...state,
        result: action.payload,
        loading: false,
        success: false,
        error: true,
        from: action.from,
        message: action.message,
      };
      break;

    case DRAFTSUCCESS:
      return {
        ...state,
        result: action.payload,
        loading: false,
        success: true,
        from: 'get_drafts',
        message: 'Data received from Api',
      };
      break;

    default:
      return state;
  }
}
