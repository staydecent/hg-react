var hg = require('mercury');
var Stapes = require('stapes');
var xtend = require('xtend');

var h = hg.h;


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

    this._refs = new (Stapes.subclass())();
    this._refs.on('change', function() {
      this.refs = this._refs.getAll();
    }.bind(this));
    this.refs = this._refs.getAll();

    this.state = this.getInitialState();
    this._state = hg.struct(this.state);
  },
  getInitialState: function() {
    return {};
  },
  setState: function(desc) {
    var prevState = this.state;
    var newState = xtend(prevState, desc);
    this.state = newState;
    this._state.set(newState);
  },
  getDOMNode: function() {
    return this._elem || null;
  },
  componentWillMount: function() {},
  componentDidMount: function() {},
  componentWillUpdate: function() {},
  componentDidUpdate: function() {}
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
    var instance;
    if (Component.render) {
      instance = Component;
    } else {
      instance = new Component(props);   
    }

    var vnode = instance.render();
    if (vnode.children.length) {
      for (var x = 0; x < vnode.children.length; x++) {
        var child = vnode.children[x];
        if (child.properties && child.properties.ref) {
          instance._refs.set(child.properties.ref, child);
        }
      }
    }

    return h('div', {
      'key': instance.displayName,
      'ev-lifecycle': new LifecycleHook(instance)
    }, vnode);
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
  console.debug('hooked', component);
}

LifecycleHook.prototype.hook = function (elem, propName) {
  if (!this.component._mounted) {
    this.component.componentWillMount();
  } else {
    this.component.componentWillUpdate();
  }

  setTimeout(function() {
    this.component._elem = elem.firstChild || elem;

    // as well as hook up our lifecycle methods, we will
    // also mimic the element.refs[name].getDOMNode() pattern
    if (this.component._elem.childNodes.length) {
      // iterate each ref
      this.component._refs.getAllAsArray().forEach(function(ref) {
        if (!ref.getDOMNode) {
          var relevantNode;
          var nodeList = this.component._elem.childNodes;
          
          // iterate each child node of component
          for (var i = 0; i < nodeList.length; ++i) {
            var item = nodeList[i];
            if (item.ref === ref.id) {
              relevantNode = item;
            }
          }

          if (!relevantNode) return;
          ref.getDOMNode = function() { return relevantNode; };
          this.component._refs.set(ref.id, ref);
        }
      }.bind(this));
    }

    if (!this.component._mounted) {
      this.component.componentDidMount();
      this.component._mounted = true;
    } else {
      this.component.componentDidUpdate();
    }
  }.bind(this), 1);
};


// Main entry func

function renderComponent(component, elem) {
  hg.app(elem, component._state, createFactory(component));
}


// DOM Hooks

function AttributeHook(value) { this.value = value; }
AttributeHook.prototype.hook = function (elem, prop) {
  elem.setAttribute(prop, this.value);
};