import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import variables from '../../../../variables';
import Cropper from 'react-cropper';
import { downloadSelected } from '../../../actions/YourSpace_actions/from_another_resource_actions';

const apiURL = variables.url.localURL;

class FromAnotherResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedarticle: this.props.savedarticle,
      image: false,
      description: false,
      next: 1,
      imgName: '',
      move: false,
      titleInput: '',
      descriptionInput: '',
      addressUrl: '',
      callProp: this.props.callRender,
      // states for data retrieved from external URL
      urlImages: [],
      selectedImg: '',
      activateLoader: true,
      error: false,
      enableCrop: false,
      blob: '',
      des: '',
      host: '',
    };
  }

  next() {
    this.setState({ next: this.state.next + 1 });
  }

  componentDidMount() {
    if (this.props.value != undefined) {
      this.setState({ addressUrl: this.props.value.externalUrl });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      if (nextProps.ArticleHeader.relatedArticleData) {
        if (nextProps.ArticleHeader.relatedArticleData.result) {
          if (nextProps.ArticleHeader.relatedArticleData.result.status) {
            this.setState({
              croppedUrl: `${apiURL}/${nextProps.ArticleHeader.relatedArticleData.result.path}`,
            });
          }
        }
      }
    }
  }

  pasteUrl(e) {
    let clipboardData;

    document.addEventListener('paste', (e) => {
      clipboardData = e.clipboardData || window.clipboardData || e.originalEvent.clipboardData;
    });
    e.preventDefault();
  }

  inputUrl(e) {
    this.setState({ addressUrl: e.target.value });
  }

  retrieveURL(e) {
    const addressUrl = this.state.addressUrl;
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    this.setState({ urlImages: '', activateLoader: true });
    if (addressUrl == '') {
      toast.error('Add URL Address', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    const backendUrl = `${apiURL}/api/otherArticle`;
    fetch(backendUrl, {
      method: 'post',
      headers: {
        Accept: 'application/json , text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token_val}`,
      },
      body: JSON.stringify({ url: addressUrl }),
    })
      .then(response => response.json())
      .then((res) => {
        if (res.status == true) {
          let urlImages = [];
          let selectedImg;
          urlImages = res.data.imgs.slice(0, 6);
          selectedImg = res.data.imgs.slice(0, 1);
          this.setState({
            activateLoader: false,
            urlImages,
            selectedImg,
            des: res.data.des,
            croppedUrl: `${apiURL}/${res.data.default_image}`,
            host: res.data.host,
          });
        } else {
          toast.error(`${res.error}!! Try again`, { position: toast.POSITION.TOP_CENTER });
          this.setState({
            error: true,
            next: 1,
          });
          return false;
        }
      })
      .catch((err) => {
        toast.error('Not a valid URL!! Try Again', { position: toast.POSITION.TOP_CENTER });
        this.setState({
          next: 1,
        });
        return false;
      });
    this.setState({ next: 2 });
    return true;
  }

  handleTitleInput(e) {
    const titleInput = e.target.value;
    this.setState({ titleInput });
  }

  submitAnotherResource(e) {
    e.preventDefault();
    const titleInput = this.state.titleInput;
    const des = this.state.des;
    const host = this.state.host;
    const elem = document.getElementById('descriptionOtherArticle');
    const descriptionInput = elem.innerHTML;
    this.setState({ descriptionInput });
    if (titleInput == '' || descriptionInput == '') {
      toast.error('Enter Details for your article!', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    const addressUrl = this.state.addressUrl;
    const imgName = this.state.selectedImg;

    if (JSON.parse(localStorage.getItem('article_data')) == null) {
      var newData = [
        {
          id: this.props.ID,
          type: 'relatedArticle',
          fromAnotherResource: {
            externalUrl: addressUrl,
            title: titleInput,
            description: descriptionInput,
            image: imgName,
            host: this.state.host,
            des,
          },
          rank: this.props.list.length,
        },
      ];
      localStorage.setItem('article_data', JSON.stringify(newData));
    } else {
      let check = false;
      const localData = JSON.parse(localStorage.getItem('article_data'));
      localData.map((data) => {
        if (e.target.dataset.id == data.id) {
          // pending
          data.id = data.id;
          data.type = 'relatedArticle';
          data.fromAnotherResource = {
            externalUrl: addressUrl,
            title: titleInput,
            description: descriptionInput,
            image: imgName,
            host: this.state.host,
            des,
          };
          data.rank = data.rank;
          check = true;
        }
      });
      if (check) {
        localStorage.setItem('article_data', JSON.stringify(localData));
      } else {
        this.state.callProp(); /* props calling is pending yet */
        let temp = {};
        temp = localData;
        var newData = {
          id: this.props.ID,
          type: 'relatedArticle',
          fromAnotherResource: {
            externalUrl: addressUrl,
            title: titleInput,
            description: descriptionInput,
            image: imgName,
            host: this.state.host,
            des,
          },
          rank: this.props.list.length,
        };
        temp.push(newData);
        localStorage.setItem('article_data', JSON.stringify(temp));
      }
    }
    // this.state.callProp(); /* adding state pending */
    this.state.savedarticle();
    this.state.callProp();
  }

  moveToDescription(e) {
    this.setState({ next: 3 });
    return true;
  }

  handleCancel(e) {
    if (this.props.value != undefined) {
      this.setState({
        addressUrl: this.props.value.externalUrl,
        titleInput: this.props.value.title,
        selectedImg: this.props.value.image,
      });
      this.state.savedarticle();
    } else {
      this.props.callRender();
    }
  }

  getUrlImage(e) {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const index = e.target.id;
    const selected = this.state.urlImages.filter((data, id) => id == index);
    const url = selected[0];
    fetch(`${apiURL}/api/otherArticle/download`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${token_val}`,
      },
      body: JSON.stringify({
        url,
      }),
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          if (res.status === true) {
            this.setState({
              croppedUrl: `${apiURL}/${res.path}`,
            });
          } else {
            toast.error(res.message, { position: toast.POSITION.TOP_CENTER });
          }
        }
      })
      .catch(err => toast.error(err, { position: toast.POSITION.TOP_CENTER }));
    this.setState({ selectedImg: selected });
  }

  Address1() {
    this.setState({ next: 1 });
  }

  Image2(e) {
    if (this.state.addressUrl == '') {
      toast.error('Please add URL', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    this.retrieveURL(e);
    this.setState({ next: 2 });
    return true;
  }

  Description3(e) {
    if (this.state.selectedImg) {
      this.setState({ next: 3 });
      return true;
    }
    toast.error('Please add URL', { position: toast.POSITION.TOP_CENTER });
    return false;
  }

  handleDescriptionInput(e) {
    const descriptionInput = e.target.innerHTML;
    this.setState({ descriptionInput });
  }

  enableCrop() {
    this.setState({ enableCrop: true });
    this.setState({ previousImg: this.state.selectedImg });
    this.getAllChildNodes();
  }

  cropImage(files) {
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

  doneCrop() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    const blob = this.state.blob;
    let fileName = '';
    const type = 'image/png';
    const data = new FormData();
    const date = new Date();

    fileName = `galleryimage${this.props.ID}.png`;
    const file = new File([blob], fileName, { type });
    data.append('article_images', file);

    const apiURL = variables.url.localURL;
    fetch(`${apiURL}/api/article/upload/images`, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, multipart/formdata, *',
        Authorization: `Bearer ${token_val}`,
        enctype: 'multipart/formdata',
      },
      body: data,
    })
      .then(res => res.json())
      .then((res) => {
        if (typeof res === 'object') {
          this.setState({
            selectedImg: `${apiURL}/${res.path}?${date}`,
          });
        }
      });
    this.setState({
      enableCrop: false,
    });
  }

  getAllChildNodes() {
    setTimeout(() => {
      // Start the timer
      const mydiv = document.getElementById('cropOtherImg');
      const drag = mydiv.getElementsByTagName('*');
      for (let i = 0; i < drag.length; i++) {
        drag[i].classList.add('no-drag');
      }
    }, 500);
  }

  renderData() {
    if (this.state.next == 1) {
      return (
        <div className="address-related-article text-right no-drag drag-event">
          <form className="no-drag drag-event opened">
            <input
              autoFocus
              data-id={this.props.ID}
              className="form-control no-drag drag-event"
              type="text"
              name="addressOfRelatedArticle"
              placeholder="Address of The Related Article"
              value={this.state.addressUrl}
              onChange={this.inputUrl.bind(this)}
            />
            <button
              className="btn post-btn no-drag drag-event"
              data-id={this.props.ID}
              onClick={this.pasteUrl.bind(this)}
            >
              Paste
            </button>
          </form>
          <button
            className="submit_button contentBtnForHover no-drag drag-event"
            data-id={this.props.ID}
            onClick={this.retrieveURL.bind(this)}
          >
            Next
          </button>
        </div>
      );
    } else if (this.state.next == 2) {
      if (this.state.selectedImg[0]) {
        const imgName = this.state.selectedImg[0].split('/');
        var imageName = imgName.slice(-1);
      }

      let width;
      if (this.state.enableCrop) {
        let width = '';
        let max = '';
        const elem = document.getElementsByClassName('cropper-canvas');
        setTimeout(() => {
          const mydiv = document.getElementById('cropOtherImg');
          const drag = mydiv.getElementsByTagName('*');
          for (let i = 0; i < drag.length; i++) {
            drag[i].classList.add('no-drag');
          }
          const childNode = elem[0].firstChild.width;
          width = childNode;
          max = width * 1000;
        }, 1000);
      }
      return (
        <div className="no-drag drag-event opened">
          {this.state.activateLoader
            ? <div className="loader no-drag drag-event">
              <div className="loader_in_anotherResource no-drag drag-event" />
            </div>
            : <div className="text-right no-drag drag-event">
              <div className="col-sm-6 no-drag drag-event">
                <div className="resource_img no-drag drag-event">
                  {this.state.urlImages == ''
                      ? <img
                        className="no-drag drag-event"
                        src="../assets/images/no-image-available.png"
                        alt="no img available"
                      />
                      : <div className="no-drag drag-event cropOtherImg">
                        {this.state.enableCrop
                            ? <div className="no-drag drag-event" id="cropOtherImg">
                              <Cropper
                                src={this.state.croppedUrl ? this.state.croppedUrl : ''}
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
                                crop={this.cropImage.bind(this)}
                                dragMode="move"
                                toggleDragModeOnDblclick={false}
                              />
                              <input
                                name="scale"
                                type="range"
                                onChange={this.handleScale.bind(this)}
                                max={18000}
                                min={0}
                                step={width / 100}
                                defaultValue={width}
                                className="slider no-drag drag-event"
                              />
                            </div>
                            : <img
                              className="no-drag drag-event"
                              src={this.state.selectedImg}
                              alt="selected img"
                            />}
                      </div>}
                </div>
                <div className="no-drag drag-event crop_button_div">
                  <button
                    className={
                        this.state.enableCrop
                          ? 'no-drag drag-event cancelBtn relArt_cropBtn doneColor contentBtnForHover'
                          : 'no-drag drag-event cancelBtn relArt_cropBtn contentBtnForHover'
                      }
                    onClick={
                        this.state.enableCrop
                          ? this.doneCrop.bind(this)
                          : this.enableCrop.bind(this)
                      }
                  >
                    {this.state.enableCrop ? 'Save' : 'Crop'}
                  </button>
                </div>
              </div>
              <div className="col-sm-6 text-left fromAnotherResource_images no-drag drag-event">
                <div className="row no-drag drag-event">
                  <div className="gallery-heading no-drag drag-event">
                    {imageName || ''}
                  </div>

                  {this.state.urlImages != ''
                      ? this.state.urlImages.slice(0, 6).map((img, i) =>
                        (<div
                          key={i}
                          className={
                              this.state.selectedImg == img
                                ? 'urlImages no-drag drag-event border_colorImage'
                                : 'urlImages no-drag drag-event'
                            }
                        >
                          <img
                            id={i}
                            onClick={this.getUrlImage.bind(this)}
                            className="img-responsive no-drag drag-event"
                            src={img}
                          />
                        </div>),
                        )
                      : <div className="no_img_available no-drag drag-event">
                          No Image Available From Requested URL
                        </div>}

                  <label className="container-warpper no-drag drag-event" />
                </div>
              </div>
              <div className="select-img-nextBtn no-drag drag-event">
                <button
                  className="submit_button contentBtnForHover no-drag drag-event"
                  data-id={this.props.ID}
                  onClick={this.moveToDescription.bind(this)}
                >
                    Next
                  </button>
              </div>
            </div>}
        </div>
      );
    } else if (this.state.next == 3) {
      setTimeout(() => {
        const childNodes = document.getElementById('descriptionOtherArticle').childNodes;
        if (childNodes.length > 0) {
          for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType != Node.TEXT_NODE) {
              childNodes[i].removeAttribute('style');
            }
          }
        }
      }, 10);
      let e;
      return (
        <div className="description-section no-drag drag-event opened">
          <div className="col-sm-6 text-center no-drag drag-event">
            {this.state.selectedImg == ''
              ? <div className="no-desc-img">
                <img
                  className="no-drag drag-event"
                  src="../assets/images/no-image-available.png"
                />
              </div>
              : <div className="description-img">
                <img className="no-drag drag-event" src={this.state.selectedImg} />
              </div>}
          </div>
          <div className="col-sm-6 description-section tatel-here no-drag drag-event">
            <form className="no-drag drag-event">
              <input
                data-id={this.props.ID}
                className="form-control no-drag drag-event"
                type="text"
                placeholder="Title Here"
                name="imageTitle"
                value={this.state.titleInput}
                onChange={this.handleTitleInput.bind(this)}
              />
              <div className="test">
                <div
                  id="descriptionOtherArticle"
                  data-relatedArticle="Description Here"
                  data-id={this.props.ID}
                  className="placeholder_height mainInp no-drag drag-event addDrag"
                  contentEditable
                  autoFocus
                  onChange={this.handleDescriptionInput.bind(this)}
                  dangerouslySetInnerHTML={{ __html: this.state.descriptionInput }}
                />
              </div>
              {/* <textarea
                data-id={this.props.ID}
                id="demo_textarea"
                className="form-control placeholder_height no-drag drag-event"
                rows="5"
                placeholder="Description Here"
                name="imgDescription"
                value={this.state.descriptionInput}
                onChange={this.handleDescriptionInput.bind(this)}
              /> */}
            </form>
          </div>
          <div className="text-right from-another-section no-drag drag-event col-md-12">
            <button
              className="cancelBtn contentBtnForHover no-drag drag-event"
              onClick={this.handleCancel.bind(this)}
            >
              Cancel
            </button>
            <input
              data-id={this.props.ID}
              type="submit"
              name="relatedArticle_submit"
              value="Save"
              className="submit_button append-margin contentBtnForHover no-drag drag-event"
              onClick={this.submitAnotherResource.bind(this)}
            />
          </div>
        </div>
      );
    }
    return false;
  }

  render() {
    const renderData = this.renderData();
    return (
      <div>
        <div className="resourceProcess text-center no-drag drag-event">
          <ul>
            <li
              className={
                this.state.next == 1 ? 'colorChange no-drag drag-event' : 'no-drag drag-event'
              }
              onClick={this.Address1.bind(this)}
            >
              <span>1</span>Address
            </li>
            <li
              className={
                this.state.next == 2 ? 'colorChange no-drag drag-event' : 'no-drag drag-event'
              }
              onClick={this.Image2.bind(this)}
            >
              <span>2</span>Image
            </li>
            <li
              className={
                this.state.next == 3 ? 'colorChange no-drag drag-event' : 'no-drag drag-event'
              }
              onClick={this.Description3.bind(this)}
            >
              <span>3</span>Description
            </li>
          </ul>
        </div>
        <div className="fromAnotherResource_content no-drag drag-event">
          {renderData}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const fromAnotherResource = state;
  return { fromAnotherResource };
}

function mapDispatchToProps(dispatch, props) {
  return {
    downloadSelected: (token_val, selected) => {
      dispatch(downloadSelected(token_val, selected));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FromAnotherResource);
