import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

class SubTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditSubTitle: false,
      subtitle: '',
      previousSubTitle: '',
      localData: [],
      callProp: this.props.callRender,
      subColor: '',
      myParent: '',
      child_id: [],
      child_Ids: '',
      my_id: '',
      check_opened_module: this.props.check_opened_module,
    };
  }

  componentWillMount() {
    const maintitle = JSON.parse(localStorage.getItem('mainTitle'));
    this.setState({ maintitle });
  }

  /*
    Function handleOpenSubTitle(e) is used to maintain the stability for editting mode of component.
  */
  handleOpenSubTitle(e) {
    const test = this.state.check_opened_module();
    const value = this.props.value;
    if (test) {
      this.setState({
        subtitle: value,
        showEditSubTitle: true,
      });
    }

    this.setState({ my_id: this.props.ID });
  }

  /*
    Function submitSubtitle(e) is used to handle the submit action of paragraph when clicked on save.
  */
  submitSubtitle(e) {
    e.preventDefault();
    const subtitle = this.state.subtitle;
    if (subtitle == '') {
      toast.error("Field can't be empty. Delete instead", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    this.setState({
      showEditSubTitle: !this.state.showEditSubTitle,
    });
    let parent_id;
    let parent_changed = false;
    if (this.state.myParent != '') {
      parent_id = this.state.myParent;
    }
    if (JSON.parse(localStorage.getItem('article_data')) == null) {
      var newData = [
        {
          id: this.props.ID,
          type: 'subtitle',
          content: subtitle,
          child_ids: [],
          rank: this.props.list.length,
        },
      ];
      localStorage.setItem('article_data', JSON.stringify(newData));
    } else {
      let check = false;
      var previous_parent;

      const localData = JSON.parse(localStorage.getItem('article_data'));

      const mapping = localData.map((data) => {
        if (e.target.id == data.id) {
          previous_parent = data.parent_id;
          data.id = data.id;
          data.type = 'subtitle';
          data.content = subtitle;
          data.parent_id = parent_id;
          data.rank = data.rank;
          check = true;
          if (previous_parent == parent_id) {
          } else {
            parent_changed = true;
          }
        }
      });
      if (check) {
        localStorage.setItem('article_data', JSON.stringify(localData));
      } else {
        this.state.callProp();
        let temp = {};
        temp = localData;
        var newData = {
          id: this.props.ID,
          type: 'subtitle',
          content: subtitle,
          child_ids: [],
          rank: this.props.list.length,
          parent_id,
        };
        temp.push(newData);
        localStorage.setItem('article_data', JSON.stringify(temp));
      }
    }

    // update child_ids array of parentSubtitle in localStoarge
    const localData = JSON.parse(localStorage.getItem('article_data'));
    localData.map((data) => {
      if (data.id == parent_id) {
        const dd = this.props.ID;

        // check for duplicate child id
        if (data.child_ids.indexOf(dd) == -1) {
          data.child_ids.push(this.props.ID);
          localStorage.setItem('article_data', JSON.stringify(localData));
        } else {
          toast.error('Already its child!!!', { position: toast.POSITION.TOP_CENTER });
          return false;
        }
      }
      // update previous parent child_ids
      if (data.id == previous_parent) {
        data.child_ids = data.child_ids.filter(data => data != this.props.ID);
        localStorage.setItem('article_data', JSON.stringify(localData));
      }
    });

    this.state.callProp();
  }

  /*
    Function handleSubtitleInput(e) is used to maintaining data when an input fields is changes.
  */
  handleSubtitleInput(e) {
    this.setState({ subtitle: e.target.value });
  }

  /*
    Function handleCancel() is used to main the stability of edit mode when cancel button is clicked.
  */
  handleCancel(e) {
    e.preventDefault();
    if (this.props.value == undefined) {
      this.props.callRender();
      // toast.error('Function not allowed.\n You can delete module.', {
      //   position: toast.POSITION.TOP_CENTER,
      // });
      // return false;
    }
    this.setState({
      showEditSubTitle: !this.state.showEditSubTitle,
    });
  }

  selectSub(data, e) {
    if (e.target.dataset.id != data.id) {
      // for changing color of selected item
      let id = e.target.id,
        elem = e.target.parentNode,
        rest_elem = document.getElementsByClassName('subList');
      for (let i = 0; i < rest_elem.length; i++) {
        rest_elem[i].classList.remove('subListColor');
      }
      elem.classList.add('subListColor');
      // color ends

      this.setState({ subColor: data });
      const selectedParentID = data.id;
      const localData = JSON.parse(localStorage.getItem('article_data'));
      this.setState({ myParent: selectedParentID });
      let child_Id;
      this.setState({ child_Ids: this.props.ID });
      e.stopPropagation();
    } else {
      toast.error("Module can't be its own child!!", { position: toast.POSITION.TOP_CENTER });
      e.preventDefault();
      e.stopPropagation();
      this.setState({ showEditSubTitle: false });
    }
  }

  notAllowed(e) {
    toast.error('Function Not Allowed!!', { position: toast.POSITION.TOP_CENTER });
    e.stopPropagation();
  }

  mainClicked() {
    toast.success('Main Title selected as parent of this module', {
      position: toast.POSITION.TOP_CENTER,
    });
    this.setState({ myParent: '' });
    const rest_elem = document.getElementsByClassName('subListColor');
    for (let i = 0; i < rest_elem.length; i++) {
      rest_elem[i].classList.remove('subListColor');
    }
    // elem.classList.add('subListColor');
  }

  /*
    Function formData() contains the html for editable form.
  */
  formData() {
    if (JSON.parse(localStorage.getItem('article_data'))) {
      var article_data = JSON.parse(localStorage.getItem('article_data'));
      var subtitleData = [];
      article_data.map((data) => {
        if (data.type == 'subtitle') {
          if (!data.parent_id) {
            subtitleData.push(data);
          }
        }
      });
    }
    return (
      <form onSubmit={this.submitSubtitle.bind(this)} className="no-drag drag-event opened">
        <div className="form-group no-drag drag-event">
          <input
            type="text"
            id={this.props.ID}
            autoFocus
            value={this.state.subtitle ? this.state.subtitle : ''}
            onChange={this.handleSubtitleInput.bind(this)}
            className="form-control mainInp no-drag drag-event"
            name="subtitle"
            placeholder="SubTitle..."
            maxLength="150"
          />
        </div>
        <div className="subtitle-list">
          <span className="sublist-which">Which title does this subtitle belong to?</span>
          <br />
          <span
            onClick={this.mainClicked.bind(this)}
            className={
              this.state.myParent != ''
                ? 'sublist-maintitle sublist-maintitle-transparent'
                : 'sublist-maintitle'
            }
          >
            {this.state.maintitle}
          </span>
          <br />
          {subtitleData == undefined
            ? <ul>
              <li>No subtitle added yet...</li>
            </ul>
            : <ul>
              {subtitleData.map((data, i) =>
                  (<li
                    data-id={this.props.ID}
                    key={i}
                    className="subList"
                    onClick={this.selectSub.bind(this, data)}
                  >
                    <span data-id={this.props.ID} data-classToggle={data.id} className="">
                      {data.content}
                    </span>

                    {data.child_ids != undefined
                      ? <ul>
                        {data.child_ids.map((child, i) => {
                          let mychild;
                          article_data.map((datak) => {
                            if (datak.id == child) {
                              mychild = datak;
                              return datak;
                            }
                          });
                          return (
                            <li
                              data-id={this.props.ID}
                              key={i}
                              onClick={this.selectSub.bind(this, mychild)}
                              className="subList"
                            >
                              <span data-id={this.props.ID}>
                                {' '}{mychild.content}{' '}
                              </span>

                              {mychild.child_ids != undefined
                                  ? <ul>
                                    {mychild.child_ids.map((grand_child, i) => {
                                      let gc;
                                      article_data.map((datal) => {
                                        if (datal.id == grand_child) {
                                          gc = datal;
                                          return gc;
                                        }
                                      });
                                      return (
                                        <li
                                          key={i}
                                          className="subList"
                                          onClick={this.notAllowed.bind(this)}
                                        >
                                          {' '}{gc.content}{' '}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  : null}
                            </li>
                          );
                        })}
                      </ul>
                      : ''}
                  </li>),
                )}
            </ul>}
        </div>
        <div className="text-right no-drag drag-event">
          <button
            id={this.props.ID}
            className="contentBtnForHover cancelBtn no-drag drag-event"
            onClick={this.handleCancel.bind(this)}
          >
            Cancel
          </button>
          <input
            id={this.props.ID}
            type="submit"
            name="AboutUs_submit"
            value="Save"
            className="submit_button append-margin contentBtnForHover saveBtn no-drag drag-event"
            onClick={this.submitSubtitle.bind(this)}
          />
        </div>
      </form>
    );
  }

  /*
    Function sbtleData() contains the html for non editable mode.
  */
  sbtleData() {
    return (
      <p className="no-drag drag-event">
        {this.props.value}
      </p>
    );
  }

  /*
    Function openSubTitle() used make the component editable or non-editable.
  */
  openSubTitle() {
    let formData = this.formData(),
      sbtleData = this.sbtleData();

    if (this.props.open || this.state.showEditSubTitle) {
      return formData;
    }
    return sbtleData;
  }

  render() {
    const openSubTitleForm = this.openSubTitle();
    return (
      <div className="parentSection no-drag drag-event" id={this.props.ID}>
        <div className="childSection1 sub-header no-drag drag-event">
          <h6 className="no-drag drag-event">Sub Title</h6>
          <ul className="text-muted pull-right no-drag drag-event">
            <li className="no-drag drag-event">
              <img
                id={this.props.ID}
                src="../assets/images/user-profile/article-icon-1.png"
                onClick={this.handleOpenSubTitle.bind(this)}
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
                className={
                  this.state.showEditSubTitle ? 'no-drag drag-event opened' : 'no-drag drag-event'
                }
              />
            </li>
            <li className="no-drag drag-event">
              <img
                id={this.props.ID}
                src="../assets/images/user-profile/article-icon-2.png"
                onClick={this.props.delete}
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
                className="no-drag drag-event"
              />
            </li>
            <li className="no-drag drag-event">
              <img
                id={this.props.ID}
                src="../assets/images/user-profile/article-icon-3.png"
                data-toggle="tooltip"
                data-placement="top"
                title="Drag"
                className="no-drag drag-event"
                onMouseDown={this.props.removeNoDrag}
                onMouseUp={this.props.addNoDrag}
              />
            </li>
          </ul>
        </div>
        <div className="childsection2 subtitle-content no-drag drag-event">
          {openSubTitleForm}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const subTitle = state;
  return { subTitle };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(SubTitle);
