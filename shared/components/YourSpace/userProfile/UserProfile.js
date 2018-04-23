import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {
  getData,
  editAboutUs,
  editNameSurname,
  saveUserData,
} from '../../../actions/userProfile_action';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import ProfileSidebar from './Sidebar/ProfileSidebar';
import Cropper from 'react-cropper';
import Progress from 'react-progressbar';
import DropToUpload from 'react-drop-to-upload';
import SparkMD5 from 'spark-md5';
import { ToastContainer, toast } from 'react-toastify';
import SocialConnects from './SocialConnects';

const apiURL = variables.url.liveURL;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleOver = this.handleOver.bind(this);
    this.state = {
      showAboutUs: true,
      about_data: '',
      name: '',
      surname: '',
      showNameSurname: true,
      showProfilePic: true,
      profilePictureUrl: '../assets/images/user-profile/Profile-pic.png',
      coverPicture: '',
      coverPictureUrl: '',
      coverCrop: '',
      scroll: false,
      profileData: '',
      active: 0,
      imgName: '',
      progress: 0,
      countProfile: 1,
      recropCover: false,
      autoCrop: false,
      blob: '',
      coverCount: 1,
    };
  }

  componentWillMount() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    // to get user profile data when profile displayed
    this.props.getData(token_val);
  }

  componentDidMount() {
    // window.addEventListener('scroll', this.test);
    const localProfilePicture = JSON.parse(localStorage.getItem('profilePicture'));
    const localProfileCrop = JSON.parse(localStorage.getItem('profileCrop'));
    const localCoverPicture = JSON.parse(localStorage.getItem('coverPicture'));
    const localCoverCrop = JSON.parse(localStorage.getItem('CoverCrop'));

    if (localProfilePicture) {
      this.setState({
        profilePictureUrl: localProfilePicture.url,
      });
      if (localProfileCrop) {
        this.setState({
          profileCrop: localProfileCrop.url,
        });
      } else {
        this.setState({
          profileCrop: localProfilePicture.url,
        });
      }
    } else if (localCoverPicture) {
      this.setState({
        coverPictureUrl: localCoverPicture.url,
      });
      if (localCoverCrop) {
        this.setState({
          coverCrop: localCoverCrop.url,
        });
      } else {
        this.setState({
          coverCrop: localCoverPicture.url,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // to receive prop from redux store
    let about,
      name,
      surname,
      profilePicture;
    if (nextProps.UserProfile.fetchUserProfile.response.status == true) {
      const profileData = nextProps.UserProfile.fetchUserProfile.response.profile;
      if (profileData.name || profileData.surname) {
        this.setState({
          showNameSurname: false,
        });
      }
      if (profileData.about) {
        this.setState({
          showAboutUs: false,
        });
      }
      if (profileData.profile_picture) {
        this.setState({
          showProfilePic: false,
        });
      }
      if (profileData.profile_cover_picture) {
        this.setState({
          coverCount: 4,
        });
      }
      this.setState({
        about_data: profileData.about,
        name: profileData.name,
        surname: profileData.surname,
        profileCrop: `${apiURL}/${profileData.profile_picture}`,
        profilePictureUrl: `${apiURL}/${profileData.profile_picture}`,
        coverCrop: `${apiURL}/${profileData.profile_cover_picture}`,
        coverPictureUrl: `${apiURL}/${profileData.profile_cover_picture}`,
      });
    }
  }

  // About Us starts

  // aboutus form to edit. if 'edit' clicked form to update aboutus will displayed
  // else span which shows data which is already in database.
  openAboutUsForm() {
    if (this.state.showAboutUs) {
      return (
        <form onSubmit={this.submitAboutUs.bind(this)}>
          <div className="form-group">
            <textarea
              className="form-control"
              name="aboutus"
              value={this.state.about_data}
              onChange={this.aboutusInput.bind(this)}
              autoFocus
            />
          </div>
          <div className="text-right">
            <input
              type="submit"
              name="AboutUs_submit"
              value="Save"
              className="submit_button append-margin contentBtnForHover"
              onClick={this.submitAboutUs.bind(this)}
            />
          </div>
        </form>
      );
    }
    return (
      <span className="text-muted">
        {this.state.about_data}
      </span>
    );
  }

  // handler of aboutus input
  aboutusInput(e) {
    this.setState({ about_data: e.target.value });
  }

  // handler for display hide aboutus form
  handleOpenAboutUsForm() {
    this.setState({ showAboutUs: !this.state.showAboutUs });
  }
  // handler to submit aboutus form
  submitAboutUs(e) {
    e.preventDefault();
    if (this.state.about_data) {
      const editaboutdata = this.state.about_data;
      const cookies = new Cookies();
      const token_val = cookies.get('risorsoLoggedIn');
      this.props.editAboutUs(token_val, editaboutdata);
      this.setState({ showAboutUs: !this.state.showAboutUs });
    } else {
      toast.error("Field can't be empty!!", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
  }
  // About Us ends

  // name surname starts
  handleOpenUserNameForm() {
    this.setState({ showNameSurname: !this.state.showNameSurname });
  }

  handleNameInput(e) {
    this.setState({ name: e.target.value });
  }

  handleSurnameInput(e) {
    this.setState({ surname: e.target.value });
  }

  submitNameSurnameForm(e) {
    e.preventDefault();
    if (this.state.name && this.state.surname) {
      const cookies = new Cookies();
      const token_val = cookies.get('risorsoLoggedIn');
      const name = this.state.name;
      const surname = this.state.surname;
      this.props.editNameSurname(token_val, name, surname);
      this.setState({ showNameSurname: !this.state.showNameSurname });
    } else {
      toast.error("Field can't be empty!!", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
  }

  openNameSurnameForm() {
    if (this.state.showNameSurname) {
      return (
        <form>
          <div className="form-group nameinput">
            <input
              value={this.state.name}
              onChange={this.handleNameInput.bind(this)}
              type="text"
              className="form-control"
              name="name"
              placeholder="Name"
              autoFocus
            />
          </div>
          <div className="form-group nameinput">
            <input
              value={this.state.surname}
              onChange={this.handleSurnameInput.bind(this)}
              type="text"
              className="form-control"
              name="surname"
              placeholder="Surname"
            />
          </div>
          <div className="text-right nameinputSave">
            <input
              type="submit"
              name="AboutUs_submit"
              value="Save"
              className="submit_button append-margin contentBtnForHover"
              onClick={this.submitNameSurnameForm.bind(this)}
            />
          </div>
        </form>
      );
    }
    return (
      <div>
        <div className="firstname">
          {this.state.name}
        </div>
        <div className="lastname">
          {this.state.surname}
        </div>
      </div>
    );
  }
  // name surname ends

  // profile picture starts here

  imgCrop() {
    if (this.state.autoCrop) {
      let width = '';
      setTimeout(() => {
        const childNode = elem[0].firstChild.width;
        width = childNode;
      }, 1000);
      return (
        <div className="no-drag drag-event">
          <Cropper
            src={this.state.profilePictureUrl}
            className="no-drag drag-event profilePicCrop"
            viewMode={1}
            guides={false}
            minContainerWidth={100}
            aspectRatio={220 / 220}
            minContainerHeight={100}
            scalable={false}
            ref="cropper"
            movable
            wheelZoomRatio={this.state.scale}
            zoomOnWheel
            cropBoxMovable={false}
            cropBoxResizable={false}
            crop={this._crop.bind(this)}
            dragMode="move"
            toggleDragModeOnDblclick={false}
          />
          <div>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale.bind(this)}
              max={18000}
              min={width}
              step={width / 100}
              defaultValue={width / 100}
              className="slider no-drag drag-event"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="no-drag drag-event">
        <img src={this.state.profilePictureUrl} className="no-drag drag-event" />
      </div>
    );
  }

  handleOpenProfilePicForm() {
    this.setState({
      showProfilePic: !this.state.showProfilePic,
      countProfile: 1,
    });
  }

  openProfilePicForm() {
    const url = `${apiURL}/`;
    if (this.state.showProfilePic) {
      if (this.state.countProfile == 1) {
        return (
          <div className="childsection2 no-drag">
            <div className="col-xs-16 col-md-6 profile-pic-parent">
              <form encType="multipart/form-data" className="no-drag">
                <DropToUpload
                  element="div"
                  onDrop={this.handleDrop}
                  onLeave={this.handleLeave}
                  onOver={this.handleOver}
                >
                  {this.state.active
                    ? <div className="pro-pic-file-upload">
                      <img src="../assets/images/upload-profile-pic.png" />
                      <p className="drag-text">Drop Here</p>
                    </div>
                    : <div className="pro-pic-file-upload" onClick={this.triggerClick.bind(this)}>
                      <img src="../assets/images/upload-profile-pic.png" />
                      <p className="drag-text">
                          Drag & Drop a File or Click to Select From Your Computer
                        </p>
                    </div>}
                </DropToUpload>
                <input
                  data-id="profile"
                  className="no-drag"
                  type="file"
                  name="files"
                  id="imgInp"
                  onChange={this.detectChange.bind(this)}
                  onDrop={this.detectChange.bind(this)}
                  ref={input => (this.inputElement = input)}
                />
              </form>
            </div>
            <div className="col-xs-16 col-md-6 profile-picright">
              <p className="upload-with-url">
                Progress <span className="pull-right">{this.state.imgName}</span>
              </p>

              <div className="progress-bar">
                <Progress completed={this.state.progress} />
              </div>
              <div className="profile-pic-upload-preview">
                <img
                  src={this.state.profilePictureUrl}
                  alt="Image Preview"
                  className="pre-upload-image"
                />
              </div>
            </div>
            <div className="clear-both col-xs-12 col-md-12 no_padding">
              <button
                className="cancelBtn green-button pull-right"
                onClick={this.nextProfile.bind(this)}
              >
                Next
              </button>
            </div>
          </div>
        );
      } else if (this.state.countProfile == 2) {
        const cropper = this.imgCrop();
        return (
          <div className="childsection2 no-drag imgCrop-wapper pfe-pic-wrp">
            <div className="col-xs-16 col-md-6 padding_right_only left-section no-drag">
              <div className="pfe-pic-box pfe-pic-wpr">
                {cropper}
              </div>
            </div>
            <div className="col-xs-16 col-md-6 profile-picright">
              <p className="upload-with-url">
                Progress <span className="pull-right">{this.state.imgName}</span>
              </p>

              <div className="progress-bar">
                <Progress completed={this.state.progress} />
              </div>
              <div className="profile-pic-upload-preview">
                <img
                  src={this.state.profileCrop}
                  alt="Image Preview"
                  className="pre-upload-image"
                />
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12">
              <div className="clear-both col-xs-16 col-md-6 rop-btn-section">
                <button
                  className="cancelBtn crop-btn pull-right"
                  data-id="profileCrop"
                  onClick={
                    this.state.recropCover
                      ? this.doneCoverCrop.bind(this)
                      : this.recropCover.bind(this)
                  }
                >
                  {this.state.recropCover ? 'Done' : 'Crop'}
                </button>
              </div>
              <div className="clear-both col-xs-16 col-md-6 no_padding">
                <button
                  className="cancelBtn green-button pull-right"
                  onClick={this.save.bind(this)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="profile-preview">
        <div className="profile-img">
          <img
            src={
              this.state.profileCrop
                ? this.state.profileCrop
                : '../assets/images/user-profile/Profile-pic.png'
            }
            alt="profile pic"
          />
        </div>
      </div>
    );
  }

  // profile picture ends

  // cover picture starts

  imgCoverCrop() {
    if (this.state.autoCrop) {
      let width = '';
      setTimeout(() => {
        const childNode = elem[0].firstChild.width;
        width = childNode;
      }, 1000);
      return (
        <div className="no-drag drag-event">
          <Cropper
            src={this.state.coverPictureUrl}
            className="no-drag drag-event"
            viewMode={1}
            guides={false}
            minContainerWidth={100}
            aspectRatio={407 / 220}
            minContainerHeight={100}
            scalable={false}
            ref="cropper"
            movable
            wheelZoomRatio={this.state.scale}
            zoomOnWheel
            cropBoxMovable={false}
            cropBoxResizable={false}
            crop={this._crop.bind(this)}
            dragMode="move"
            toggleDragModeOnDblclick={false}
          />
          <div>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale.bind(this)}
              max={18000}
              min={width}
              step={width / 100}
              defaultValue={width / 100}
              className="slider no-drag drag-event"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="no-drag drag-event">
        <img src={this.state.coverPictureUrl} className="no-drag drag-event" />
      </div>
    );
  }

  handleOpenCoverPicForm() {
    this.setState({
      coverPicture: !this.state.coverPicture,
      coverCount: 1,
    });
  }

  openCoverPicForm() {
    // <ul className="image-uplode-top-bar">
    //    <li className="active" onClick={this.props.setUpload}>
    //      <span className="Image-up" />Upload Image
    //    </li>
    //    <li onClick={this.props.setCrop}>
    //      <span className="Crop" />Crop
    //    </li>
    //    <li onClick={this.props.setDetails}>
    //      <span className="Details" />Details
    //    </li>
    //  </ul>
    const date = new Date();
    if (this.state.coverPicture) {
      if (this.state.coverCount == 1) {
        return (
          <div className="parentSection cover_picture">
            <div className="childSection1 no-drag sub-header">
              <div className="">
                <h6>Cover Picture</h6>
              </div>
            </div>
            <div className="childsection2 no-drag">
              <div className="col-xs-16 col-md-6 padding_right_only">
                <form encType="multipart/form-data" className="no-drag">
                  <DropToUpload
                    element="div"
                    onDrop={this.handleDrop}
                    onLeave={this.handleLeave}
                    onOver={this.handleOver}
                  >
                    {this.state.active
                      ? <div className="pro-pic-file">
                        <img src="../assets/images/uplode-icon.png" />
                        <p>Drop Here</p>
                      </div>
                      : <div className="pro-pic-file" onClick={this.triggerClick.bind(this)}>
                        <img src="../assets/images/uplode-icon.png" />
                        <p>Drag & Drop a File or Click to Select From Your Computer</p>
                      </div>}
                  </DropToUpload>
                  <input
                    data-id="cover"
                    className="no-drag"
                    type="file"
                    name="files"
                    id="imgInp"
                    onChange={this.detectChange.bind(this)}
                    onDrop={this.detectChange.bind(this)}
                    ref={input => (this.inputElement = input)}
                  />
                  <p className="upload-with-url">Upload with URL</p>
                  <div className="paste-input">
                    <input
                      data-id="cover"
                      autoFocus
                      type="text"
                      placeholder="Paste The Url Of The Image Here"
                      className="image-uplode-input no-drag drag-event"
                      value={this.state.pastedURL}
                      onChange={this.pastedUrl.bind(this)}
                    />
                    <a href="#">
                      <img src="../assets/images/pasteUrl.png" />
                    </a>
                  </div>
                </form>
              </div>
              <div className="col-xs-16 col-md-6 padding_left_only">
                <div className="image-upload">
                  <p className="upload-with-url">
                    Progress <span className="pull-right">{this.state.imgName}</span>
                  </p>

                  <div className="progress-bar">
                    <Progress completed={this.state.progress} />

                    {/* id="progressBar-container"<ProgressBar completed={this.state.completeLoading} loading={this.state.startLoading} resetLoading={this.resetLoading} /> */}
                  </div>
                  <span className="upload-with-url">Preview</span>
                  <div className="image-preview">
                    <img
                      id="myFrame"
                      src={
                        this.state.coverPictureUrl
                          ? this.state.coverPictureUrl
                          : '../assets/images/no-image-available.png'
                      }
                      className="imgprv imgLoad"
                    />
                  </div>
                </div>
                <div className="photo-upload-nextBtn">
                  <button
                    className="cancelBtn green-button pull-right"
                    onClick={
                      this.state.coverPictureUrl == ''
                        ? this.errorMessage.bind(this)
                        : this.nextCover.bind(this)
                    }
                    id={this.props.ID}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (this.state.coverCount == 2) {
        const cropper = this.imgCoverCrop();
        return (
          <div className="parentSection cover_picture">
            <div className="childSection1 no-drag sub-header">
              <div className="">
                <h6>Cover Picture</h6>

                <ul className="image-uplode-top-bar">
                  <li className="active" onClick={this.props.setUpload}>
                    <span className="Image-up" />Upload Image
                  </li>
                  <li onClick={this.props.setCrop}>
                    <span className="Crop" />Crop
                  </li>
                  <li onClick={this.props.setDetails}>
                    <span className="Details" />Details
                  </li>
                </ul>
              </div>
            </div>
            <div className="childsection2 no-drag imgCrop-wapper">
              <div className="col-xs-16 col-md-6 padding_right_only left-section no-drag">
                <h4 className="no-drag drag-event">Cover Image</h4>
                {cropper}
              </div>
              <div className="col-xs-16 col-md-6 padding_left_only right-section no-drag drag-event userProfile-images">
                <h4 className="no-drag drag-event">Preview</h4>
                <div className="sm-img no-drag drag-event">
                  <div className="img-section no-drag drag-event">
                    <img src={this.state.coverCrop} className="no-drag drag-event" />
                  </div>
                  <div className="button-section pull-right no-drag drag-event">
                    <p className="no-drag drag-event">Cover Image</p>
                    <button
                      className={
                        this.state.recropCover
                          ? 'cancelBtn contentBtnForHover no-drag drag-event doneColor'
                          : 'cancelBtn contentBtnForHover no-drag drag-event'
                      }
                      data-id="coverCrop"
                      data-title="Gallery Image"
                      onClick={
                        this.state.recropCover
                          ? this.doneCoverCrop.bind(this)
                          : this.recropCover.bind(this)
                      }
                    >
                      {this.state.recropCover ? 'Save' : 'Recrop'}
                    </button>
                  </div>
                </div>
                <div className="image-crop-nextBtn clear-both">
                  <button
                    className="cancelBtn green-button pull-right no-drag drag-event"
                    onClick={this.nextCover.bind(this)}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="cover-pic outer-section append-margin">
        <div className="title-section">
          <span>Cover Picture</span>
          <img
            src="../assets/images/Edit.png"
            className="pull-right edit-icon"
            data-toggle="tooltip"
            data-placement="top"
            title="Edit"
            onClick={this.handleOpenCoverPicForm.bind(this)}
          />
        </div>
        <div className="data-section">
          <div>
            <img src={`${this.state.coverCrop}?${date}`} alt="cover photo" />
          </div>
        </div>
      </div>
    );
  }
  // cover picture ends
  pastedUrl(e) {
    if (this.props.from == 'photo') {
      this.setState({ pastedUrl: e.target.value });
      this.setState({
        absoluteURL: e.target.value,
        progress: 100,
      });
    } else if (this.props.from == 'image') {
      const temp = {
        ...this.state.dynamicStates,
        [`url${this.props.ID}`]: e.target.value,
      };
      this.setState({
        dynamicStates: temp,
        progress: 100,
      });
    }
    this.detectChange(e);
  }

  nextCover(e) {
    e.preventDefault();
    const count = ++this.state.coverCount;
    this.setState({
      coverCount: count,
    });
  }

  detectChange(e) {
    e.preventDefault();
    let key = '';
    const test = e.target.dataset.id;
    if (test == 'profile' || test == 'profileCrop') {
      key = 'profile_picture';
    } else {
      key = 'profile_cover_picture';
    }
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    if (e.target.files && e.target.files[0]) {
      const data = new FormData();
      data.append(key, e.target.files[0]);
      this.fetchRequest(data, token_val, test);
      const imgName = e.target.files[0].name;
      this.setState({ imgName });
    }
  }

  doneCoverCrop(e) {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    const fileName = `${e.target.dataset.id}.png`;
    const type = 'image/png';
    const data = new FormData();
    const date = new Date();
    const file = new File([blob], fileName, { type });
    if (e.target.dataset.id == 'profile' || e.target.dataset.id == 'profileCrop') {
      data.append('profile_picture', file);
    } else if (e.target.dataset.id == 'cover' || e.target.dataset.id == 'coverCrop') {
      data.append('profile_cover_picture', file);
    }
    this.fetchRequest(data, token_val, e.target.dataset.id);
    this.setState({
      recropCover: false,
      autoCrop: false,
    });
  }

  recropCover(e) {
    this.setState({
      recropCover: true,
      autoCrop: true,
    });
  }

  save(e) {
    if (this.state.profileCrop) {
      this.setState({
        showProfilePic: false,
      });
    } else {
      toast.error('Please Crop Profile Pic!!', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
  }

  fetchRequest(data, token_val, test) {
    let field_name = '';
    if (test == 'profile' || test == 'profileCrop') {
      field_name = 'profile_picture';
    } else {
      field_name = 'profile_cover_picture';
    }
    fetch(`${apiURL}/api/upload/profilePicture`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token_val}`,
        enctype: 'multipart/formdata',
        field_name,
      },
      body: data,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) {
            if (test == 'profile') {
              const profilePicture = {
                url: `${apiURL}/${res.profile.profile_picture}`,
              };
              localStorage.setItem('profilePicture', JSON.stringify(profilePicture));
              this.setState({
                profilePictureUrl: `${apiURL}/${res.profile.profile_picture}`,
                profileCrop: `${apiURL}/${res.profile.profile_picture}`,
                progress: 100,
              });
            } else if (test == 'profileCrop') {
              const profileCrop = {
                url: `${apiURL}/${res.profile.profile_picture}`,
              };
              localStorage.setItem('profileCrop', JSON.stringify(profileCrop));
              this.setState({
                profileCrop: `${apiURL}/${res.profile.profile_picture}`,
                progress: 100,
              });
            } else if (test == 'cover') {
              const coverCrop = {
                url: `${apiURL}/${res.profile.profile_cover_picture}`,
              };
              localStorage.setItem('coverPicture', JSON.stringify(coverCrop));
              this.setState({
                coverPictureUrl: `${apiURL}/${res.profile.profile_cover_picture}`,
                coverCrop: `${apiURL}/${res.profile.profile_cover_picture}`,
                progress: 100,
              });
            } else if (test == 'coverCrop') {
              const coverCrop = {
                url: `${apiURL}/${res.profile.profile_cover_picture}`,
              };
              localStorage.setItem('coverCrop', JSON.stringify(coverCrop));
              this.setState({
                coverCrop: `${apiURL}/${res.profile.profile_cover_picture}`,
              });
            }
          } else {
          }
        }
      });
  }

  nextProfile(e) {
    if (this.state.profilePictureUrl) {
      const count = ++this.state.countProfile;
      this.setState({
        countProfile: count,
      });
    } else {
      toast.error('Please Upload Profile Pic!!', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
  }

  // Function handleDrop(files) used here to upload images in drag and drop.
  handleDrop(files) {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const data = new FormData();
    data.append('profile_picture', files[0]);
    this.fetchRequest(data, token_val, 'profile');
    const imgName = files[0].name;
  }

  /*
    Function handleLeave() used here to change the state for the drag component,
    when the drag leaves the div.
  */
  handleLeave() {
    this.setState({ active: 0 });
  }

  /*
    Function handleOver() used here to change state for the drag component,
    When the drag enters the div.
  */
  handleOver() {
    this.setState({ active: 1 });
  }

  handleScale(e) {
    const scale = parseFloat(e.target.value);
    const test = scale / 1000;
    this.refs.cropper.zoomTo(test);
  }

  _crop(files) {
    const datablob = this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      this.setState({
        blob,
      });
    });
  }

  /*
    Function triggerClick(e) used here to call the <input type="file"/>,
    tag on click of the upload div.
  */

  triggerClick(e) {
    this.inputElement.click();
  }

  errorMessage() {
    toast.error('blank field not allowed', { position: toast.POSITION.TOP_CENTER });
  }

  // to restrict display of profile ..if user not loggedin
  checkUserStatus() {
    const cookies = new Cookies();
    const a = cookies.get('risorsoLoggedIn');
    if (a) {
      return false;
    }
    return true;
  }

  // Function To add class when sidebar is fix
  // scroll() {
  //   const d = document.documentElement;
  //   const offset = d.scrollTop;
  //   if (offset == 0) {
  //     this.setState({
  //       scroll: false,
  //     });
  //   } else {
  //     this.setState({
  //       scroll: true,
  //     });
  //   }
  // }

  handleClick() {
    const a = document.getElementsByClassName('userprofile-data');
    // a.classList.add("active");
  }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.test);
  // }

  render() {
    const redirect = this.checkUserStatus();
    const url = apiURL;
    // if (redirect) {
    //   return <Redirect to="/login" />;
    // }
    let openAboutUsForm;
    openAboutUsForm = this.openAboutUsForm();
    let openNameSurnameForm;
    openNameSurnameForm = this.openNameSurnameForm();
    let openProfilePicForm;
    openProfilePicForm = this.openProfilePicForm();
    let openCoverPicForm;
    openCoverPicForm = this.openCoverPicForm();
    return (
      <div className="container">
        <div className="row">
          <div className={this.state.scroll ? 'userprofile-main scroll' : 'userprofile-main'}>
            <div className="profile_top_bar">
              <ul className="top_list">
                <li>
                  <span className="img_parent img_Bank" />Bank Accounts
                </li>
                <li>
                  <span className="img_parent img_Credit" />Credit Cards
                </li>
                <li>
                  <span className="img_parent img_Account" />Account Settings
                </li>
                <li>
                  <span className="img_parent img_Privacy" />Privacy
                </li>
                <li>
                  <span className="img_parent img_user_Profile" />user Profile
                </li>
              </ul>
            </div>
            <div className="outer-section">
              <div className="title-section">
                <span>About Us</span>
                <img
                  src="../assets/images/Edit.png"
                  className={
                    this.state.showAboutUs
                      ? 'pull-right edit-icon display-none'
                      : 'pull-right edit-icon'
                  }
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                  onClick={this.handleOpenAboutUsForm.bind(this)}
                />
              </div>
              <div className="data-section">
                <div>
                  {openAboutUsForm}
                </div>
              </div>
            </div>

            {/* profile picture starts */}
            <div className="profile-picture profile-pic-wrapper append-margin">
              <div
                className={
                  this.state.showProfilePic ? 'picture-title enableShadow' : 'picture-title'
                }
              >
                <span>Profile Picture</span>
                <img
                  src="../assets/images/Edit.png"
                  className={
                    this.state.showProfilePic
                      ? 'pull-right edit-icon display-none'
                      : 'pull-right edit-icon'
                  }
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                  onClick={this.handleOpenProfilePicForm.bind(this)}
                />
              </div>
              <div className="clear-both profile-box">
                {openProfilePicForm}
              </div>
            </div>
            {/* profile picture ends */}

            {/* Name surname starts */}
            <div className="outer-section append-margin name-surname">
              <div className="title-section">
                <span>Name Surname</span>
                <img
                  src="../assets/images/Edit.png"
                  className={
                    this.state.showNameSurname
                      ? 'pull-right edit-icon display-none'
                      : 'pull-right edit-icon'
                  }
                  onClick={this.handleOpenUserNameForm.bind(this)}
                />
              </div>
              <div className="data-section">
                {openNameSurnameForm}
              </div>
            </div>
            {/* Name surname ends */}

            {/* Cover picture starts */}

            {openCoverPicForm}

            {/* Cover picture ends */}

            {/* social network connection starts */}
            <SocialConnects />
            {/* social network connection ends */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const UserProfile = state;
  return { UserProfile };
}

function mapDispatchToProps(dispatch, props) {
  return {
    getData: (token_val) => {
      dispatch(getData(token_val));
    },
    editAboutUs: (token_val, editaboutdata) => {
      dispatch(editAboutUs(token_val, editaboutdata));
    },
    editNameSurname: (token_val, name, surname) => {
      dispatch(editNameSurname(token_val, name, surname));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
