import { UPLOADSUCCESS, UPLOADREQUEST, UPLOADERROR } from '../actions/upload_action';

const initialstate = {
  loading: false,
  success: false,
  error: false,
  message: '',
  result: [],
};

export default function viewUpload(state = initialstate, action) {
  switch (action.type) {
    case 'UPLOADSUCCESS':
      return {
        ...state,
        loading: false,
        success: true,
        error: false,
        result: action.payload,
        message: action.message,
      };
    case 'UPLOADERROR':
      return {
        ...state,
        loading: false,
        success: false,
        error: true,
        result: action.payload,
        message: action.message,
      };
    case 'UPLOADREQUEST':
      return {
        ...state,
        loading: true,
        success: false,
        error: false,
        result: [],
        message: action.message,
      };
    default:
      return state;
  }
}
