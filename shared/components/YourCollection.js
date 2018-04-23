import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

class YourCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgcolor: '',
      yourCollectionIcons: [
        {
          id: 1,
          src: '../assets/images/user-profile/paragraph.png',
          tool_tip: 'Bookmarks',
        },
        {
          id: 2,
          src: '../assets/images/user-profile/feeds.png',
          tool_tip: 'Feeds',
        },
        {
          id: 3,
          src: '../assets/images/user-profile/notes.png',
          tool_tip: 'Notes',
        },
        {
          id: 4,
          src: '../assets/images/user-profile/highlights.png',
          tool_tip: 'Highlighs',
        },
      ],
    };
  }

  change_color(data) {
    this.setState({ bgcolor: data });
  }
  render() {
    return (
      <div className="sidebar1-1">
        <div className="row no_margin yourCollection_Heading">
          <div className="col-sm-8 no_padding padding_left">
            <p className="text no_padding">Your Collection</p>
          </div>
          <div className="col-sm-4 quick-icon">
            <div className="reset" data-toggle="tooltip" data-placement="top" title="Turn Button">
              <img src="../assets/images/sidebar_icons/reset.png" onClick={this.props.toggleMe} />
            </div>
          </div>
        </div>
        <div className="row no_margin">
          {this.state.yourCollectionIcons.map((data, i) =>
            (<div
              key={i}
              className={
                this.state.bgcolor == data
                  ? 'col-sm-6 no_padding yourCollection_data bg_color'
                  : 'col-sm-6 no_padding yourCollection_data'
              }
              onClick={this.change_color.bind(this, data)}
            >
              <img
                src={data.src}
                className="yourCollection-icons"
                aria-hidden="true"
                data-toggle="tooltip"
                data-placement="top"
                title={data.tool_tip}
              />
              <span className="yourCollection-subtitles">
                {data.tool_tip}
              </span>
            </div>),
          )}
        </div>
      </div>
    );
  }
}

export default YourCollection;
