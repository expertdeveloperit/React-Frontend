import {
  SUCCESS_RELATED_ARTICLE,
  REQUEST_RELATED_ARTICLE,
  ERROR_RELATED_ARTICLE,
} from '../actions/YourSpace_actions/from_another_resource_actions';

const initialstate = {
  loading: false,
  success: false,
  error: false,
  message: '',
  result: [],
};

export default function relatedArticleData(state = initialstate, action) {
  switch (action.type) {
    case 'SUCCESS_RELATED_ARTICLE':
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        result: action.payload,
        message: 'Article Data Success',
      };
    case 'ERROR_RELATED_ARTICLE':
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
        payload: action.payload,
        message: action.message,
      };
    case 'REQUEST_RELATED_ARTICLE':
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
        message: action.message,
      };
    default:
      return state;
  }
}
