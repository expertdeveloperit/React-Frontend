import {
  CONTENTCARDSUCCESS,
  CONTENTCARDERROR,
  CONTENTCARDREQUEST,
} from '../actions/contentcard_action';

const initialState = {
  loading: false,
  success: false,
  error: false,
  message: '',
  result: [],
};

// receiving action response
export default function ContentCard(state = initialState, action) {
  switch (action.type) {
    case 'CONTENTCARDSUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        success: true,
        message: action.message,
        result: action.payload,
      };
    case 'CONTENTCARDERROR':
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
        message: action.message,
        result: action.payload,
      };
    case 'CONTENTCARDREQUEST':
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
        message: action.message,
        result: [],
      };
    default:
      return state;
  }
}
