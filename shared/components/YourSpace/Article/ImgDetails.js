// Component For adding details for image tag.

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';

class ImgDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewUrl: '',
      changePreview: this.props.ChangePreview,
      galleryPreview: '',
      callProp: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentDidMount() {
    const cardImg = JSON.parse(localStorage.getItem('cardImg')),
      galleryImg = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`)),
      featuring_data = JSON.parse(localStorage.getItem('featuring_data')),
      article_data = JSON.parse(localStorage.getItem('article_data'));

    if (this.props.from == 'photo') {
      if (cardImg) {
        this.setState({
          imagePreviewUrl: cardImg[0].url,
        });
      } else {
        this.setState({
          imagePreviewUrl: '../assets/images/no-image-available.png',
        });
      }
    }
    if (this.props.from == 'image') {
      if (galleryImg) {
        this.setState({
          galleryPreview: galleryImg[0].url,
        });
        if (article_data != null) {
          article_data.map((data) => {
            if (data.id == this.props.ID) {
              this._imgTitle.value = data.title;
              this._imgDiscription.value = data.discription;
              this._imgOwner.value = data.owner;
              this._imgUrl.value = data.url;
            }
          });
        }
      } else {
        this.setState({
          galleryPreview: '../assets/images/no-image-available.png',
        });
      }
      // this.props.setRender();
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.props.from == 'photo') {
      var imgFeaturing = true;
      const newData = [
        {
          id: this.props.ID,
          type: 'photo',
          imgurl: this.state.imagePreviewUrl,
          featuring: imgFeaturing,
        },
      ];
      localStorage.setItem('featuring_data', JSON.stringify(newData));
    }
    if (this.props.from == 'image') {
      let imgTitle = this._imgTitle.value,
        imgDiscription = this._imgDiscription.value,
        imgOwner = this._imgOwner.value,
        imgUrl = this._imgUrl.value;
      const localArticleData = JSON.parse(localStorage.getItem('article_data'));
      let check = false;
      const url = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`));
      if (localArticleData) {
        const update = localArticleData.map((data) => {
          if (e.target.id == data.id) {
            data.id = data.id;
            data.type = 'photo';
            data.imgurl = url[0].url;
            data.title = imgTitle;
            data.discription = imgDiscription;
            data.owner = imgOwner;
            data.url = imgUrl;
            data.rank = data.rank;
            check = true;
          }
        });

        if (check) {
          localStorage.setItem('article_data', JSON.stringify(localArticleData));
        } else {
          let temp = {};
          temp = localArticleData;
          const newData = {
            id: this.props.ID,
            type: 'photo',
            imgurl: this.state.galleryPreview,
            title: imgTitle,
            discription: imgDiscription,
            owner: imgOwner,
            url: imgUrl,
            rank: this.props.list.length,
          };
          temp.push(newData);
          localStorage.setItem('article_data', JSON.stringify(temp));
        }
      } else {
        const newData = [
          {
            id: this.props.ID,
            type: 'photo',
            imgurl: this.state.galleryPreview,
            title: imgTitle,
            discription: imgDiscription,
            owner: imgOwner,
            url: imgUrl,
            featuring: imgFeaturing,
            rank: this.props.list.length,
          },
        ];
        localStorage.setItem('article_data', JSON.stringify(newData));
      }
      if (imgTitle == '' || imgDiscription == '' || (imgOwner == '' || imgUrl == '')) {
        toast.error("Photo Fields can't be empty", { position: toast.POSITION.TOP_CENTER });
        return false;
      }
    }

    this.state.changePreview();
  }

  render() {
    const imageUrl = this.state.imagePreviewUrl;
    if (this.props.from == 'photo') {
      return (
        <div className="imgdetails-section parentSection opened">
          <div className="childSection1 no-drag sub-header">
            <div className="">
              <h6 className="no-drag drag-event">
                Featuring Image <span> * </span>
              </h6>
              <ul className="image-uplode-top-bar">
                <li onClick={this.props.setUpload}>
                  <span className="Image-up" />Upload Image
                </li>
                <li onClick={this.props.setCrop}>
                  <span className="Crop" />Crop
                </li>
                <li className="active" onClick={this.props.setDetails}>
                  <span className="Details" />Details
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag imgCrop-wapper img-Details detailsNew">
            <div className="col-xs-16 col-md-6 left-section padding_right_only">
              <img src={imageUrl} />
            </div>
            <div className="col-xs-16 col-md-6 right-section padding_left_only detailsNewButton">
              <div className="text-right">
                <button className="cancelBtn contentBtnForHover" onClick={this.props.cancel}>
                  Cancel
                </button>
                <button
                  id={this.props.ID}
                  className="append-margin submit_button contentBtnForHover"
                  onClick={this.handleSubmit.bind(this)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (this.props.from == 'image') {
      const date = new Date();
      return (
        <div className="imgdetails-section parentSection no-drag drag-event opened">
          <div className="childSection1 no-drag sub-header no-drag drag-event">
            <div className="">
              <h6>Image</h6>
              <ul className="image-uplode-top-bar no-drag drag-event">
                <li className="no-drag drag-event" onClick={this.props.setUpload}>
                  <span className="Image-up no-drag drag-event" />Upload Image
                </li>
                <li className="no-drag drag-event" onClick={this.props.setCrop}>
                  <span className="Crop no-drag drag-event" />Crop
                </li>
                <li className="active no-drag drag-event" onClick={this.props.setDetails}>
                  <span className="Details no-drag drag-event" />Details
                </li>
              </ul>
              <ul className="text-muted pull-right no-drag drag-event">
                <li>
                  <img
                    className="no-drag drag-event"
                    src="../assets/images/user-profile/article-icon-2.png"
                    onClick={this.props.delete}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag drag-event imgCrop-wapper">
            <div className="col-xs-16 col-md-6 padding_right_only left-section no-drag drag-event">
              <img className="no-drag drag-event" src={`${this.state.galleryPreview}?${date}`} />
            </div>
            <div className="col-xs-16 col-md-6  padding_left_only right-section no-drag drag-event">
              <form onSubmit={this.handleSubmit.bind(this)} className="no-drag drag-event">
                <input
                  type="text"
                  className="form-control no-drag drag-event"
                  placeholder="Title Here"
                  ref={input => (this._imgTitle = input)}
                />
                <input
                  type="text"
                  className="form-control no-drag drag-event"
                  placeholder="Discription Here"
                  ref={input => (this._imgDiscription = input)}
                />
                <input
                  type="text"
                  className="form-control no-drag drag-event"
                  placeholder="Who Is The Owner of This Image?"
                  ref={input => (this._imgOwner = input)}
                />
                <input
                  type="text"
                  className="form-control no-drag drag-event"
                  placeholder="Original URL"
                  ref={input => (this._imgUrl = input)}
                />
              </form>
              <div className="text-right no-drag drag-event">
                <button
                  className="cancelBtn contentBtnForHover no-drag drag-event"
                  onClick={this.props.cancel}
                >
                  Cancel
                </button>
                <button
                  id={this.props.ID}
                  className="append-margin submit_button contentBtnForHover no-drag drag-event"
                  onClick={this.handleSubmit.bind(this)}
                >
                  Save
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
  const ImgDetails = state;
  return { ImgDetails };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ImgDetails);
