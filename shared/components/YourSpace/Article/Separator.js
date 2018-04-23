import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import { Redirect } from 'react-router-dom';

class Separator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callProp: this.props.callRender,
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentDidMount() {
    if (this.props.open) {
      this.saveSeperator();
    }
  }

  saveSeperator() {
    const localData = JSON.parse(localStorage.getItem('article_data'));
    if (localData == null) {
      var newData = [
        {
          id: this.props.ID,
          type: 'seperator',
          content: 'seperator',
          rank: this.props.list.length,
        },
      ];
      localStorage.setItem('article_data', JSON.stringify(newData));
    } else {
      this.state.callProp();
      let temp = {};
      temp = localData;
      var newData = {
        id: this.props.ID,
        type: 'seperator',
        content: 'seperator',
        rank: this.props.list.length,
      };
      temp.push(newData);
      localStorage.setItem('article_data', JSON.stringify(temp));
    }
    this.state.callProp();
  }

  render() {
    return (
      <div className="parentSection no-drag drag-event">
        <div className="childSection1 sub-header text-center no-drag drag-event">
          <h6 className="no-drag drag-event">Separator</h6>
          <ul className="text-muted pull-right no-drag drag-event">
            <li className="no-drag drag-event">
              <img
                className="no-drag drag-event"
                id={this.props.ID}
                src="../assets/images/user-profile/article-icon-2.png"
                onClick={this.props.delete}
              />
            </li>
            <li className="no-drag drag-event">
              <img
                className="no-drag drag-event"
                onMouseDown={this.props.removeNoDrag}
                onMouseUp={this.props.addNoDrag}
                src="../assets/images/user-profile/article-icon-3.png"
              />
            </li>
          </ul>
        </div>
        <div className="childsection2 no-drag drag-event">
          <div className="article_separator">
            <img
              className="no-drag drag-event"
              src="../assets/images/separator.png"
              alt="separator"
            />
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const separator = state;
  return { separator };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Separator);
