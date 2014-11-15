/** @jsx React.DOM */

var React = require('../index');

var TodoList = React.createClass({
  render: function() {
    var createItem = function(itemText, index) {
      return (
        <li key={'todolist-item-'+index}>
          {itemText}
          <a 
            href="#" 
            onclick={this.props.handleDelete.bind(this, itemText)}>x</a>
        </li>
      );
    };
    return <ul>{this.props.items.map(createItem.bind(this))}</ul>;
  }
});
TodoList = React.createFactory(TodoList);

var TodoApp = React.createClass({
  getInitialState: function() {
    return {items: [], text: ''};
  },
  handleDelete: function(itemToDelete, e) {
    var remaingItems = this.state.items.filter(function(item) {
      return item !== itemToDelete;
    });

    this.setState({items: remaingItems});
  },
  handleChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
  },
  render: function() {
    return (
      <div>
        <h3>TODO</h3>
        {TodoList({items: this.state.items, handleDelete: this.handleDelete})}

        <form onsubmit={this.handleSubmit}>
          <input onchange={this.handleChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
});

React.render(TodoApp(), document.body);