import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import DropToUpload from 'react-drop-to-upload';
import SparkMD5 from 'spark-md5';
import Cookies from 'universal-cookie';
import { imgUpload } from '../../../../actions/upload_action';
import variables from '../../../../../variables';
import Progress from 'react-progressbar';

const apiURL = variables.url.localURL;

class PhotoUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      imgName: '',
      dynamicStates: {},
      pastedUrl: '',
      progress: 0,
      localData: '',
    };
  }

  componentDidMount() {
    const localImage = JSON.parse(localStorage.getItem(`imageCollection${this.props.id}`));
    if (localImage) {
      const temp = {
        ...this.state.dynamicStates,
        [`url${localImage[0].id}`]: localImage[0].url,
      };
      this.setState({
        dynamicStates: temp,
        progress: 100,
        localData: localImage,
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps != this.props) {
  //     let type = nextProps.ImgUpload.viewUpload.result.fromtype,
  //       path = nextProps.ImgUpload.viewUpload.result.path,
  //       id = nextProps.ImgUpload.viewUpload.result.id;

  //     if (path) {
  //       const imgData = [
  //         {
  //           id,
  //           name: 'Image Collection',
  //           url: `${apiURL}/${path}`,
  //         },
  //       ];
  //       loStorage.setItem(`imageCollection${id}`, JSON.stringify(imgData));
  //     }
  //   }
  // }

  grapCookie() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    return token_val;
  }

  pastedUrl(e) {
    this.setState({ pastedUrl: e.target.value });
    // this.setState({ absoluteURL: e.target.value });
    const temp = {
      ...this.state.dynamicStates,
      [`url${this.props.id}`]: e.target.value,
    };
    this.setState({
      dynamicStates: temp,
      progress: 100,
    });
    this.detectChange(e);
  }

  /*
    Function detectChange(e) used here to detect the change in the input tag,
    used for click functionality.
  */
  detectChange(e) {
    e.preventDefault();
    const token_val = this.grapCookie();
    if (e.target.files && e.target.files[0]) {
      this.props.stopRender;
      const data = new FormData();
      data.append('article_images', e.target.files[0]);
      let id = this.props.id,
        from = this.props.from;
      const imgName = e.target.files[0].name;
      this.setState({ imgName });
      fetch(`${apiURL}/api/article/upload/images`, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, multipart/formdata, *',
          Authorization: `Bearer ${token_val}`,
          enctype: 'multipart/formdata',
          id,
          from,
        },
        body: data,
      })
        .then(res => res.json())
        .then((res) => {
          if (typeof res === 'object') {
            const imgData = [
              {
                id: res.id,
                name: `${res.type}${res.id}`,
                url: `${apiURL}/${res.path}`,
              },
            ];
            localStorage.setItem(`imageCollection${id}`, JSON.stringify(imgData));
            let url = `${apiURL}/${res.path}`,
              key = `url${res.id}`,
              temp = {
                ...this.state.dynamicStates,
                [`url${res.id}`]: url,
              };
            this.setState({
              dynamicStates: temp,
              progress: 100,
            });
          }
        });
    } else if (e.target.value != '') {
      const data = e.target.value;
      const imgData = [
        {
          id: this.props.id,
          name: 'Image Creation',
          url: data,
        },
      ];

      localStorage.setItem(`imageCollection${this.props.id}`, JSON.stringify(imgData));
    }
  }

  // Function handleDrop(files) used here to upload images in drag and drop.
  handleDrop(files) {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const data = new FormData();
    data.append('article_images', files[0]);
    this.props.uploadImage(data, token_val);
    const imgName = files[0].name;
    this.setState({ progress: 100, imgName });
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
    this.inputElement.click();
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

  alert(message) {
    alert(message);
  }

  /*
    Function to check if there is data in local storage
  */
  checkData(e) {
    const localData = JSON.parse(localStorage.getItem(`imageCollection${this.props.id}`));
    if (localData) {
      this.props.nextChange();
    } else {
      this.alert('Please Upload Photo!');
    }
  }

  render() {
    const testy = `url${this.props.id}`;
    const url = this.state.dynamicStates[testy];
    return (
      <div className="parentSection no-drag drag-event">
        <div className="childSection1 no-drag drag-event sub-header">
          <ul className="text-muted pull-right no-drag drag-event">
            <li className="no-drag drag-event">
              <img
                className="no-drag drag-event"
                id={this.props.id}
                src="../assets/images/user-profile/article-icon-2.png"
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
              />
            </li>
          </ul>
        </div>
        <div className="childsection2 no-drag drag-event">
          <div className="col-xs-16 col-md-6 no-drag drag-event">
            <form encType="multipart/form-data" className="no-drag drag-event">
              <DropToUpload
                element="div"
                onDrop={this.handleDrop}
                onLeave={this.handleLeave}
                onOver={this.handleOver}
              >
                {this.state.active
                  ? <div className="pro-pic-file no-drag drag-event">
                    <img src="../assets/images/uplode-icon.png" className="no-drag drag-event" />
                    <p className="no-drag drag-event">Drop Here</p>
                  </div>
                  : <div
                    className="pro-pic-file no-drag drag-event"
                    onClick={this.triggerClick.bind(this)}
                  >
                    <img src="../assets/images/uplode-icon.png" className="no-drag drag-event" />
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
                onChange={this.pastedUrl.bind(this)}
                onDrop={this.detectChange.bind(this)}
                ref={input => (this.inputElement = input)}
              />
              <p className="upload-with-url no-drag drag-event">Upload with URL</p>
              <input
                autoFocus
                type="text"
                placeholder="Paste The Url Of The Image Here"
                className="image-uplode-input no-drag drag-event"
                value={this.state.pastedURL}
                onChange={this.pastedUrl.bind(this)}
              />
            </form>
          </div>
          <div className="col-xs-16 col-md-6 no-drag drag-event">
            <div className="image-upload no-drag drag-event">
              <p className="upload-with-url no-drag drag-event">
                Progress <span className="pull-right no-drag drag-event">{this.state.imgName}</span>
              </p>

              <div className="progress-bar no-drag drag-event">
                <Progress completed={this.state.progress} />
              </div>
              <span className="upload-with-url no-drag drag-event">Preview</span>
              <div className="image-preview no-drag drag-event">
                <img
                  src={
                    Object.keys(this.state.dynamicStates).length > 0
                      ? url
                      : '../assets/images/no-image-available.png'
                  }
                  className="imgprv no-drag drag-event"
                />
              </div>
            </div>
            <button
              className="btn cancelBtn green-button pull-right no-drag drag-event"
              onClick={this.checkData.bind(this)}
              id={this.props.id}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const PhotoUpload = state;
  return { PhotoUpload };
}

function mapDispatchToProps(dispatch, props) {
  return {
    uploadImage: (data, token_val, id, fromType) => {
      dispatch(imgUpload(data, token_val, id, fromType));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoUpload);
