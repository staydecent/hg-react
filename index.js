var Delegator = require('dom-delegator');
var Loop = require('main-loop');
var h = require('virtual-hyperscript');

var struct = require('observ-struct');
var Stapes = require('stapes');
var xtend = require('xtend');


module.exports = {
  render: renderComponent,
  createClass: createClass,
  DOM: {
    div: function(props, inner) {
      return h('div', inner);
    }
  }
};

// Components
var Component = Stapes.subclass({
  constructor: function(desc) {
    this.state = this.getInitialState();
   
    for (var prop in desc) {
      if (typeof desc[prop] === 'function') {
        this[prop] = desc[prop].bind(this);
      } else {
        this[prop] = desc[prop];
      }
    }
  },
  getInitialState: function() {
    return {};
  }
}, true);

function createClass(desc) {
  return function(props) {
    var ReactComponent = Component.subclass({
      constructor: function() {
        this.props = props;
        ReactComponent.parent.constructor.call(this, desc);
      }
    });
    return new ReactComponent();
  };
}

function isValidComponent(component) {
  if (!component.render) {
    console.warn('Component missing render method.');
    return false;
  }

  return true;
}


// Main entry func

function renderComponent(component, elem) {
  if (!isValidComponent(component)) {
    throw "Invalid Component.";
  }

  Delegator(); // Setup proxied dom events

  var loop = Loop(component.getInitialState(), component.render);
  if (elem) { elem.appendChild(loop.target); }

  var observ = struct(component.getInitialState());
  return observ(loop.update);
}