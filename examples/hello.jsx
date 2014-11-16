/** @jsx React.DOM */

var Hello = React.createClass({
  getInitialState: function() {
    return {title: this.props.initialName};
  },

  componentDidMount: function() {
    setTimeout(function() {
      this.setState({title: 'FUJI!'});
    }.bind(this), 2000);
  },

  render: function() {
    return <div>Hello {this.state.title}</div>;
  }
});
 
React.render(Hello({initialName: 'World'}), document.body);