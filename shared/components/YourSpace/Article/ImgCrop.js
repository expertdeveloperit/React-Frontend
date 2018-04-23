// Component For adding Image Crop Functionality to the uploaded image.

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cropper from 'react-cropper';
import { imgUpload } from '../../../actions/upload_action';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';

const apiURL = variables.url.localURL;

class ImgCrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardPreviewUrl: '',
      coverPreviewUrl: '',
      imagePreviewUrl: '../assets/images/no-image-available.png',
      galleryCropPreview: '',
      cropperHeading: 'Card Image',
      recropCard: false,
      recropCover: false,
      cropImage: false,
      autoCrop: false,
      blob: '',
      test: '',
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentDidMount() {
    // const localImageUrl = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`));
    let localImageUrl;
    // if (JSON.parse(localStorage.getItem('cardImg')) != null) {
    //   localImageUrl = JSON.parse(localStorage.getItem('cardImg'));
    // } else {
    //   localImageUrl = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`));
    // }
    // if (localImageUrl) {
    //   this.setState({
    //     imagePreviewUrl: localImageUrl[0].url,
    //   });
    if (this.props.from == 'photo') {
      if (JSON.parse(localStorage.getItem('imageUrl0')) != null) {
        localImageUrl = JSON.parse(localStorage.getItem('imageUrl0'));
      } else {
        localImageUrl = JSON.parse(localStorage.getItem('cardImg'));
      }
      if (localImageUrl) {
        this.setState({
          imagePreviewUrl: localImageUrl[0].url,
        });
        const localCardImageUrl = JSON.parse(localStorage.getItem('cardImg'));
        const localCoverImageUrl = JSON.parse(localStorage.getItem('coverImg'));
        if (localCardImageUrl) {
          this.setState({
            cardPreviewUrl: localCardImageUrl[0].url,
          });
        }
        if (localCoverImageUrl) {
          this.setState({
            coverPreviewUrl: localCoverImageUrl[0].url,
          });
        } else {
          this.setState({
            cardPreviewUrl: localImageUrl[0].url,
            coverPreviewUrl: localImageUrl[0].url,
          });
        }
      }
    }
    if (this.props.from == 'image') {
      const localImageUrl = JSON.parse(localStorage.getItem(`imageUrl${this.props.ID}`));
      if (localImageUrl) {
        this.setState({
          imagePreviewUrl: localImageUrl[0].url,
        });
      }
      const localGallery = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`));
      if (localGallery) {
        this.setState({
          galleryCropPreview: localGallery[0].url,
        });
      } else {
        this.setState({
          galleryCropPreview: localImageUrl[0].url,
        });
      }
    }
  }

  _cropCard(files) {
    const datablob = this.refs.cropper.getCroppedCanvas().toBlob((blob) => {
      this.setState({
        blob,
      });
    });
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
    const test = scale / 1000;
    this.refs.cropper.zoomTo(test);
  }

  /*
    fetchRequest() function for upload crop images.
  */

  fetchRequest(id, from, data, token_val) {
    const date = new Date();
    const apiURL = variables.url.localURL;
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
          if (from == 'photo') {
            if (res.imageType == 'coverImage.png') {
              this.setState({
                coverPreviewUrl: `${apiURL}/${res.path}?${date}`,
              });
              const imgData = [
                {
                  id: this.props.ID,
                  name: 'cover image',
                  url: `${apiURL}/${res.path}?${date}`,
                },
              ];
              localStorage.setItem('coverImg', JSON.stringify(imgData));
            }
            if (res.imageType == 'cardImage.png') {
              this.setState({
                cardPreviewUrl: `${apiURL}/${res.path}?${date}`,
              });
              const imgData = [
                {
                  id: this.props.ID,
                  name: 'card image',
                  url: `${apiURL}/${res.path}?${date}`,
                },
              ];
              localStorage.setItem('cardImg', JSON.stringify(imgData));
            }
          } else if (from == 'image') {
            this.setState({
              galleryCropPreview: `${apiURL}/${res.path}?${date}`,
            });
            const imgData = [
              {
                id: res.id,
                name: 'gallery image',
                url: `${apiURL}/${res.path}?${date}`,
              },
            ];
            localStorage.setItem(`gallery${res.id}`, JSON.stringify(imgData));
          }
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
  }

  doneCardCrop() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    const fileName = 'cardImage.png';
    const type = 'image/png';
    const data = new FormData();
    const file = new File([blob], fileName, { type });

    data.append('article_images', file);
    this.fetchRequest(this.props.ID, this.props.from, data, token_val);
    this.setState({
      recropCard: false,
      recropCover: false,
      autoCrop: false,
    });
  }

  doneCoverCrop() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    let fileName = '';
    const type = 'image/png';
    const data = new FormData();
    const date = new Date();

    if (this.props.from == 'photo') {
      fileName = 'coverImage.png';
    }
    if (this.props.from == 'image') {
      fileName = `galleryimage${this.props.ID}.png`;
    }
    const file = new File([blob], fileName, { type });
    data.append('article_images', file);
    this.fetchRequest(this.props.ID, this.props.from, data, token_val);
    this.setState({
      recropCard: false,
      recropCover: false,
      autoCrop: false,
    });
  }

  recropCard(e) {
    this.setState({
      cropperHeading: e.target.dataset.title,
      recropCard: true,
      recropCover: false,
      autoCrop: true,
    });
  }

  recropCover(e) {
    this.setState({
      cropperHeading: e.target.dataset.title,
      recropCard: false,
      recropCover: true,
      autoCrop: true,
    });
    this.getAllChildNodes();
  }

  imgCrop() {
    let width = '';
    const max = width * 1000;
    const elem = document.getElementsByClassName('cropper-canvas');
    if (this.state.autoCrop) {
      if (this.props.from == 'image') {
        setTimeout(() => {
          const childNode = elem[0].firstChild.width;
          width = childNode;
        }, 1000);
        return (
          <div className="no-drag drag-event" id="demoClass">
            <Cropper
              src={this.state.imagePreviewUrl}
              className="no-drag drag-event"
              viewMode={1}
              guides={false}
              minContainerWidth={100}
              minContainerHeight={100}
              scalable
              ref="cropper"
              movable
              wheelZoomRatio={this.state.scale}
              zoomOnWheel
              cropBoxMovable
              cropBoxResizable
              crop={this._cropCover.bind(this)}
              dragMode="move"
              toggleDragModeOnDblclick={false}
            />
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
        );
      }
      if (this.state.recropCover) {
        setTimeout(() => {
          const childNode = elem[0].firstChild.width;
          width = childNode;
        }, 1000);
        return (
          <div className="no-drag drag-event" id="demoClass">
            <Cropper
              src={this.state.imagePreviewUrl}
              className="no-drag drag-event"
              viewMode={1}
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
              max={18000}
              min={width}
              step={width / 100}
              defaultValue={width / 100}
              className="slider no-drag drag-event"
            />
          </div>
        );
      }
      setTimeout(() => {
        const childNode = elem[0].firstChild.width;
        width = childNode;
      }, 2000);
      return (
        <div className="no-drag drag-event">
          <Cropper
            src={this.state.imagePreviewUrl}
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
            crop={this._cropCard.bind(this)}
            dragMode="move"
            toggleDragModeOnDblclick={false}
          />
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
      );
    }
    return (
      <div className="no-drag drag-event">
        <img src={this.state.imagePreviewUrl} className="no-drag drag-event" />
      </div>
    );
  }

  getAllChildNodes() {
    setTimeout(() => {
      // Start the timer
      const mydiv = document.getElementById('demoClass');
      const drag = mydiv.getElementsByTagName('*');
      for (let i = 0; i < drag.length; i++) {
        drag[i].classList.add('no-drag');
      }
    }, 1000);
  }

  render() {
    const cropper = this.imgCrop();
    if (this.props.from == 'photo') {
      return (
        <div className="imgCrop-section parentSection no-drag drag-event opened">
          <div className="childSection1 no-drag drag-event sub-header">
            <div className="no-drag drag-event">
              <h6 className="no-drag drag-event">
                Featuring Image <span> * </span>
              </h6>
              <ul className="image-uplode-top-bar no-drag drag-event">
                <li onClick={this.props.setUpload} className="no-drag drag-event">
                  <span className="Image-up no-drag drag-event" />Upload Image
                </li>
                <li className="active no-drag drag-event" onClick={this.props.setCrop}>
                  <span className="Crop no-drag drag-event" />Crop
                </li>
                <li onClick={this.props.setDetails} className="no-drag drag-event">
                  <span className="Details no-drag drag-event" />Details
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag drag-event imgCrop-wapper">
            <div className="col-xs-16 col-md-6 left-section padding_right_only no-drag drag-event">
              <h4>
                {this.state.cropperHeading}
              </h4>
              {cropper}
            </div>
            <div className="no-drag drag-event col-xs-16 col-md-6 padding_left_only right-section">
              <h4>Preview</h4>
              <div className="sm-img">
                <div className="img-section">
                  <img src={this.state.cardPreviewUrl} />
                </div>
                <div className="button-section pull-right">
                  <p>Card Image</p>
                  <button
                    className={
                      this.state.recropCard
                        ? 'cancelBtn doneColor contentBtnForHover'
                        : 'cancelBtn contentBtnForHover'
                    }
                    id={this.props.ID}
                    data-title="Card Image"
                    onClick={
                      this.state.recropCard
                        ? this.doneCardCrop.bind(this)
                        : this.recropCard.bind(this)
                    }
                  >
                    {this.state.recropCard ? 'Done' : 'Recrop'}
                  </button>
                </div>
              </div>
              <div className="lg-img">
                <div className="img-section">
                  <img src={this.state.coverPreviewUrl} />
                </div>
                <div className="button-section pull-right">
                  <p>Cover Image</p>
                  <button
                    className={
                      this.state.recropCover
                        ? 'cancelBtn doneColor contentBtnForHover'
                        : 'cancelBtn contentBtnForHover'
                    }
                    id={this.props.ID}
                    data-title="Cover Image"
                    onClick={
                      this.state.recropCover
                        ? this.doneCoverCrop.bind(this)
                        : this.recropCover.bind(this)
                    }
                  >
                    {this.state.recropCover ? 'Done' : 'Recrop'}
                  </button>
                </div>
              </div>
              <div className="photo-crop-nextBtn">
                <button
                  className="cancelBtn green-button pull-right"
                  onClick={this.props.nextChange}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.props.from == 'image') {
      return (
        <div className="imgCrop-section parentSection no-drag drag-event image opened">
          <div className="childSection1 no-drag drag-event sub-header image">
            <div className="">
              <h6 className="no-drag drag-event image">Image</h6>
              <ul className="image-uplode-top-bar no-drag drag-event image">
                <li onClick={this.props.setUpload} className="no-drag drag-event image">
                  <span className="Image-up no-drag drag-event" />Upload Image
                </li>
                <li className="active no-drag drag-event image" onClick={this.props.setCrop}>
                  <span className="Crop no-drag drag-event image" />Crop
                </li>
                <li onClick={this.props.setDetails} className="no-drag drag-event image">
                  <span className="Details no-drag drag-event" />Details
                </li>
              </ul>
              <ul className="text-muted pull-right no-drag drag-event image">
                <li className="no-drag drag-event">
                  <img
                    src="../assets/images/user-profile/article-icon-2.png"
                    className="no-drag drag-event"
                    onClick={this.props.delete}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag imgCrop-wapper">
            <div className="col-xs-16 col-md-6 padding_right_only left-section no-drag">
              <h4 className="no-drag drag-event">Gallery Image</h4>
              {cropper}
            </div>
            <div className="col-xs-16 col-md-6 padding_left_only right-section no-drag drag-event">
              <h4 className="no-drag drag-event">Preview</h4>
              <div className="sm-img no-drag drag-event galleryimagecrop galleryimage-wrp">
                <div className="img-section no-drag drag-event">
                  <img src={this.state.galleryCropPreview} className="no-drag drag-event" />
                </div>
                <div className="button-section pull-right no-drag drag-event">
                  <p className="no-drag drag-event">Gallery Image</p>
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
                  onClick={this.props.checkCropData}
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
  const ImgCrop = state;
  return { ImgCrop };
}

function mapDispatchToProps(dispatch, props) {
  return {
    addImage: (data, token_val, id, fromType) => {
      dispatch(imgUpload(data, token_val, id, fromType));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ImgCrop);
