import { combineReducers } from 'redux';
import viewquickCategories_Data from '../reducers/quickCategories_reducer';
import ContentCard from '../reducers/contentcard_reducer';
import fetchSignUp from '../reducers/signup_reducer';
import fetchLogin from '../reducers/login_reducer';
import viewUpload from '../reducers/upload_reducer';
import fetchUserProfile from '../reducers/userprofile_reducer';
import fetchArticleData from '../reducers/article_reducer';
import fetchChannelData from '../reducers/channel_reducer';
import contentData from '../reducers/contentShowcase_reducer';
import relatedArticleData from '../reducers/related_article_reducer';

const rootReducer = combineReducers({
  viewquickCategories_Data,
  ContentCard,
  fetchSignUp,
  fetchLogin,
  fetchUserProfile,
  viewUpload,
  fetchChannelData,
  contentData,
  fetchArticleData,
  relatedArticleData,
});

export default rootReducer;
