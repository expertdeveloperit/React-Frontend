import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cropper from 'react-cropper';
import Cookies from 'universal-cookie';
import variables from '../../../../../variables';

const apiURL = variables.url.localURL;
class PhotoCrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageCropPreview: '',
      blob: '',
      imagePreviewUrl: '../assets/images/no-image-available.png',
      recropImage: false,
    };
  }

  componentDidMount() {
    let localImage = JSON.parse(localStorage.getItem(`imageCollection${this.props.id}`)),
      localCropImage = JSON.parse(localStorage.getItem(`imageCollectionCrop${this.props.id}`));

    if (localImage) {
      this.setState({
        imagePreviewUrl: localImage[0].url,
      });
      if (localCropImage) {
        this.setState({
          imageCropPreview: localCropImage[0].url,
        });
      } else {
        this.setState({
          imageCropPreview: localImage[0].url,
        });
      }
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
    const test = scale / 1000;
    this.refs.cropper.zoomTo(test);
  }

  doneImageCrop() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    const fileName = `imageCrop${this.props.id}.png`;
    const type = 'image/png';
    const data = new FormData();
    const date = new Date();
    const file = new File([blob], fileName, { type });
    data.append('article_images', file);
    let id = this.props.id,
      from = this.props.from;
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
          localStorage.setItem(`imageCollectionCrop${res.id}`, JSON.stringify(imgData));
          const url = `${apiURL}/${res.path}`;
          this.setState({
            imageCropPreview: `${apiURL}/${res.path}?${date}`,
          });
        }
      });
    this.setState({
      recropImage: false,
    });
  }

  recropImage(e) {
    this.setState({
      recropImage: true,
    });
    this.getAllChildNodes();
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

  /*
    Function to switch between Cropper and preview
  */

  cropperToggle(e) {
    if (this.state.recropImage) {
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
            scalable
            ref="cropper"
            movable
            wheelZoomRatio={this.state.scale}
            zoomOnWheel
            cropBoxMovable={false}
            cropBoxResizable
            crop={this._cropCover.bind(this)}
            dragMode="move"
            toggleDragModeOnDblclick={false}
          />
          <input
            name="scale"
            type="range"
            onChange={this.handleScale.bind(this)}
            max="800"
            min="200"
            step={200 / 10}
            defaultValue="300"
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

  render() {
    const cropperToggle = this.cropperToggle();
    return (
      <div className="imgCrop-section parentSection no-drag drag-event image">
        <div className="childSection1 no-drag drag-event sub-header image">
          <h6 className="no-drag drag-event image">Image Collection Crop</h6>
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
        <div className="childsection2 no-drag imgCrop-wapper">
          <div className="col-xs-16 col-md-6 left-section no-drag">
            <h4 className="no-drag drag-event">Image Creation</h4>
            {cropperToggle}
          </div>
          <div className="col-xs-16 col-md-6 right-section no-drag drag-event">
            <h4 className="no-drag drag-event">Preview</h4>
            <div className="lg-img no-drag drag-event">
              <div className="img-section no-drag drag-event">
                <img src={this.state.imageCropPreview} className="no-drag drag-event" />
              </div>
              <div className="button-section pull-right no-drag drag-event">
                <p className="no-drag drag-event">Image Collection</p>
                <button
                  className="btn cancelBtn recrop-button no-drag drag-event"
                  id={this.props.ID}
                  data-title="Gallery Image"
                  onClick={
                    this.state.recropImage
                      ? this.doneImageCrop.bind(this)
                      : this.recropImage.bind(this)
                  }
                >
                  {this.state.recropImage ? 'Save' : 'Recrop'}
                </button>
              </div>
            </div>
            <button
              className="btn cancelBtn green-button pull-right no-drag drag-event"
              onClick={this.props.nextChange}
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
  const PhotoCrop = state;
  return { PhotoCrop };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoCrop);
