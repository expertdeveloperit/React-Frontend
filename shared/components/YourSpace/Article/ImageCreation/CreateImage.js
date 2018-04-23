import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

class CreateImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
  }

  componentDidMount() {
    document.getElementById('instagram').focus();
  }

  selectImage(e) {
    let id = e.target.id,
      elem = document.getElementById(id),
      rest_elem = document.getElementsByClassName('create');
    for (let i = 0; i < rest_elem.length; i++) {
      rest_elem[i].classList.remove('current');
    }
    elem.classList.add('current');
    this.setState({
      selected: id,
    });
    const data = [
      {
        count: 1,
        type: id,
      },
    ];
    localStorage.setItem('collection', JSON.stringify(data));
    this.props.select(id);
  }

  render() {
    return (
      <div className="parentSection no-drag drag-event">
        <div className="childSection1 sub-header no-drag drag-event">
          <h6 className="no-drag drag-event">Image Creation</h6>
        </div>
        <div className="childsection2 createImage no-drag drag-event">
          <h3 className="create_style no-drag drag-event">Create an image for</h3>
          <div className="col-sm-3 share padding no-drag drag-event">
            <img
              className="create no-drag drag-event"
              src="../assets/images/select_layout/fbshare.png"
              alt="FB Share"
              id="share"
              onClick={this.selectImage.bind(this)}
            />
          </div>
          <div className="col-sm-3 timeline padding no-drag drag-event">
            <img
              className="create no-drag drag-event"
              src="../assets/images/select_layout/fbtimeline.png"
              alt="FB Timeline"
              id="timeline"
              onClick={this.selectImage.bind(this)}
            />
          </div>
          <div className="col-sm-3 instagram_parent padding no-drag drag-event">
            <img
              tabIndex="0"
              className="create no-drag drag-event"
              src="../assets/images/select_layout/instagram.jpg"
              alt="Instagram"
              id="instagram"
              onClick={this.selectImage.bind(this)}
            />
          </div>
          <div className="col-sm-3 twitter_parent no-drag drag-event">
            <img
              className="create no-drag drag-event"
              src="../assets/images/select_layout/twitter.png"
              alt="Twitter"
              id="twitter"
              onClick={this.selectImage.bind(this)}
            />
          </div>
        </div>
        <div className="text-right next_button no-drag drag-event">
          <button
            className="btn btn-success green-button no-drag drag-event"
            onClick={this.props.nextChange}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const CreateImage = state;
  return { CreateImage };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateImage);
