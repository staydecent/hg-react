var Delegator = require('dom-delegator');
var Loop = require('main-loop');
var h = require('virtual-hyperscript');

var Stapes = require('stapes');
var xtend = require('xtend');


module.exports = {
  render: renderComponent,
  createClass: createClass,
  createFactory: createFactory,
  DOM: h
};

// Components
var Component = Stapes.subclass({
  constructor: function(desc) {
    for (var prop in desc) {
      if (typeof desc[prop] === 'function') {
        this[prop] = desc[prop].bind(this);
      } else {
        this[prop] = desc[prop];
      }
    }

    this.state = this.getInitialState();
    this._observ = new (Stapes.subclass())();
    this._observ.set('state', this.state);
  },
  getInitialState: function() {
    return {'NAH': 1};
  },
  setState: function(desc) {
    var prevState = this._observ.get('state');
    var newState = xtend(prevState, desc);
    this.state = newState;
    this._observ.set('state', newState);
  },
  getDOMNode: function() {
    return this._elem || null;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  addEventListener: function(cb) {
    this._observ.on('change:state', cb);
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

function createFactory(Component) {
  return function(props) {
    var component = new Component(props);

    return h('div', {
      'key': component.displayName,
      'ev-lifecycle': new LifecycleHook(component)
    }, component.render());
  };
}

function isValidComponent(component) {
  if (!component.render) {
    console.warn('Component missing render method.');
    return false;
  }

  return true;
}

// Lifecycle hook

function LifecycleHook(component) {
  this.component = component;
}

LifecycleHook.prototype.hook = function (elem, propName) {
  this.component._elem = elem;

  if (!this.component._mounted) {
    this.component.componentWillMount();
  } else {
    this.component.componentWillUpdate();
  }

  setImmediate(function() {
    if (!this.component._mounted) {
      this.component.componentDidMount();
    } else {
      this.component.componentDidUpdate();
    }
  }.bind(this));
};


// Main entry func

function renderComponent(component, elem) {
  if (!isValidComponent(component)) {
    throw "Invalid Component.";
  }

  Delegator(); // Setup proxied dom events

  var loop = Loop(component.getInitialState(), component.render);
  if (elem) { elem.appendChild(loop.target); }

  component.addEventListener(loop.update); // call loop.update on state change
}


// DOM Hooks

function AttributeHook(value) { this.value = value; }
AttributeHook.prototype.hook = function (elem, prop) {
  elem.setAttribute(prop, this.value);
};