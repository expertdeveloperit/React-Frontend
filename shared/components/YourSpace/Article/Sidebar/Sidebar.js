import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Spacetab from '../../../Spacetab';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.test = this.handleScroll.bind(this);
    this.state = {
      scroll: false,
      colored: '',
      sidebarIcons: [
        {
          id: 1,
          image: '../assets/images/user-profile/paragraph.png',
          category: 'Paragraph',
          props: this.props.addParagraph,
        },
        {
          id: 2,
          image: '../assets/images/user-profile/photo.png',
          category: 'Photo',
          props: this.props.addPhoto,
        },
        {
          id: 3,
          image: '../assets/images/user-profile/title.png',
          category: 'Title',
          props: this.props.addSubTitle,
        },
        {
          id: 4,
          image: '../assets/images/user-profile/separator.png',
          category: 'Separator',
          props: this.props.addSeparator,
        },
        {
          id: 5,
          image: '../assets/images/user-profile/quote.png',
          category: 'Quote',
          props: this.props.addQuote,
        },
        {
          id: 6,
          image: '../assets/images/user-profile/related-post.png',
          category: 'Related Post',
          props: this.props.addRelatedArticle,
        },
        {
          id: 7,
          image: '../assets/images/user-profile/video.png',
          category: 'Video',
          // props: this.props.add
        },
        {
          id: 8,
          image: '../assets/images/user-profile/place.png',
          category: 'Embed',
          props: this.props.addEmbed,
        },
        {
          id: 9,
          image: '../assets/images/user-profile/image-creation.png',
          category: 'Image Creation',
          props: this.props.addImageCreation,
        },
        {
          id: 10,
          image: '../assets/images/user-profile/list.png',
          category: 'List',
          // props: this.props.add
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.test);
  }

  // Function To add class when header is fix
  handleScroll() {
    const d = document.documentElement;
    const offset = d.scrollTop;
    if (offset == 0) {
      this.setState({
        scroll: false,
      });
    } else {
      this.setState({
        scroll: true,
      });
    }
  }

  changeColor(data) {
    this.setState({ colored: data });
    data.props();
  }

  getAricleSidebar() {
    if (this.state.sidebarIcons) {
      if (this.state.sidebarIcons.length > 0) {
        return this.state.sidebarIcons.map(data =>
          (<div
            key={data.id}
            className={this.state.colored == data ? 'userprofile-data active' : 'userprofile-data'}
            onClick={this.changeColor.bind(this, data)}
          >
            <img src={data.image} />
            <p>
              {data.category}
            </p>
          </div>),
        );
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.test);
  }

  render() {
    const sidebar = this.getAricleSidebar();
    return (
      <div>
        <div className={this.state.scroll ? 'add-fixed scroll' : 'add-fixed'}>
          <div className="userprofile-heading">ADD</div>
          {sidebar}
        </div>
        <Spacetab from="article" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const article_sidebar = state;
  return { article_sidebar };
}

function mapDispatchToProps(dispatch, props) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
