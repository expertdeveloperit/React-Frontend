import {
  CONTENTSUCCESS,
  CONTENTREQUEST,
  CONTENTERROR,
} from '../actions/contentActions/contentShowcase_action';

const initialstate = {
  loading: false,
  success: false,
  error: false,
  message: '',
  result: [],
};

export default function contentData(state = initialstate, action) {
  switch (action.type) {
    case 'CONTENTSUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        result: action.payload,
        message: 'Article Data Success',
      };
    case 'CONTENTERROR':
      return {
        ...state,
        loading: false,
        error: true,
        success: false,
        payload: action.payload,
        message: action.message,
      };
    case 'CONTENTREQUEST':
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
