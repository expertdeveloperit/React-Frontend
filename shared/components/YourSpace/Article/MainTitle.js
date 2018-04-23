import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import variables from '../../../../variables';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class MainTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditMainTitle: false,
      mainTitle: '',
      localData: '',
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentDidMount() {
    const fetchData = JSON.parse(localStorage.getItem('mainTitle'));
    if (fetchData !== '') {
      this.setState({
        localData: fetchData,
        mainTitle: fetchData,
      });
    }
  }

  // handler to open edit maintitle form
  handleOpenMainTitle() {
    const test = this.state.check_opened_module();
    if (test) {
      this.setState({ showEditMainTitle: !this.state.showEditMainTitle });
    }
  }

  // handler to handle input to update state value
  handleMainTitleInput(e) {
    this.setState({ mainTitle: e.target.value });
  }

  // handler to cancel edit main title
  handleCancel() {
    this.setState({
      showEditMainTitle: !this.state.showEditMainTitle,
      mainTitle: this.state.localData,
    });
  }

  grapCookieValue() {
    const cookies = new Cookies();
    const token_val = cookies.get('risorsoLoggedIn');
    return token_val;
  }

  // handler to submit edit form
  submitMainTitleForm(e) {
    e.preventDefault();
    const mainTitle = this.state.mainTitle;
    if (mainTitle == null) {
      toast.error('Article must have a Title!!', { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    this.setState({
      mainTitle,
      localData: mainTitle,
      showEditMainTitle: !this.state.showEditMainTitle,
    });
    const token_val = this.grapCookieValue();
    // calling action here
    localStorage.setItem('mainTitle', JSON.stringify(mainTitle));
  }

  // display html acc to state value
  openMainTitleForm() {
    if (this.state.showEditMainTitle) {
      return (
        <form onSubmit={this.submitMainTitleForm.bind(this)} className="opened">
          <div className="form-group">
            <input
              type="text"
              autoFocus
              value={this.state.mainTitle ? this.state.mainTitle : ''}
              onChange={this.handleMainTitleInput.bind(this)}
              type="text"
              className="form-control maintitle"
              name="mainTitle"
              placeholder="Main Title..."
              maxLength="150"
            />
          </div>
          <div className="text-right">
            <button className="cancelBtn contentBtnForHover" onClick={this.handleCancel.bind(this)}>
              Cancel
            </button>
            <input
              type="submit"
              name="AboutUs_submit"
              value="Save"
              className="submit_button append-margin contentBtnForHover"
              onClick={this.submitMainTitleForm.bind(this)}
            />
          </div>
        </form>
      );
    }
    return (
      <p className="maintitle_content">
        {this.state.localData}
      </p>
    );
  }

  // :117 class "col-md-12" removed for no reason

  render() {
    const openMainTitleForm = this.openMainTitleForm();
    return (
      <div className="parentSection">
        <div className="childSection1 sub-header">
          <div className="">
            <h6>
              Main Title <span> * </span>
            </h6>
            <ul className="text-muted pull-right">
              <li>
                <img
                  src="../assets/images/user-profile/article-icon-1.png"
                  onClick={this.handleOpenMainTitle.bind(this)}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                  className={this.state.showEditMainTitle ? 'opened' : ''}
                />
              </li>
            </ul>
          </div>
        </div>
        <div className="childsection2">
          {openMainTitleForm}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const MainTitle = state;
  return { MainTitle };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(MainTitle);
