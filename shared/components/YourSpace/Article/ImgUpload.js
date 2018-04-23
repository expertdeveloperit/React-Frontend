/*
  Profile Pic Upload and Preview Component.
*/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import DropToUpload from 'react-drop-to-upload';
import SparkMD5 from 'spark-md5';
import Cookies from 'universal-cookie';
import { imgUpload } from '../../../actions/upload_action';
import variables from '../../../../variables';
import Progress from 'react-progressbar';
import { ToastContainer, toast } from 'react-toastify';

const apiURL = variables.url.localURL;

class ImgUpload extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDrop = this.handleDrop.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleOver = this.handleOver.bind(this);
    this.state = {
      active: 0,
      drops: [],
      file: '',
      imagePreviewUrl: '',
      startLoading: false,
      completeLoading: false,
      progress: 0,
      imgName: '',
      absoluteURL: '',
      id: '',
      image: [],
      componentUpdate: true,
      pastedUrl: '',
      dynamicStates: {},
      detectChange: false,
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    if (this.props.from == 'photo') {
      let data;
      if (JSON.parse(localStorage.getItem('imageUrl0')) != null) {
        data = JSON.parse(localStorage.getItem('imageUrl0'));
        this.setState({
          absoluteURL: data[0].url,
          progress: 100,
          detectChange: true,
        });
      } else if (JSON.parse(localStorage.getItem('featuring_data')) != null) {
        data = JSON.parse(localStorage.getItem('featuring_data'));
        this.setState({
          absoluteURL: data[0].imgurl,
          // progress: 100,
          detectChange: true,
        });
      }
    } else if (this.props.from == 'image') {
      if (JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`))) {
        const data = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`));
        const imgData = {
          id: data[0].id,
          name: data[0].name,
          url: data[0].url,
        };
        const temp = {
          ...this.state.dynamicStates,
          [`url${data[0].id}`]: data[0].url,
        };
        this.setState({
          dynamicStates: temp,
        });
      }
    }
  }

  /*
    Function detectChange(e) used here to detect the change in the input tag,
    used for click functionality.
  */
  detectChange(e) {
    e.preventDefault();
    this.setState({ detectChange: true });
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    if (e.target.files && e.target.files[0]) {
      const data = new FormData();
      data.append('article_images', e.target.files[0]);
      let id = this.props.ID,
        from = this.props.from;
      this.fetchRequest(id, from, data, token_val);
      const imgName = e.target.files[0].name;
      this.setState({ imgName });
    } else if (e.target.value != '') {
      const data = e.target.value;
      const imgData = [
        {
          id: this.props.ID,
          name: 'main image',
          url: data,
        },
      ];
      localStorage.setItem(`imageUrl${this.props.ID}`, JSON.stringify(imgData));
    }
  }

  demo_test() {
    const elem = document.getElementById('myFrame');
    elem.addEventListener('load', () => {
      this.setState({ progress: 100 });
      toast.success('Image uploaded', { position: toast.POSITION.TOP_CENTER });
    });
  }

  demo_test2() {
    const elem = document.getElementById('myFrame2');

    elem.addEventListener('load', () => {
      this.setState({ progress: 100 });
      toast.success('Image uploaded', { position: toast.POSITION.TOP_CENTER });
    });
  }

  /*
    Fetch request to the api for image upload.
  */

  fetchRequest(id, fromType, data, token_val) {
    fetch(`${apiURL}/api/article/upload/images`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token_val}`,
        enctype: 'multipart/formdata',
        id,
        fromType,
      },
      body: data,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status == true) {
            const imgData = [
              {
                id: res.id,
                name: `${res.type}${res.id}`,
                url: `${apiURL}/${res.path}`,
              },
            ];
            localStorage.setItem(`imageUrl${res.id}`, JSON.stringify(imgData));
            if (fromType == 'photo') {
              this.setState({
                absoluteURL: `${apiURL}/${res.path}`,
                progress: 10,
              });
              this.demo_test();
              const imgData = [
                {
                  id: res.id,
                  name: 'main image',
                  url: `${apiURL}/${res.path}`,
                },
              ];
              localStorage.setItem(`imageUrl${res.id}`, JSON.stringify(imgData));
            } else if (fromType == 'image') {
              const imgData = [
                {
                  id: res.id,
                  name: `${res.fromtype}${res.id}`,
                  url: `${apiURL}/${res.path}`,
                },
              ];
              // if(!localData){
              localStorage.setItem(`imageUrl${res.id}`, JSON.stringify(imgData));
              // }
              let url = `${apiURL}/${res.path}`,
                key = `url${res.id}`,
                temp = {
                  ...this.state.dynamicStates,
                  [`url${res.id}`]: url,
                };
              this.setState({
                dynamicStates: temp,
                progress: 20,
              });
              this.demo_test2();
            }
            // let url = `${apiURL}/${res.path}`,
            //   key = `url${res.id}`,
            //   temp = {
            //     ...this.state.dynamicStates,
            //     [`url${res.id}`]: url,
            //   };
            // this.setState({
            //   dynamicStates: temp,
            //   progress: 100,
            // });
            // this.demo_test();
            // toast.success(res.message, { position: toast.POSITION.TOP_CENTER });
          } else {
            toast.error(res.error, { position: toast.POSITION.TOP_CENTER });
            return false;
          }
        }
      });
  }

  checkImageExists(imageUrl, callBack) {
    const imageData = new Image();
    imageData.onload = function () {
      callBack(true);
    };
    imageData.onerror = function () {
      callBack(false);
    };
    imageData.src = imageUrl;
  }

  pastedUrl(e) {
    const imageFile = e.target.value;
    this.setState({ pastedUrl: e.target.value });
    this.checkImageExists(imageFile, (existsImage) => {
      if (existsImage == true) {
        const cookies = new Cookies();
        const token_val = cookies.get('risorsoLoggedIn');
        const url = imageFile;
        fetch(`${apiURL}/api/image/download`, {
          method: 'post',
          headers: {
            Accept: 'application/json , text/plain, */*',
            'Content-type': 'application/json',
            Authorization: `Bearer ${token_val}`,
          },
          body: JSON.stringify({ url }),
        })
          .then(res => res.json())
          .then((res) => {
            if (typeof res === 'object') {
              console.log('res', res);
              if (res.status == true) {
                if (this.props.from == 'photo') {
                  this.setState({
                    absoluteURL: `${apiURL}/${res.path}`,
                    progress: 100,
                  });
                  const imgData = [
                    {
                      id: this.props.ID,
                      name: 'main image',
                      url: `${apiURL}/${res.path}`,
                    },
                  ];
                  localStorage.setItem(`imageUrl${this.props.ID}`, JSON.stringify(imgData));
                  console.log('res true', res);
                } else if (this.props.from == 'image') {
                  const temp = {
                    ...this.state.dynamicStates,
                    [`url${this.props.ID}`]: `${apiURL}/${res.path}`,
                  };
                  const imgData = [
                    {
                      id: this.props.ID,
                      name: `${this.props.from}${this.props.ID}`,
                      url: `${apiURL}/${res.path}`,
                    },
                  ];
                  localStorage.setItem(`imageUrl${this.props.ID}`, JSON.stringify(imgData));
                  this.setState({
                    dynamicStates: temp,
                    progress: 100,
                  });
                }
              }
            }
          });
      }
    });
    // this.detectChange(e);
  }

  // Function handleDrop(files) used here to upload images in drag and drop.
  handleDrop(files) {
    const test = this.state.check_opened_module();
    // if(test){
    this.setState({ detectChange: true });
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    let id = this.props.ID,
      from = this.props.from;
    const data = new FormData();
    data.append('article_images', files[0]);
    this.fetchRequest(id, from, data, token_val);
    const imgName = files[0].name;
    // }
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

  /*
    Function triggerClick(e) used here to call the <input type="file"/>,
    tag on click of the upload div.
  */

  triggerClick(e) {
    const test = this.state.check_opened_module();
    // if(test){

    this.inputElement.click();
    // }
  }

  /*
    Function startLoading() used here to start the loading of the progress bar,
    when the redux return 'REQUEST' response.
  */
  startLoading() {
    this.setState({
      startLoading: true,
    });
  }

  /*
    Function endLoading() used here to end the loading of the progress bar,
    when the redux return 'SUCCESS'/'ERROR' response.
  */
  endLoading() {
    this.setState({
      completeLoading: true,
    });
  }

  /*
    Function resetLoading() used here to reset the loading of the progress bar,
    when the redux return response.
  */
  resetLoading() {
    this.setState({
      startLoading: false,
      completeLoading: false,
    });
  }

  errorMessage() {
    toast.error('blank field not allowed', { position: toast.POSITION.TOP_CENTER });
  }

  render() {
    if (this.props.from == 'photo') {
      return (
        <div className="parentSection">
          <div className="childSection1 no-drag sub-header">
            <div className="">
              <h6>
                Featuring Image <span> * </span>
              </h6>

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
          <div
            className={
              this.state.detectChange ? 'childsection2 no-drag opened' : 'childsection2 no-drag'
            }
          >
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
                      this.state.absoluteURL
                        ? this.state.absoluteURL
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
                    this.state.absoluteURL == ''
                      ? this.errorMessage.bind(this)
                      : this.props.nextChange
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
    } else if (this.props.from == 'image') {
      const testy = `url${this.props.ID}`;
      const url = this.state.dynamicStates[testy];
      return (
        <div className="parentSection no-drag drag-event opened">
          <div className="childSection1 no-drag drag-event sub-header">
            <div className="">
              <h6>Image</h6>
              <ul className="image-uplode-top-bar no-drag drag-event">
                <li className="active no-drag drag-event" onClick={this.props.setUpload}>
                  <span className="Image-up no-drag drag-event" />Upload Image
                </li>
                <li className="no-drag drag-event" onClick={this.props.setCrop}>
                  <span className="Crop no-drag drag-event" />Crop
                </li>
                <li className="no-drag drag-event" onClick={this.props.setDetails}>
                  <span className="Details no-drag drag-event" />Details
                </li>
              </ul>
              <ul className="text-muted pull-right no-drag drag-event">
                <li className="no-drag drag-event">
                  <img
                    className="no-drag drag-event"
                    id={this.props.ID}
                    src="../assets/images/user-profile/article-icon-2.png"
                    onClick={this.props.delete}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Delete"
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag drag-event">
            <div className="col-xs-16 col-md-6 no-drag drag-event padding_right_only">
              <form encType="multipart/form-data" className="no-drag drag-event">
                <DropToUpload
                  element="div"
                  onDrop={this.handleDrop}
                  onLeave={this.handleLeave}
                  onOver={this.handleOver}
                >
                  {this.state.active
                    ? <div className="pro-pic-file no-drag drag-event">
                      <img
                        src="../assets/images/uplode-icon.png"
                        className="no-drag drag-event"
                      />
                      <p className="no-drag drag-event">Drop Here</p>
                    </div>
                    : <div
                      className="pro-pic-file no-drag drag-event"
                      onClick={this.triggerClick.bind(this)}
                    >
                      <img
                        src="../assets/images/uplode-icon.png"
                        className="no-drag drag-event"
                      />
                      <p className="no-drag drag-event">
                          Drag & Drop a File or Click to Select From Your Computer
                        </p>
                    </div>}
                </DropToUpload>
                <input
                  className="no-drag drag-event"
                  type="file"
                  name="files"
                  id="imgInp"
                  onChange={this.detectChange.bind(this)}
                  onDrop={this.detectChange.bind(this)}
                  ref={input => (this.inputElement = input)}
                />
                <p className="upload-with-url no-drag drag-event">Upload with URL</p>
                <div className="paste-input">
                  <input
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
            <div className="col-xs-16 col-md-6 padding_left_only no-drag drag-event">
              <div className="image-upload no-drag drag-event">
                <p className="upload-with-url no-drag drag-event">
                  Progress{' '}
                  <span className="pull-right no-drag drag-event">{this.state.imgName}</span>
                </p>

                <div className="progress-bar no-drag drag-event">
                  <Progress completed={this.state.progress} />

                  {/* id="progressBar-container"<ProgressBar completed={this.state.completeLoading} loading={this.state.startLoading} resetLoading={this.resetLoading} /> */}
                </div>
                <span className="upload-with-url no-drag drag-event">Preview</span>
                <div className="image-preview no-drag drag-event">
                  <img
                    id="myFrame2"
                    src={
                      Object.keys(this.state.dynamicStates).length > 0
                        ? url
                        : '../assets/images/no-image-available.png'
                    }
                    className="imgprv no-drag drag-event"
                  />
                </div>
              </div>
              <div className="image-upload-nextBtn">
                <button
                  className="cancelBtn green-button pull-right no-drag drag-event"
                  onClick={url ? this.props.nextChange : this.errorMessage.bind(this)}
                  id={this.props.ID}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  const ImgUpload = state;
  return { ImgUpload };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadImage: (data, token_val, id, fromType) => {
      dispatch(imgUpload(data, token_val, id, fromType));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ImgUpload);
