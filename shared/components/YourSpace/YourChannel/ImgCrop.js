// Component For adding Image Crop Functionality to the uploaded image.

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cropper from 'react-cropper';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import { channelImgUpload } from '../../../actions/upload_action';
import { ToastContainer, toast } from 'react-toastify';

class ImgCrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverPreviewUrl: '',
      imagePreviewUrl: '../assets/images/no-image-available.png',
      coverTemp: '',
      cropperHeading: 'Card Image',
      recropCover: false,
      cropImage: false,
      autoCrop: false,
      blob: '',
      absoluteURL: '',
    };
  }

  componentWillMount() {
    const localImageUrl = JSON.parse(localStorage.getItem('channel_cover_image'));

    if (localImageUrl) {
      this.setState({
        imagePreviewUrl: localImageUrl[0].url,
      });
    }

    const localCoverImageUrl = JSON.parse(localStorage.getItem('channel_cover_crop_image'));

    if (localCoverImageUrl) {
      this.setState({
        coverPreviewUrl: localCoverImageUrl.url,
      });
    } else {
      this.setState({
        coverPreviewUrl: localImageUrl[0].url,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const apiURL = variables.url.localURL,
      date = new Date();

    if (nextProps.ImgCrop.viewUpload.result.path) {
      this.setState({
        coverPreviewUrl: `${apiURL}/${nextProps.ImgCrop.viewUpload.result.path}?${date}`,
      });
      const imgData = {
        name: 'channel cover',
        url: `${apiURL}/${nextProps.ImgCrop.viewUpload.result.path}`,
      };
      localStorage.setItem('channel_cover_crop_image', JSON.stringify(imgData));
    }
  }

  _cropCover(files) {
    const datablob = this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      this.setState({
        blob,
      });
    });
  }

  handleScale(e) {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  }

  doneCoverCrop() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    let fileName = 'channelCover.png',
      type = 'image/png';
    const data = new FormData();
    const file = new File([blob], fileName, { type });

    data.append('channel_cover_image', file);
    this.props.addImage(data, token_val);
    this.setState({
      recropCover: false,
      autoCrop: false,
    });
  }

  recropCover(e) {
    this.setState({
      cropperHeading: e.target.dataset.title,
      recropCover: true,
      autoCrop: true,
    });
  }

  errorMessage() {
    toast.error('Please Upload a pic!!', { position: toast.POSITION.TOP_CENTER });
  }

  imgCrop() {
    if (this.state.autoCrop) {
      if (this.state.recropCover) {
        return (
          <div className="no-drag drag-event">
            <Cropper
              src={this.state.imagePreviewUrl}
              className="no-drag drag-event"
              viewMode={1}
              checkOrientation
              guides={false}
              minContainerWidth={100}
              aspectRatio={1514 / 441.99}
              minContainerHeight={100}
              scalable={false}
              ref="cropper"
              movable
              wheelZoomRatio={this.state.scale}
              zoomOnWheel
              cropBoxMovable={false}
              cropBoxResizable={false}
              crop={this._cropCover.bind(this)}
              dragMode="move"
              toggleDragModeOnDblclick={false}
            />
            <input
              name="scale"
              type="range"
              onChange={this.handleScale.bind(this)}
              max="1"
              step="0.01"
              defaultValue="0.1"
              className="slider no-drag drag-event"
            />
          </div>
        );
      }
    }
    return (
      <div className="no-drag drag-event">
        <img src={this.state.imagePreviewUrl} />
      </div>
    );
  }

  render() {
    const cropper = this.imgCrop();
    return (
      <div className="childsection2 no-drag imgCrop-wapper">
        <div className="col-xs-16 col-md-6 padding_right_only left-section no-drag">
          <h4 className="no-drag drag-event">Gallery Image</h4>
          {cropper}
        </div>
        <div className="col-xs-16 col-md-6 padding_left_only right-section no-drag drag-event static">
          <h4 className="no-drag drag-event">Preview</h4>
          <div className="sm-img no-drag drag-event galleryimagecrop">
            <div className="img-section no-drag drag-event">
              <img src={this.state.coverPreviewUrl} className="no-drag drag-event" />
            </div>
            <div className="button-section pull-right no-drag drag-event">
              <p className="no-drag drag-event">Cover Image</p>
              <button
                className={
                  this.state.recropCover
                    ? 'cancelBtn contentBtnForHover no-drag drag-event doneColor'
                    : 'cancelBtn contentBtnForHover no-drag drag-event'
                }
                id={this.props.ID}
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
              onClick={
                this.state.coverPreviewUrl ? this.props.nextChange : this.errorMessage.bind(this)
              }
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
  const ImgCrop = state;
  return { ImgCrop };
}

function mapDispatchToProps(dispatch, props) {
  return {
    addImage: (data, token) => {
      dispatch(channelImgUpload(data, token));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImgCrop);
