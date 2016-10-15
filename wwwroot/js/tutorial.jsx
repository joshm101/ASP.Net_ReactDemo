var Comment = React.createClass({
  rawMarkup() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        { /* 
          remarkable automatically strips HTML markup
            and insecure links from the output, so we
            are still protected from XSS
          */ }
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState() {
    return { author: '', text: '' };
  },

  handleAuthorChange(e) {
    this.setState({ author: e.target.value });
  },

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  },

  handleSubmit(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.setState({ author: '', text: '' });
  },

  render() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input 
          type="text" 
          placeholder="Say something..." 
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var data = [
  { id: 1, author: "Daniel Lo Nigro", text: "Hello ReactJS.NET World!" },
  { id: 2, author: "Pete Hunt", text: "This is one comment" },
  { id: 3, author: "Jordan Walke", text: "This is *another* comment" }
];

var CommentBox = React.createClass({
  getInitialState() {
    return { data: [] };
  },

  loadCommentsFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', this.props.url, true);
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText);
      this.setState({ data: data });
    }.bind(this);
    xhr.send();
  },

  handleCommentSubmit(comment) {
    var data = new FormData();
    data.append('author', comment.author);
    data.append('text', comment.text);

    var xhr = new XMLHttpRequest();
    xhr.open('post', this.props.submitUrl, true);
    xhr.onload = function() {
      this.loadCommentsFromServer();
    }.bind(this);
    xhr.send(data);
  },

  componentDidMount() {
    this.loadCommentsFromServer();
    
    // load comments from the server every pollInterval seconds.
    // Could use SignalR instead to send updates from the server
    // to avoid constant polling.
    // This approach polls and retrieves ALL comments. This can be
    // an expensive operation. We would really like to retrieve
    // only changes.
    window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  render() {
    return ( 
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});




ReactDOM.render(
  // url is hard coded for simplicity
  <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
  document.getElementById('content')
);
