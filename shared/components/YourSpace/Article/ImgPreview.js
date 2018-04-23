import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class ImgPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverImg: '',
      featuringData: '',
      galleryImage: '',
      gallery_data: '',
      dynamicValues: {},
      callRender: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentWillMount() {
    if (this.props.from == 'photo') {
      const localData = JSON.parse(localStorage.getItem('coverImg'));
      const featuringData = JSON.parse(localStorage.getItem('featuring_data'));
      this.setState({
        coverImg: localData,
        featuringData,
      });
    }
    if (this.props.from == 'image') {
      const gallery_data = JSON.parse(localStorage.getItem('article_data'));
      gallery_data.map((data) => {
        if (data.id == this.props.ID) {
          this.setState({ galleryImage: data });
        }
      });

      // let localData = JSON.parse(localStorage.getItem(`gallery${this.props.ID}`)),
      //   gallery_data = JSON.parse(localStorage.getItem('article_data'));
      // gallery_data.map((data) => {
      //   if (data.type == 'photo') {
      //     const temp = {
      //       ...this.state.dynamicValues,
      //       [`gallery_data${data.id}`]: data,
      //     };
      //     this.setState({
      //       dynamicValues: temp,
      //     });
      //   }
      // });
      // this.setState({
      //   galleryImage: localData[0].url,
      // });

      // this.state.callRender();
    }
  }

  componentDidMount() {
    // this.state.callRender();
  }

  load(e) {}

  render() {
    if (this.props.from == 'photo') {
      return (
        <div className="imgPreview-section parentSection no-drag drag-event photo">
          <div className="childSection1 no-drag drag-event sub-header photo">
            <div className="no-drag drag-event">
              <h6 className="no-drag drag-event">Featuring Image</h6>
              <ul className="text-muted pull-right no-drag drag-event">
                <li className="photo">
                  <img
                    className="no-drag drag-event photo"
                    id={this.props.ID}
                    src="../assets/images/user-profile/article-icon-1.png"
                    onClick={this.props.handleOpenParagraph}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Edit"
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="childsection2 no-drag drag-event previewFeaturing">
            <img src={this.state.coverImg[0].url} className="img fullWidth photo" />
          </div>
        </div>
      );
    } else if (this.props.from == 'image') {
      const date = new Date();
      const testy = `gallery_data${this.props.ID}`;
      const data = this.state.dynamicValues[testy];
      return (
        <div className="imgPreview-section parentSection no-drag drag-event image">
          <div className="childSection1 no-drag drag-event sub-header">
            <h6 className="no-drag drag-event">Image</h6>
            <ul className="text-muted pull-right no-drag drag-event">
              <li className="no-drag drag-event image">
                <img
                  className="no-drag drag-event image"
                  id={this.props.ID}
                  src="../assets/images/user-profile/article-icon-1.png"
                  onClick={this.props.handleOpenParagraph}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                />
                <span className=" no-drag drag-event">&nbsp;</span>
              </li>
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
              <li className="no-drag drag-event">
                <img
                  className="no-drag drag-event"
                  id={this.props.ID}
                  src="../assets/images/user-profile/article-icon-3.png"
                  onMouseDown={this.props.removeNoDrag}
                  onMouseUp={this.props.addNoDrag}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Drag"
                />
              </li>
            </ul>
          </div>
          <div className="childsection2 no-drag drag-event previewFeaturing">
            <div className="previewImage">
              <img
                src={`${this.state.galleryImage.imgurl}?${date}`}
                className="img fullWidth no-drag drag-event image"
                onLoad={this.load.bind(this)}
              />
            </div>
            <p>
              <span className="featuringDescription featuring text-muted no-drag drag-event image">
                {this.state.galleryImage.discription}
              </span>
            </p>
            <p>
              <span className="featuringOwner featuring text-muted no-drag drag-event image">
                {this.state.galleryImage.owner} via&nbsp;
              </span>
              <div className="featuringUrl featuring no-drag drag-event image">
                <a href={this.state.galleryImage.url}>
                  {this.state.galleryImage.url}
                </a>
              </div>
            </p>
          </div>
        </div>
      );
    }
  }
}

export default ImgPreview;
// {this.state.gallery_data[0].discription}
// {this.state.gallery_data[0].owner} via{' '}
// {this.state.gallery_data[0].url}
