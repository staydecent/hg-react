(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["React"] = factory();
	else
		root["React"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var hg = __webpack_require__(1);
	var Stapes = __webpack_require__(2);
	var xtend = __webpack_require__(3);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var SingleEvent = __webpack_require__(15);
	var MultipleEvent = __webpack_require__(16);

	/*
	    Pro tip: Don't require `mercury` itself.
	      require and depend on all these modules directly!
	*/
	var mercury = module.exports = {
	    // Entry
	    main: __webpack_require__(4),
	    app: app,

	    // Input
	    Delegator: __webpack_require__(5),
	    input: input,
	    handles: handles,
	    event: __webpack_require__(17),
	    valueEvent: __webpack_require__(18),
	    submitEvent: __webpack_require__(19),
	    changeEvent: __webpack_require__(20),
	    keyEvent: __webpack_require__(21),

	    // State
	    array: __webpack_require__(6),
	    struct: __webpack_require__(7),
	    // deprecated: alias struct as hash for back compat
	    hash: __webpack_require__(7),
	    varhash: __webpack_require__(8),
	    value: __webpack_require__(9),

	    // Render
	    diff: __webpack_require__(22),
	    patch: __webpack_require__(23),
	    partial: __webpack_require__(12),
	    create: __webpack_require__(24),
	    h: __webpack_require__(13),
	    // deprecated: keep for back compat.
	    svg: __webpack_require__(14),

	    // Utilities
	    // deprecated: keep for back compat.
	    computed: __webpack_require__(10),
	    watch: __webpack_require__(11)
	};

	function input(names) {
	    if (!names) {
	        return SingleEvent();
	    }

	    return MultipleEvent(names);
	}

	function handles(funcs, context) {
	    return Object.keys(funcs).reduce(createHandle, {});

	    function createHandle(acc, name) {
	        var handle = mercury.Delegator.allocateHandle(
	            funcs[name].bind(null, context));

	        acc[name] = handle;
	        return acc;
	    }
	}

	function app(elem, observ, render, opts) {
	    mercury.Delegator(opts);
	    var loop = mercury.main(observ(), render, opts);
	    if (elem) {
	        elem.appendChild(loop.target);
	    }
	    return observ(loop.update);
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	//
	//  ____  _                           _
	// / ___|| |_ __ _ _ __   ___  ___   (_)___  (*)
	// \___ \| __/ _` | '_ \ / _ \/ __|  | / __|
	//  ___) | || (_| | |_) |  __/\__ \_ | \__ \
	// |____/ \__\__,_| .__/ \___||___(_)/ |___/
	//              |_|              |__/
	//
	// (*) the Javascript MVC microframework that does just enough
	//
	// (c) Hay Kranen < hay@bykr.org >
	// Released under the terms of the MIT license
	// < http://en.wikipedia.org/wiki/MIT_License >
	//
	// Stapes.js : http://hay.github.com/stapes
	;(function() {
	    'use strict';

	    var VERSION = "0.8.1";

	    // Global counter for all events in all modules (including mixed in objects)
	    var guid = 1;

	    // Makes _.create() faster
	    if (!Object.create) {
	        var CachedFunction = function(){};
	    }

	    // So we can use slice.call for arguments later on
	    var slice = Array.prototype.slice;

	    // Private attributes and helper functions, stored in an object so they
	    // are overwritable by plugins
	    var _ = {
	        // Properties
	        attributes : {},

	        eventHandlers : {
	            "-1" : {} // '-1' is used for the global event handling
	        },

	        guid : -1,

	        // Methods
	        addEvent : function(event) {
	            // If we don't have any handlers for this type of event, add a new
	            // array we can use to push new handlers
	            if (!_.eventHandlers[event.guid][event.type]) {
	                _.eventHandlers[event.guid][event.type] = [];
	            }

	            // Push an event object
	            _.eventHandlers[event.guid][event.type].push({
	                "guid" : event.guid,
	                "handler" : event.handler,
	                "scope" : event.scope,
	                "type" : event.type
	            });
	        },

	        addEventHandler : function(argTypeOrMap, argHandlerOrScope, argScope) {
	            var eventMap = {},
	                scope;

	            if (typeof argTypeOrMap === "string") {
	                scope = argScope || false;
	                eventMap[ argTypeOrMap ] = argHandlerOrScope;
	            } else {
	                scope = argHandlerOrScope || false;
	                eventMap = argTypeOrMap;
	            }

	            for (var eventString in eventMap) {
	                var handler = eventMap[eventString];
	                var events = eventString.split(" ");

	                for (var i = 0, l = events.length; i < l; i++) {
	                    var eventType = events[i];
	                    _.addEvent.call(this, {
	                        "guid" : this._guid || this._.guid,
	                        "handler" : handler,
	                        "scope" : scope,
	                        "type" : eventType
	                    });
	                }
	            }
	        },

	        addGuid : function(object, forceGuid) {
	            if (object._guid && !forceGuid) return;

	            object._guid = guid++;

	            _.attributes[object._guid] = {};
	            _.eventHandlers[object._guid] = {};
	        },

	        // This is a really small utility function to save typing and produce
	        // better optimized code
	        attr : function(guid) {
	            return _.attributes[guid];
	        },

	        clone : function(obj) {
	            var type = _.typeOf(obj);

	            if (type === 'object') {
	                return _.extend({}, obj);
	            }

	            if (type === 'array') {
	                return obj.slice(0);
	            }
	        },

	        create : function(proto) {
	            if (Object.create) {
	                return Object.create(proto);
	            } else {
	                CachedFunction.prototype = proto;
	                return new CachedFunction();
	            }
	        },

	        createSubclass : function(props, includeEvents) {
	            props = props || {};
	            includeEvents = includeEvents || false;

	            var superclass = props.superclass.prototype;

	            // Objects always have a constructor, so we need to be sure this is
	            // a property instead of something from the prototype
	            var realConstructor = props.hasOwnProperty('constructor') ? props.constructor : function(){};

	            function constructor() {
	                // Be kind to people forgetting new
	                if (!(this instanceof constructor)) {
	                    throw new Error("Please use 'new' when initializing Stapes classes");
	                }

	                // If this class has events add a GUID as well
	                if (this.on) {
	                    _.addGuid( this, true );
	                }

	                realConstructor.apply(this, arguments);
	            }

	            if (includeEvents) {
	                _.extend(superclass, Events);
	            }

	            constructor.prototype = _.create(superclass);
	            constructor.prototype.constructor = constructor;

	            _.extend(constructor, {
	                extend : function() {
	                    return _.extendThis.apply(this, arguments);
	                },

	                // We can't call this 'super' because that's a reserved keyword
	                // and fails in IE8
	                'parent' : superclass,

	                proto : function() {
	                    return _.extendThis.apply(this.prototype, arguments);
	                },

	                subclass : function(obj) {
	                    obj = obj || {};
	                    obj.superclass = this;
	                    return _.createSubclass(obj);
	                }
	            });

	            // Copy all props given in the definition to the prototype
	            for (var key in props) {
	                if (key !== 'constructor' && key !== 'superclass') {
	                    constructor.prototype[key] = props[key];
	                }
	            }

	            return constructor;
	        },

	        emitEvents : function(type, data, explicitType, explicitGuid) {
	            explicitType = explicitType || false;
	            explicitGuid = explicitGuid || this._guid;

	            // #30: make a local copy of handlers to prevent problems with
	            // unbinding the event while unwinding the loop
	            var handlers = slice.call(_.eventHandlers[explicitGuid][type]);

	            for (var i = 0, l = handlers.length; i < l; i++) {
	                // Clone the event to prevent issue #19
	                var event = _.extend({}, handlers[i]);
	                var scope = (event.scope) ? event.scope : this;

	                if (explicitType) {
	                    event.type = explicitType;
	                }

	                event.scope = scope;
	                event.handler.call(event.scope, data, event);
	            }
	        },

	        // Extend an object with more objects
	        extend : function() {
	            var args = slice.call(arguments);
	            var object = args.shift();

	            for (var i = 0, l = args.length; i < l; i++) {
	                var props = args[i];
	                for (var key in props) {
	                    object[key] = props[key];
	                }
	            }

	            return object;
	        },

	        // The same as extend, but uses the this value as the scope
	        extendThis : function() {
	            var args = slice.call(arguments);
	            args.unshift(this);
	            return _.extend.apply(this, args);
	        },

	        // from http://stackoverflow.com/a/2117523/152809
	        makeUuid : function() {
	            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	                return v.toString(16);
	            });
	        },

	        removeAttribute : function(keys, silent) {
	            silent = silent || false;

	            // Split the key, maybe we want to remove more than one item
	            var attributes = _.trim(keys).split(" ")
	                ,mutateData = {}
	                ;

	            // Actually delete the item
	            for (var i = 0, l = attributes.length; i < l; i++) {
	                var key = _.trim(attributes[i]);

	                if (key) {
	                    // Store data for mutate event
	                    mutateData.key = key;
	                    mutateData.oldValue = _.attr(this._guid)[key];

	                    delete _.attr(this._guid)[key];

	                    // If 'silent' is set, do not throw any events
	                    if (!silent) {
	                        this.emit('change', key);
	                        this.emit('change:' + key);
	                        this.emit('mutate', mutateData);
	                        this.emit('mutate:' + key, mutateData);
	                        this.emit('remove', key);
	                        this.emit('remove:' + key);
	                    }

	                    // clean up
	                    delete mutateData.oldValue;
	                }
	            }
	        },

	        removeEventHandler : function(type, handler) {
	            var handlers = _.eventHandlers[this._guid];

	            if (type && handler) {
	                // Remove a specific handler
	                handlers = handlers[type];
	                if (!handlers) return;

	                for (var i = 0, l = handlers.length, h; i < l; i++) {
	                    h = handlers[i].handler;
	                    if (h && h === handler) {
	                        handlers.splice(i--, 1);
	                        l--;
	                    }
	                }
	            } else if (type) {
	                // Remove all handlers for a specific type
	                delete handlers[type];
	            } else {
	                // Remove all handlers for this module
	                _.eventHandlers[this._guid] = {};
	            }
	        },

	        setAttribute : function(key, value, silent) {
	            silent = silent || false;

	            // We need to do this before we actually add the item :)
	            var itemExists = this.has(key);
	            var oldValue = _.attr(this._guid)[key];

	            // Is the value different than the oldValue? If not, ignore this call
	            if (value === oldValue) {
	                return;
	            }

	            // Actually add the item to the attributes
	            _.attr(this._guid)[key] = value;

	            // If 'silent' flag is set, do not throw any events
	            if (silent) {
	                return;
	            }

	            // Throw a generic event
	            this.emit('change', key);

	            // And a namespaced event as well, NOTE that we pass value instead of
	            // key here!
	            this.emit('change:' + key, value);

	            // Throw namespaced and non-namespaced 'mutate' events as well with
	            // the old value data as well and some extra metadata such as the key
	            var mutateData = {
	                "key" : key,
	                "newValue" : value,
	                "oldValue" : oldValue || null
	            };

	            this.emit('mutate', mutateData);
	            this.emit('mutate:' + key, mutateData);

	            // Also throw a specific event for this type of set
	            var specificEvent = itemExists ? 'update' : 'create';

	            this.emit(specificEvent, key);

	            // And a namespaced event as well, NOTE that we pass value instead of key
	            this.emit(specificEvent + ':' + key, value);
	        },

	        trim : function(str) {
	            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	        },

	        typeOf : function(val) {
	            if (val === null || typeof val === "undefined") {
	                // This is a special exception for IE, in other browsers the
	                // method below works all the time
	                return String(val);
	            } else {
	                return Object.prototype.toString.call(val).replace(/\[object |\]/g, '').toLowerCase();
	            }
	        },

	        updateAttribute : function(key, fn, silent) {
	            var item = this.get(key);

	            // In previous versions of Stapes we didn't have the check for object,
	            // but still this worked. In 0.7.0 it suddenly doesn't work anymore and
	            // we need the check. Why? I have no clue.
	            var type = _.typeOf(item);

	            if (type === 'object' || type === 'array') {
	                item = _.clone(item);
	            }

	            var newValue = fn.call(this, item, key);
	            _.setAttribute.call(this, key, newValue, silent || false);
	        }
	    };

	    // Can be mixed in later using Stapes.mixinEvents(object);
	    var Events = {
	        emit : function(types, data) {
	            data = (typeof data === "undefined") ? null : data;

	            var splittedTypes = types.split(" ");

	            for (var i = 0, l = splittedTypes.length; i < l; i++) {
	                var type = splittedTypes[i];

	                // First 'all' type events: is there an 'all' handler in the
	                // global stack?
	                if (_.eventHandlers[-1].all) {
	                    _.emitEvents.call(this, "all", data, type, -1);
	                }

	                // Catch all events for this type?
	                if (_.eventHandlers[-1][type]) {
	                    _.emitEvents.call(this, type, data, type, -1);
	                }

	                if (typeof this._guid === 'number') {
	                    // 'all' event for this specific module?
	                    if (_.eventHandlers[this._guid].all) {
	                        _.emitEvents.call(this, "all", data, type);
	                    }

	                    // Finally, normal events :)
	                    if (_.eventHandlers[this._guid][type]) {
	                        _.emitEvents.call(this, type, data);
	                    }
	                }
	            }
	        },

	        off : function() {
	            _.removeEventHandler.apply(this, arguments);
	        },

	        on : function() {
	            _.addEventHandler.apply(this, arguments);
	        }
	    };

	    _.Module = function() {

	    };

	    _.Module.prototype = {
	        each : function(fn, ctx) {
	            var attr = _.attr(this._guid);
	            for (var key in attr) {
	                var value = attr[key];
	                fn.call(ctx || this, value, key);
	            }
	        },

	        extend : function() {
	            return _.extendThis.apply(this, arguments);
	        },

	        filter : function(fn) {
	            var filtered = [];
	            var attributes = _.attr(this._guid);

	            for (var key in attributes) {
	                if ( fn.call(this, attributes[key], key)) {
	                    filtered.push( attributes[key] );
	                }
	            }

	            return filtered;
	        },

	        get : function(input) {
	            if (typeof input === "string") {
	                // If there is more than one argument, give back an object,
	                // like Underscore's pick()
	                if (arguments.length > 1) {
	                    var results = {};

	                    for (var i = 0, l = arguments.length; i < l; i++) {
	                        var key = arguments[i];
	                        results[key] = this.get(key);
	                    }

	                    return results;
	                } else {
	                    return this.has(input) ? _.attr(this._guid)[input] : null;
	                }
	            } else if (typeof input === "function") {
	                var items = this.filter(input);
	                return (items.length) ? items[0] : null;
	            }
	        },

	        getAll : function() {
	            return _.clone( _.attr(this._guid) );
	        },

	        getAllAsArray : function() {
	            var arr = [];
	            var attributes = _.attr(this._guid);

	            for (var key in attributes) {
	                var value = attributes[key];

	                if (_.typeOf(value) === "object" && !value.id) {
	                    value.id = key;
	                }

	                arr.push(value);
	            }

	            return arr;
	        },

	        has : function(key) {
	            return (typeof _.attr(this._guid)[key] !== "undefined");
	        },

	        map : function(fn, ctx) {
	            var mapped = [];
	            this.each(function(value, key) {
	                mapped.push( fn.call(ctx || this, value, key) );
	            }, ctx || this);
	            return mapped;
	        },

	        // Akin to set(), but makes a unique id
	        push : function(input, silent) {
	            if (_.typeOf(input) === "array") {
	                for (var i = 0, l = input.length; i < l; i++) {
	                    _.setAttribute.call(this, _.makeUuid(), input[i], silent || false);
	                }
	            } else {
	                _.setAttribute.call(this, _.makeUuid(), input, silent || false);
	            }

	            return this;
	        },

	        remove : function(input, silent) {
	            if (typeof input === 'undefined') {
	                // With no arguments, remove deletes all attributes
	                _.attributes[this._guid] = {};
	                this.emit('change remove');
	            } else if (typeof input === "function") {
	                this.each(function(item, key) {
	                    if (input(item)) {
	                        _.removeAttribute.call(this, key, silent);
	                    }
	                });
	            } else {
	                // nb: checking for exists happens in removeAttribute
	                _.removeAttribute.call(this, input, silent || false);
	            }

	            return this;
	        },

	        set : function(objOrKey, valueOrSilent, silent) {
	            if (typeof objOrKey === "object") {
	                for (var key in objOrKey) {
	                    _.setAttribute.call(this, key, objOrKey[key], valueOrSilent || false);
	                }
	            } else {
	                _.setAttribute.call(this, objOrKey, valueOrSilent, silent || false);
	            }

	            return this;
	        },

	        size : function() {
	            var size = 0;
	            var attr = _.attr(this._guid);

	            for (var key in attr) {
	                size++;
	            }

	            return size;
	        },

	        update : function(keyOrFn, fn, silent) {
	            if (typeof keyOrFn === "string") {
	                _.updateAttribute.call(this, keyOrFn, fn, silent || false);
	            } else if (typeof keyOrFn === "function") {
	                this.each(function(value, key) {
	                    _.updateAttribute.call(this, key, keyOrFn);
	                });
	            }

	            return this;
	        }
	    };

	    var Stapes = {
	        "_" : _, // private helper functions and properties

	        "extend" : function() {
	            return _.extendThis.apply(_.Module.prototype, arguments);
	        },

	        "mixinEvents" : function(obj) {
	            obj = obj || {};

	            _.addGuid(obj);

	            return _.extend(obj, Events);
	        },

	        "on" : function() {
	            _.addEventHandler.apply(this, arguments);
	        },

	        "subclass" : function(obj, classOnly) {
	            classOnly = classOnly || false;
	            obj = obj || {};
	            obj.superclass = classOnly ? function(){} : _.Module;
	            return _.createSubclass(obj, !classOnly);
	        },

	        "version" : VERSION
	    };

	    // This library can be used as an AMD module, a Node.js module, or an
	    // old fashioned global
	    if (true) {
	        // Server
	        if (typeof module !== "undefined" && module.exports) {
	            exports = module.exports = Stapes;
	        }
	        exports.Stapes = Stapes;
	    } else if (typeof define === "function" && define.amd) {
	        // AMD
	        define(function() {
	            return Stapes;
	        });
	    } else {
	        // Global scope
	        window.Stapes = Stapes;
	    }
	})();


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = extend

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var raf = __webpack_require__(51)
	var vtreeDiff = __webpack_require__(22)
	var vdomCreate = __webpack_require__(24)
	var vdomPatch = __webpack_require__(23)
	var TypedError = __webpack_require__(61)

	var InvalidUpdateInRender = TypedError({
	    type: "main-loop.invalid.update.in-render",
	    message: "main-loop: Unexpected update occurred in loop.\n" +
	        "We are currently rendering a view, " +
	            "you can't change state right now.\n" +
	        "The diff is: {stringDiff}.\n" +
	        "SUGGESTED FIX: find the state mutation in your view " +
	            "or rendering function and remove it.\n" +
	        "The view should not have any side effects.\n",
	    diff: null,
	    stringDiff: null
	})

	module.exports = main

	function main(initialState, view, opts) {
	    opts = opts || {}

	    var currentState = initialState
	    var create = opts.create || vdomCreate
	    var diff = opts.diff || vtreeDiff
	    var patch = opts.patch || vdomPatch
	    var redrawScheduled = false

	    var tree = opts.initialTree || view(currentState)
	    var target = opts.target || create(tree, opts)
	    var inRenderingTransaction = false

	    currentState = null

	    return {
	        target: target,
	        update: update
	    }

	    function update(state) {
	        if (inRenderingTransaction) {
	            throw InvalidUpdateInRender({
	                diff: state._diff,
	                stringDiff: JSON.stringify(state._diff)
	            })
	        }

	        if (currentState === null && !redrawScheduled) {
	            redrawScheduled = true
	            raf(redraw)
	        }

	        currentState = state
	    }

	    function redraw() {
	        redrawScheduled = false;
	        if (currentState === null) {
	            return
	        }

	        inRenderingTransaction = true
	        var newTree = view(currentState)

	        if (opts.createOnly) {
	            create(newTree, opts)
	        } else {
	            var patches = diff(tree, newTree, opts)
	            target = patch(target, patches, opts)
	        }

	        inRenderingTransaction = false
	        tree = newTree
	        currentState = null
	    }
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Individual = __webpack_require__(52)
	var cuid = __webpack_require__(70)
	var globalDocument = __webpack_require__(62)

	var DOMDelegator = __webpack_require__(25)

	var delegatorCache = Individual("__DOM_DELEGATOR_CACHE@9", {
	    delegators: {}
	})
	var commonEvents = [
	    "blur", "change", "click",  "contextmenu", "dblclick",
	    "error","focus", "focusin", "focusout", "input", "keydown",
	    "keypress", "keyup", "load", "mousedown", "mouseup",
	    "resize", "scroll", "select", "submit", "touchcancel",
	    "touchend", "touchstart", "unload"
	]

	/*  Delegator is a thin wrapper around a singleton `DOMDelegator`
	        instance.

	    Only one DOMDelegator should exist because we do not want
	        duplicate event listeners bound to the DOM.

	    `Delegator` will also `listenTo()` all events unless
	        every caller opts out of it
	*/
	module.exports = Delegator

	function Delegator(opts) {
	    opts = opts || {}
	    var document = opts.document || globalDocument

	    var cacheKey = document["__DOM_DELEGATOR_CACHE_TOKEN@9"]

	    if (!cacheKey) {
	        cacheKey =
	            document["__DOM_DELEGATOR_CACHE_TOKEN@9"] = cuid()
	    }

	    var delegator = delegatorCache.delegators[cacheKey]

	    if (!delegator) {
	        delegator = delegatorCache.delegators[cacheKey] =
	            new DOMDelegator(document)
	    }

	    if (opts.defaultEvents !== false) {
	        for (var i = 0; i < commonEvents.length; i++) {
	            delegator.listenTo(commonEvents[i])
	        }
	    }

	    return delegator
	}

	Delegator.allocateHandle = DOMDelegator.allocateHandle;
	Delegator.transformHandle = DOMDelegator.transformHandle;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Observ = __webpack_require__(9)

	// circular dep between ArrayMethods & this file
	module.exports = ObservArray

	var splice = __webpack_require__(26)
	var put = __webpack_require__(27)
	var transaction = __webpack_require__(28)
	var ArrayMethods = __webpack_require__(29)
	var addListener = __webpack_require__(30)


	/*  ObservArray := (Array<T>) => Observ<
	        Array<T> & { _diff: Array }
	    > & {
	        splice: (index: Number, amount: Number, rest...: T) =>
	            Array<T>,
	        push: (values...: T) => Number,
	        filter: (lambda: Function, thisValue: Any) => Array<T>,
	        indexOf: (item: T, fromIndex: Number) => Number
	    }

	    Fix to make it more like ObservHash.

	    I.e. you write observables into it. 
	        reading methods take plain JS objects to read
	        and the value of the array is always an array of plain
	        objsect.

	        The observ array instance itself would have indexed 
	        properties that are the observables
	*/
	function ObservArray(initialList) {
	    // list is the internal mutable list observ instances that
	    // all methods on `obs` dispatch to.
	    var list = initialList
	    var initialState = []

	    // copy state out of initialList into initialState
	    list.forEach(function (observ, index) {
	        initialState[index] = typeof observ === "function" ?
	            observ() : observ
	    })

	    var obs = Observ(initialState)
	    obs.splice = splice

	    obs.get = get
	    obs.getLength = getLength
	    obs.put = put
	    obs.transaction = transaction

	    // you better not mutate this list directly
	    // this is the list of observs instances
	    obs._list = list

	    var removeListeners = list.map(function (observ) {
	        return typeof observ === "function" ?
	            addListener(obs, observ) :
	            null
	    });
	    // this is a list of removal functions that must be called
	    // when observ instances are removed from `obs.list`
	    // not calling this means we do not GC our observ change
	    // listeners. Which causes rage bugs
	    obs._removeListeners = removeListeners

	    return ArrayMethods(obs, list)
	}

	function get(index) {
	    return this._list[index]
	}

	function getLength() {
	    return this._list.length
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Observ = __webpack_require__(9)
	var extend = __webpack_require__(56)

	var blackList = ["name", "_diff", "_type", "_version"]
	var blackListReasons = {
	    "name": "Clashes with `Function.prototype.name`.\n",
	    "_diff": "_diff is reserved key of observ-struct.\n",
	    "_type": "_type is reserved key of observ-struct.\n",
	    "_version": "_version is reserved key of observ-struct.\n"
	}
	var NO_TRANSACTION = {}

	function setNonEnumerable(object, key, value) {
	    Object.defineProperty(object, key, {
	        value: value,
	        writable: true,
	        configurable: true,
	        enumerable: false
	    })
	}

	/* ObservStruct := (Object<String, Observ<T>>) => 
	    Object<String, Observ<T>> &
	        Observ<Object<String, T> & {
	            _diff: Object<String, Any>
	        }>

	*/
	module.exports = ObservStruct

	function ObservStruct(struct) {
	    var keys = Object.keys(struct)

	    var initialState = {}
	    var currentTransaction = NO_TRANSACTION
	    var nestedTransaction = NO_TRANSACTION

	    keys.forEach(function (key) {
	        if (blackList.indexOf(key) !== -1) {
	            throw new Error("cannot create an observ-struct " +
	                "with a key named '" + key + "'.\n" +
	                blackListReasons[key]);
	        }

	        var observ = struct[key]
	        initialState[key] = typeof observ === "function" ?
	            observ() : observ
	    })

	    var obs = Observ(initialState)
	    keys.forEach(function (key) {
	        var observ = struct[key]
	        obs[key] = observ

	        if (typeof observ === "function") {
	            observ(function (value) {
	                if (nestedTransaction === value) {
	                    return
	                }

	                var state = extend(obs())
	                state[key] = value
	                var diff = {}
	                diff[key] = value && value._diff ?
	                    value._diff : value

	                setNonEnumerable(state, "_diff", diff)
	                currentTransaction = state
	                obs.set(state)
	                currentTransaction = NO_TRANSACTION
	            })
	        }
	    })
	    var _set = obs.set
	    obs.set = function trackDiff(value) {
	        if (currentTransaction === value) {
	            return _set(value)
	        }

	        var newState = extend(value)
	        setNonEnumerable(newState, "_diff", value)
	        _set(newState)
	    }

	    obs(function (newState) {
	        if (currentTransaction === newState) {
	            return
	        }

	        keys.forEach(function (key) {
	            var observ = struct[key]
	            var newObservValue = newState[key]

	            if (typeof observ === "function" &&
	                observ() !== newObservValue
	            ) {
	                nestedTransaction = newObservValue
	                observ.set(newState[key])
	                nestedTransaction = NO_TRANSACTION
	            }
	        })
	    })

	    obs._type = "observ-struct"
	    obs._version = "5"

	    return obs
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Observ = __webpack_require__(9)
	var extend = __webpack_require__(57)

	var NO_TRANSACTION = {}

	ObservVarhash.Tombstone = new Tombstone()

	module.exports = ObservVarhash

	function ObservVarhash (hash, createValue) {
	  createValue = createValue || function (obj) { return obj }

	  var initialState = {}
	  var currentTransaction = NO_TRANSACTION

	  for (var key in hash) {
	    var observ = hash[key]
	    checkKey(key)
	    initialState[key] = isFn(observ) ? observ() : observ
	  }

	  var obs = Observ(initialState)
	  obs._removeListeners = {}

	  obs.get = get.bind(obs)
	  obs.put = put.bind(obs, createValue)
	  obs.delete = del.bind(obs)

	  for (key in hash) {
	    obs[key] = createValue(hash[key], key)

	    if (isFn(obs[key])) {
	      obs._removeListeners[key] = obs[key](watch(obs, key, currentTransaction))
	    }
	  }

	  obs(function (newState) {
	    if (currentTransaction === newState) {
	      return
	    }

	    for (var key in hash) {
	      var observ = hash[key]

	      if (isFn(observ) && observ() !== newState[key]) {
	        observ.set(newState[key])
	      }
	    }
	  })

	  return obs
	}

	// access and mutate
	function get (key) {
	  return this[key]
	}

	function put (createValue, key, val) {
	  checkKey(key)

	  var observ = createValue(val, key)
	  var state = extend(this())

	  state[key] = isFn(observ) ? observ() : observ

	  if (isFn(this._removeListeners[key])) {
	    this._removeListeners[key]()
	  }

	  this._removeListeners[key] = isFn(observ) ?
	    observ(watch(this, key)) : null

	  setNonEnumerable(state, '_diff', diff(key, state[key]))

	  this.set(state)
	  this[key] = observ

	  return this
	}

	function del (key) {
	  var state = extend(this())
	  if (isFn(this._removeListeners[key])) {
	    this._removeListeners[key]()
	  }

	  delete this._removeListeners[key]
	  delete state[key]

	  setNonEnumerable(state, '_diff', diff(key, ObservVarhash.Tombstone))
	  this.set(state)

	  return this
	}

	// processing
	function watch (obs, key, currentTransaction) {
	  return function (value) {
	    var state = extend(obs())
	    state[key] = value

	    setNonEnumerable(state, '_diff', diff(key, value))
	    currentTransaction = state
	    obs.set(state)
	    currentTransaction = NO_TRANSACTION
	  }
	}

	function diff (key, value) {
	  var obj = {}
	  obj[key] = value && value._diff ? value._diff : value
	  return obj
	}

	function isFn (obj) {
	  return typeof obj === 'function'
	}

	function setNonEnumerable(object, key, value) {
	  Object.defineProperty(object, key, {
	    value: value,
	    writable: true,
	    configurable: true,
	    enumerable: false
	  })
	}

	// errors
	var blacklist = {
	  name: 'Clashes with `Function.prototype.name`.',
	  get: 'get is a reserved key of observ-varhash method',
	  put: 'put is a reserved key of observ-varhash method',
	  delete: 'delete is a reserved key of observ-varhash method',
	  _diff: '_diff is a reserved key of observ-varhash method',
	  _removeListeners: '_removeListeners is a reserved key of observ-varhash'
	}

	function checkKey (key) {
	  if (!blacklist[key]) return
	  throw new Error(
	    'cannot create an observ-varhash with key `' + key + '`. ' + blacklist[key]
	  )
	}

	// identify deletes
	function Tombstone () {}

	Tombstone.prototype.toJSON = nameTombstone
	Tombstone.prototype.inspect = nameTombstone
	Tombstone.prototype.toString = nameTombstone

	function nameTombstone () {
	  return '[object Tombstone]'
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Observable

	function Observable(value) {
	    var listeners = []
	    value = value === undefined ? null : value

	    observable.set = function (v) {
	        value = v
	        listeners.forEach(function (f) {
	            f(v)
	        })
	    }

	    return observable

	    function observable(listener) {
	        if (!listener) {
	            return value
	        }

	        listeners.push(listener)

	        return function remove() {
	            listeners.splice(listeners.indexOf(listener), 1)
	        }
	    }
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Observable = __webpack_require__(9)

	module.exports = computed

	function computed(observables, lambda) {
	    var values = observables.map(function (o) {
	        return o()
	    })
	    var result = Observable(lambda.apply(null, values))

	    observables.forEach(function (o, index) {
	        o(function (newValue) {
	            values[index] = newValue
	            result.set(lambda.apply(null, values))
	        })
	    })

	    return result
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = watch

	function watch(observable, listener) {
	    var remove = observable(listener)
	    listener(observable())
	    return remove
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Partial = __webpack_require__(31);

	module.exports = Partial();


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(44)
	var VText = __webpack_require__(45)
	var isVNode = __webpack_require__(32)
	var isVText = __webpack_require__(33)
	var isWidget = __webpack_require__(34)
	var isHook = __webpack_require__(46)
	var isVThunk = __webpack_require__(35)
	var TypedError = __webpack_require__(69)

	var parseTag = __webpack_require__(36)
	var softSetHook = __webpack_require__(47)
	var dataSetHook = __webpack_require__(48)
	var evHook = __webpack_require__(49)

	var UnexpectedVirtualElement = TypedError({
	    type: "virtual-hyperscript.unexpected.virtual-element",
	    message: "Unexpected virtual child passed to h().\n" +
	        "Expected a VNode / Vthunk / VWidget / string but:\n" +
	        "got a {foreignObjectStr}.\n" +
	        "The parent vnode is {parentVnodeStr}.\n" +
	        "Suggested fix: change your `h(..., [ ... ])` callsite.",
	    foreignObjectStr: null,
	    parentVnodeStr: null,
	    foreignObject: null,
	    parentVnode: null
	})

	module.exports = h

	function h(tagName, properties, children) {
	    var childNodes = []
	    var tag, props, key, namespace

	    if (!children && isChildren(properties)) {
	        children = properties
	        props = {}
	    }

	    props = props || properties || {}
	    tag = parseTag(tagName, props)

	    // support keys
	    if ("key" in props) {
	        key = props.key
	        props.key = undefined
	    }

	    // support namespace
	    if ("namespace" in props) {
	        namespace = props.namespace
	        props.namespace = undefined
	    }

	    // fix cursor bug
	    if (tag === "input" &&
	        "value" in props &&
	        props.value !== undefined &&
	        !isHook(props.value)
	    ) {
	        props.value = softSetHook(props.value)
	    }

	    var keys = Object.keys(props)
	    var propName, value
	    for (var j = 0; j < keys.length; j++) {
	        propName = keys[j]
	        value = props[propName]
	        if (isHook(value)) {
	            continue
	        }

	        // add data-foo support
	        if (propName.substr(0, 5) === "data-") {
	            props[propName] = dataSetHook(value)
	        }

	        // add ev-foo support
	        if (propName.substr(0, 3) === "ev-") {
	            props[propName] = evHook(value)
	        }
	    }

	    if (children !== undefined && children !== null) {
	        addChild(children, childNodes, tag, props)
	    }


	    var node = new VNode(tag, props, childNodes, key, namespace)

	    return node
	}

	function addChild(c, childNodes, tag, props) {
	    if (typeof c === "string") {
	        childNodes.push(new VText(c))
	    } else if (isChild(c)) {
	        childNodes.push(c)
	    } else if (Array.isArray(c)) {
	        for (var i = 0; i < c.length; i++) {
	            addChild(c[i], childNodes, tag, props)
	        }
	    } else if (c === null || c === undefined) {
	        return
	    } else {
	        throw UnexpectedVirtualElement({
	            foreignObjectStr: JSON.stringify(c),
	            foreignObject: c,
	            parentVnodeStr: JSON.stringify({
	                tagName: tag,
	                properties: props
	            }),
	            parentVnode: {
	                tagName: tag,
	                properties: props
	            }
	        })
	    }
	}

	function isChild(x) {
	    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x)
	}

	function isChildren(x) {
	    return typeof x === "string" || Array.isArray(x) || isChild(x)
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var attributeHook = __webpack_require__(50)
	var h = __webpack_require__(13)

	var BLACKLISTED_KEYS = {
	    "style": true,
	    "namespace": true,
	    "key": true
	}
	var SVG_NAMESPACE = "http://www.w3.org/2000/svg"

	module.exports = svg

	function svg(tagName, properties, children) {
	    if (!children && isChildren(properties)) {
	        children = properties
	        properties = {}
	    }

	    properties = properties || {}

	    // set namespace for svg
	    properties.namespace = SVG_NAMESPACE

	    // for each key, if attribute & string, bool or number then
	    // convert it into a setAttribute hook
	    for (var key in properties) {
	        if (!properties.hasOwnProperty(key)) {
	            continue
	        }

	        if (BLACKLISTED_KEYS[key]) {
	            continue
	        }

	        var value = properties[key]
	        if (typeof value !== "string" &&
	            typeof value !== "number" &&
	            typeof value !== "boolean"
	        ) {
	            continue
	        }

	        properties[key] = attributeHook(value)
	    }

	    return h(tagName, properties, children)
	}

	function isChildren(x) {
	    return typeof x === "string" || Array.isArray(x)
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Event = __webpack_require__(37)

	module.exports = Single

	function Single() {
	    var tuple = Event()

	    return function event(value) {
	        if (typeof value === "function") {
	            return tuple.listen(value)
	        } else {
	            return tuple.broadcast(value)
	        }
	    }
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var event = __webpack_require__(15)

	module.exports = multiple

	function multiple(names) {
	    return names.reduce(function (acc, name) {
	        acc[name] = event()
	        return acc
	    }, {})
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var BaseEvent = __webpack_require__(38);

	module.exports = BaseEvent(eventLambda);

	function eventLambda(ev) {
	    return this.data;
	}


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(63)
	var getFormData = __webpack_require__(71)

	var BaseEvent = __webpack_require__(38);

	module.exports = BaseEvent(valueLambda);

	function valueLambda(ev) {
	    var value = getFormData(ev.currentTarget)
	    var data = extend(value, this.data)

	    return data;
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(63)
	var getFormData = __webpack_require__(71)

	var BaseEvent = __webpack_require__(38);

	var ENTER = 13

	module.exports = BaseEvent(submitLambda);

	function submitLambda(ev) {
	    var target = ev.target

	    var isValid =
	        (ev.type === 'click' && target.tagName === 'BUTTON') ||
	        (ev.type === 'click' && target.type === 'submit') ||
	        (
	            (target.type === 'text') &&
	            (ev.keyCode === ENTER && ev.type === 'keydown')
	        )

	    if (!isValid) {
	        if (ev.startPropagation) {
	            ev.startPropagation()
	        }
	        return
	    }

	    var value = getFormData(ev.currentTarget)
	    var data = extend(value, this.data)

	    if (ev.preventDefault) {
	        ev.preventDefault();
	    }

	    return data;
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(63)
	var getFormData = __webpack_require__(71)

	var BaseEvent = __webpack_require__(38)

	var VALID_CHANGE = ['checkbox', 'file'];
	var VALID_INPUT = ['color', 'date', 'datetime', 'datetime-local', 'email',
	    'month', 'number', 'password', 'range', 'search', 'tel', 'text', 'time',
	    'url', 'week'];

	module.exports = BaseEvent(changeLambda);

	function changeLambda(ev) {
	    var target = ev.target

	    var isValid =
	        (ev.type === 'input' && VALID_INPUT.indexOf(target.type) !== -1) ||
	        (ev.type === 'change' && VALID_CHANGE.indexOf(target.type) !== -1);

	    if (!isValid) {
	        if (ev.startPropagation) {
	            ev.startPropagation()
	        }
	        return
	    }

	    var value = getFormData(ev.currentTarget)
	    var data = extend(value, this.data)

	    return data
	}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var BaseEvent = __webpack_require__(38);

	module.exports = BaseEvent(keyLambda);

	function keyLambda(ev) {
	    var key = this.opts.key;

	    if (ev.keyCode === key) {
	        return this.data;
	    }
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(65)
	var isObject = __webpack_require__(66)

	var VPatch = __webpack_require__(39)
	var isVNode = __webpack_require__(32)
	var isVText = __webpack_require__(33)
	var isWidget = __webpack_require__(34)
	var isThunk = __webpack_require__(35)
	var handleThunk = __webpack_require__(40)

	module.exports = diff

	function diff(a, b) {
	    var patch = { a: a }
	    walk(a, b, patch, 0)
	    return patch
	}

	function walk(a, b, patch, index) {
	    if (a === b) {
	        if (isThunk(a) || isThunk(b)) {
	            thunks(a, b, patch, index)
	        } else {
	            hooks(b, patch, index)
	        }
	        return
	    }

	    var apply = patch[index]

	    if (b == null) {
	        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
	        destroyWidgets(a, patch, index)
	    } else if (isThunk(a) || isThunk(b)) {
	        thunks(a, b, patch, index)
	    } else if (isVNode(b)) {
	        if (isVNode(a)) {
	            if (a.tagName === b.tagName &&
	                a.namespace === b.namespace &&
	                a.key === b.key) {
	                var propsPatch = diffProps(a.properties, b.properties, b.hooks)
	                if (propsPatch) {
	                    apply = appendPatch(apply,
	                        new VPatch(VPatch.PROPS, a, propsPatch))
	                }
	            } else {
	                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	                destroyWidgets(a, patch, index)
	            }

	            apply = diffChildren(a, b, patch, apply, index)
	        } else {
	            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
	            destroyWidgets(a, patch, index)
	        }
	    } else if (isVText(b)) {
	        if (!isVText(a)) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	            destroyWidgets(a, patch, index)
	        } else if (a.text !== b.text) {
	            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
	        }
	    } else if (isWidget(b)) {
	        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))

	        if (!isWidget(a)) {
	            destroyWidgets(a, patch, index)
	        }
	    }

	    if (apply) {
	        patch[index] = apply
	    }
	}

	function diffProps(a, b, hooks) {
	    var diff

	    for (var aKey in a) {
	        if (!(aKey in b)) {
	            diff = diff || {}
	            diff[aKey] = undefined
	        }

	        var aValue = a[aKey]
	        var bValue = b[aKey]

	        if (hooks && aKey in hooks) {
	            diff = diff || {}
	            diff[aKey] = bValue
	        } else {
	            if (isObject(aValue) && isObject(bValue)) {
	                if (getPrototype(bValue) !== getPrototype(aValue)) {
	                    diff = diff || {}
	                    diff[aKey] = bValue
	                } else {
	                    var objectDiff = diffProps(aValue, bValue)
	                    if (objectDiff) {
	                        diff = diff || {}
	                        diff[aKey] = objectDiff
	                    }
	                }
	            } else if (aValue !== bValue) {
	                diff = diff || {}
	                diff[aKey] = bValue
	            }
	        }
	    }

	    for (var bKey in b) {
	        if (!(bKey in a)) {
	            diff = diff || {}
	            diff[bKey] = b[bKey]
	        }
	    }

	    return diff
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}

	function diffChildren(a, b, patch, apply, index) {
	    var aChildren = a.children
	    var bChildren = reorder(aChildren, b.children)

	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen

	    for (var i = 0; i < len; i++) {
	        var leftNode = aChildren[i]
	        var rightNode = bChildren[i]
	        index += 1

	        if (!leftNode) {
	            if (rightNode) {
	                // Excess nodes in b need to be added
	                apply = appendPatch(apply,
	                    new VPatch(VPatch.INSERT, null, rightNode))
	            }
	        } else if (!rightNode) {
	            if (leftNode) {
	                // Excess nodes in a need to be removed
	                patch[index] = new VPatch(VPatch.REMOVE, leftNode, null)
	                destroyWidgets(leftNode, patch, index)
	            }
	        } else {
	            walk(leftNode, rightNode, patch, index)
	        }

	        if (isVNode(leftNode) && leftNode.count) {
	            index += leftNode.count
	        }
	    }

	    if (bChildren.moves) {
	        // Reorder nodes last
	        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, bChildren.moves))
	    }

	    return apply
	}

	// Patch records for all destroyed widgets must be added because we need
	// a DOM node reference for the destroy function
	function destroyWidgets(vNode, patch, index) {
	    if (isWidget(vNode)) {
	        if (typeof vNode.destroy === "function") {
	            patch[index] = new VPatch(VPatch.REMOVE, vNode, null)
	        }
	    } else if (isVNode(vNode) && vNode.hasWidgets) {
	        var children = vNode.children
	        var len = children.length
	        for (var i = 0; i < len; i++) {
	            var child = children[i]
	            index += 1

	            destroyWidgets(child, patch, index)

	            if (isVNode(child) && child.count) {
	                index += child.count
	            }
	        }
	    }
	}

	// Create a sub-patch for thunks
	function thunks(a, b, patch, index) {
	    var nodes = handleThunk(a, b);
	    var thunkPatch = diff(nodes.a, nodes.b)
	    if (hasPatches(thunkPatch)) {
	        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
	    }
	}

	function hasPatches(patch) {
	    for (var index in patch) {
	        if (index !== "a") {
	            return true;
	        }
	    }

	    return false;
	}

	// Execute hooks when two nodes are identical
	function hooks(vNode, patch, index) {
	    if (isVNode(vNode)) {
	        if (vNode.hooks) {
	            patch[index] = new VPatch(VPatch.PROPS, vNode.hooks, vNode.hooks)
	        }

	        if (vNode.descendantHooks) {
	            var children = vNode.children
	            var len = children.length
	            for (var i = 0; i < len; i++) {
	                var child = children[i]
	                index += 1

	                hooks(child, patch, index)

	                if (isVNode(child) && child.count) {
	                    index += child.count
	                }
	            }
	        }
	    }
	}

	// List diff, naive left to right reordering
	function reorder(aChildren, bChildren) {

	    var bKeys = keyIndex(bChildren)

	    if (!bKeys) {
	        return bChildren
	    }

	    var aKeys = keyIndex(aChildren)

	    if (!aKeys) {
	        return bChildren
	    }

	    var bMatch = {}, aMatch = {}

	    for (var key in bKeys) {
	        bMatch[bKeys[key]] = aKeys[key]
	    }

	    for (var key in aKeys) {
	        aMatch[aKeys[key]] = bKeys[key]
	    }

	    var aLen = aChildren.length
	    var bLen = bChildren.length
	    var len = aLen > bLen ? aLen : bLen
	    var shuffle = []
	    var freeIndex = 0
	    var i = 0
	    var moveIndex = 0
	    var moves = {}
	    var removes = moves.removes = {}
	    var reverse = moves.reverse = {}
	    var hasMoves = false

	    while (freeIndex < len) {
	        var move = aMatch[i]
	        if (move !== undefined) {
	            shuffle[i] = bChildren[move]
	            if (move !== moveIndex) {
	                moves[move] = moveIndex
	                reverse[moveIndex] = move
	                hasMoves = true
	            }
	            moveIndex++
	        } else if (i in aMatch) {
	            shuffle[i] = undefined
	            removes[i] = moveIndex++
	            hasMoves = true
	        } else {
	            while (bMatch[freeIndex] !== undefined) {
	                freeIndex++
	            }

	            if (freeIndex < len) {
	                var freeChild = bChildren[freeIndex]
	                if (freeChild) {
	                    shuffle[i] = freeChild
	                    if (freeIndex !== moveIndex) {
	                        hasMoves = true
	                        moves[freeIndex] = moveIndex
	                        reverse[moveIndex] = freeIndex
	                    }
	                    moveIndex++
	                }
	                freeIndex++
	            }
	        }
	        i++
	    }

	    if (hasMoves) {
	        shuffle.moves = moves
	    }

	    return shuffle
	}

	function keyIndex(children) {
	    var i, keys

	    for (i = 0; i < children.length; i++) {
	        var child = children[i]

	        if (child.key !== undefined) {
	            keys = keys || {}
	            keys[child.key] = i
	        }
	    }

	    return keys
	}

	function appendPatch(apply, patch) {
	    if (apply) {
	        if (isArray(apply)) {
	            apply.push(patch)
	        } else {
	            apply = [apply, patch]
	        }

	        return apply
	    } else {
	        return patch
	    }
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(72)
	var isArray = __webpack_require__(67)

	var domIndex = __webpack_require__(41)
	var patchOp = __webpack_require__(42)
	module.exports = patch

	function patch(rootNode, patches) {
	    return patchRecursive(rootNode, patches)
	}

	function patchRecursive(rootNode, patches, renderOptions) {
	    var indices = patchIndices(patches)

	    if (indices.length === 0) {
	        return rootNode
	    }

	    var index = domIndex(rootNode, patches.a, indices)
	    var ownerDocument = rootNode.ownerDocument

	    if (!renderOptions) {
	        renderOptions = { patch: patchRecursive }
	        if (ownerDocument !== document) {
	            renderOptions.document = ownerDocument
	        }
	    }

	    for (var i = 0; i < indices.length; i++) {
	        var nodeIndex = indices[i]
	        rootNode = applyPatch(rootNode,
	            index[nodeIndex],
	            patches[nodeIndex],
	            renderOptions)
	    }

	    return rootNode
	}

	function applyPatch(rootNode, domNode, patchList, renderOptions) {
	    if (!domNode) {
	        return rootNode
	    }

	    var newNode

	    if (isArray(patchList)) {
	        for (var i = 0; i < patchList.length; i++) {
	            newNode = patchOp(patchList[i], domNode, renderOptions)

	            if (domNode === rootNode) {
	                rootNode = newNode
	            }
	        }
	    } else {
	        newNode = patchOp(patchList, domNode, renderOptions)

	        if (domNode === rootNode) {
	            rootNode = newNode
	        }
	    }

	    return rootNode
	}

	function patchIndices(patches) {
	    var indices = []

	    for (var key in patches) {
	        if (key !== "a") {
	            indices.push(Number(key))
	        }
	    }

	    return indices
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(72)

	var applyProperties = __webpack_require__(43)

	var isVNode = __webpack_require__(32)
	var isVText = __webpack_require__(33)
	var isWidget = __webpack_require__(34)
	var handleThunk = __webpack_require__(40)

	module.exports = createElement

	function createElement(vnode, opts) {
	    var doc = opts ? opts.document || document : document
	    var warn = opts ? opts.warn : null

	    vnode = handleThunk(vnode).a

	    if (isWidget(vnode)) {
	        return vnode.init()
	    } else if (isVText(vnode)) {
	        return doc.createTextNode(vnode.text)
	    } else if (!isVNode(vnode)) {
	        if (warn) {
	            warn("Item is not a valid virtual dom node", vnode)
	        }
	        return null
	    }

	    var node = (vnode.namespace === null) ?
	        doc.createElement(vnode.tagName) :
	        doc.createElementNS(vnode.namespace, vnode.tagName)

	    var props = vnode.properties
	    applyProperties(node, props)

	    var children = vnode.children

	    for (var i = 0; i < children.length; i++) {
	        var childNode = createElement(children[i], opts)
	        if (childNode) {
	            node.appendChild(childNode)
	        }
	    }

	    return node
	}


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var globalDocument = __webpack_require__(62)
	var DataSet = __webpack_require__(73)
	var createStore = __webpack_require__(76)

	var addEvent = __webpack_require__(53)
	var removeEvent = __webpack_require__(54)
	var ProxyEvent = __webpack_require__(55)

	var HANDLER_STORE = createStore()

	module.exports = DOMDelegator

	function DOMDelegator(document) {
	    document = document || globalDocument

	    this.target = document.documentElement
	    this.events = {}
	    this.rawEventListeners = {}
	    this.globalListeners = {}
	}

	DOMDelegator.prototype.addEventListener = addEvent
	DOMDelegator.prototype.removeEventListener = removeEvent

	DOMDelegator.allocateHandle =
	    function allocateHandle(func) {
	        var handle = new Handle()

	        HANDLER_STORE(handle).func = func;

	        return handle
	    }

	DOMDelegator.transformHandle =
	    function transformHandle(handle, lambda) {
	        var func = HANDLER_STORE(handle).func

	        return this.allocateHandle(function (ev) {
	            var result = lambda(ev)
	            if (result) {
	                func(result)
	            }
	        })
	    }

	DOMDelegator.prototype.addGlobalEventListener =
	    function addGlobalEventListener(eventName, fn) {
	        var listeners = this.globalListeners[eventName] || [];
	        if (listeners.indexOf(fn) === -1) {
	            listeners.push(fn)
	        }

	        this.globalListeners[eventName] = listeners;
	    }

	DOMDelegator.prototype.removeGlobalEventListener =
	    function removeGlobalEventListener(eventName, fn) {
	        var listeners = this.globalListeners[eventName] || [];

	        var index = listeners.indexOf(fn)
	        if (index !== -1) {
	            listeners.splice(index, 1)
	        }
	    }

	DOMDelegator.prototype.listenTo = function listenTo(eventName) {
	    if (this.events[eventName]) {
	        return
	    }

	    this.events[eventName] = true

	    var listener = this.rawEventListeners[eventName]
	    if (!listener) {
	        listener = this.rawEventListeners[eventName] =
	            createHandler(eventName, this)
	    }

	    this.target.addEventListener(eventName, listener, true)
	}

	DOMDelegator.prototype.unlistenTo = function unlistenTo(eventName) {
	    if (!this.events[eventName]) {
	        return
	    }

	    this.events[eventName] = false
	    var listener = this.rawEventListeners[eventName]

	    if (!listener) {
	        throw new Error("dom-delegator#unlistenTo: cannot " +
	            "unlisten to " + eventName)
	    }

	    this.target.removeEventListener(eventName, listener, true)
	}

	function createHandler(eventName, delegator) {
	    var globalListeners = delegator.globalListeners;
	    var delegatorTarget = delegator.target;

	    return handler

	    function handler(ev) {
	        var globalHandlers = globalListeners[eventName] || []

	        if (globalHandlers.length > 0) {
	            var globalEvent = new ProxyEvent(ev);
	            globalEvent.currentTarget = delegatorTarget;
	            callListeners(globalHandlers, globalEvent)
	        }

	        findAndInvokeListeners(ev.target, ev, eventName)
	    }
	}

	function findAndInvokeListeners(elem, ev, eventName) {
	    var listener = getListener(elem, eventName)

	    if (listener && listener.handlers.length > 0) {
	        var listenerEvent = new ProxyEvent(ev);
	        listenerEvent.currentTarget = listener.currentTarget
	        callListeners(listener.handlers, listenerEvent)

	        if (listenerEvent._bubbles) {
	            var nextTarget = listener.currentTarget.parentNode
	            findAndInvokeListeners(nextTarget, ev, eventName)
	        }
	    }
	}

	function getListener(target, type) {
	    // terminate recursion if parent is `null`
	    if (target === null) {
	        return null
	    }

	    var ds = DataSet(target)
	    // fetch list of handler fns for this event
	    var handler = ds[type]
	    var allHandler = ds.event

	    if (!handler && !allHandler) {
	        return getListener(target.parentNode, type)
	    }

	    var handlers = [].concat(handler || [], allHandler || [])
	    return new Listener(target, handlers)
	}

	function callListeners(handlers, ev) {
	    handlers.forEach(function (handler) {
	        if (typeof handler === "function") {
	            handler(ev)
	        } else if (typeof handler.handleEvent === "function") {
	            handler.handleEvent(ev)
	        } else if (handler.type === "dom-delegator-handle") {
	            HANDLER_STORE(handler).func(ev)
	        } else {
	            throw new Error("dom-delegator: unknown handler " +
	                "found: " + JSON.stringify(handlers));
	        }
	    })
	}

	function Listener(target, handlers) {
	    this.currentTarget = target
	    this.handlers = handlers
	}

	function Handle() {
	    this.type = "dom-delegator-handle"
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var slice = Array.prototype.slice

	var addListener = __webpack_require__(30)
	var setNonEnumerable = __webpack_require__(64);

	module.exports = splice

	// `obs.splice` is a mutable implementation of `splice()`
	// that mutates both `list` and the internal `valueList` that
	// is the current value of `obs` itself
	function splice(index, amount) {
	    var obs = this
	    var args = slice.call(arguments, 0)
	    var valueList = obs().slice()

	    // generate a list of args to mutate the internal
	    // list of only obs
	    var valueArgs = args.map(function (value, index) {
	        if (index === 0 || index === 1) {
	            return value
	        }

	        // must unpack observables that we are adding
	        return typeof value === "function" ? value() : value
	    })

	    valueList.splice.apply(valueList, valueArgs)
	    // we remove the observs that we remove
	    var removed = obs._list.splice.apply(obs._list, args)

	    var extraRemoveListeners = args.slice(2).map(function (observ) {
	        return typeof observ === "function" ?
	            addListener(obs, observ) :
	            null
	    })
	    extraRemoveListeners.unshift(args[0], args[1])
	    var removedListeners = obs._removeListeners.splice
	        .apply(obs._removeListeners, extraRemoveListeners)

	    removedListeners.forEach(function (removeObservListener) {
	        if (removeObservListener) {
	            removeObservListener()
	        }
	    })

	    setNonEnumerable(valueList, "_diff", [valueArgs])

	    obs.set(valueList)
	    return removed
	}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var addListener = __webpack_require__(30)
	var setNonEnumerable = __webpack_require__(64);

	module.exports = put

	// `obs.put` is a mutable implementation of `array[index] = value`
	// that mutates both `list` and the internal `valueList` that
	// is the current value of `obs` itself
	function put(index, value) {
	    var obs = this
	    var valueList = obs().slice()

	    var originalLength = valueList.length
	    valueList[index] = typeof value === "function" ? value() : value

	    obs._list[index] = value

	    // remove past value listener if was observ
	    var removeListener = obs._removeListeners[index]
	    if (removeListener){
	        removeListener()
	    }

	    // add listener to value if observ
	    obs._removeListeners[index] = typeof value === "function" ?
	        addListener(obs, value) :
	        null

	    // fake splice diff
	    var valueArgs = index < originalLength ? 
	        [index, 1, valueList[index]] :
	        [index, 0, valueList[index]]

	    setNonEnumerable(valueList, "_diff", [valueArgs])

	    obs.set(valueList)
	    return value
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var addListener = __webpack_require__(30)
	var setNonEnumerable = __webpack_require__(64)
	var adiff = __webpack_require__(74)

	module.exports = transaction

	function transaction (func) {
	    var obs = this
	    var rawList = obs._list.slice()

	    if (func(rawList) !== false){ // allow cancel

	        var changes = adiff.diff(obs._list, rawList)
	        var valueList = obs().slice()

	        var valueChanges = changes.map(applyPatch.bind(obs, valueList))

	        setNonEnumerable(valueList, "_diff", valueChanges)

	        obs.set(valueList)
	        return changes
	    }

	}

	function applyPatch (valueList, args) {
	    var obs = this
	    var valueArgs = args.map(unpack)

	    valueList.splice.apply(valueList, valueArgs)
	    obs._list.splice.apply(obs._list, args)

	    var extraRemoveListeners = args.slice(2).map(function (observ) {
	        return typeof observ === "function" ?
	            addListener(obs, observ) :
	            null
	    })

	    extraRemoveListeners.unshift(args[0], args[1])
	    var removedListeners = obs._removeListeners.splice
	        .apply(obs._removeListeners, extraRemoveListeners)

	    removedListeners.forEach(function (removeObservListener) {
	        if (removeObservListener) {
	            removeObservListener()
	        }
	    })

	    return valueArgs
	}

	function unpack(value, index){
	    if (index === 0 || index === 1) {
	        return value
	    }
	    return typeof value === "function" ? value() : value
	}

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var ObservArray = __webpack_require__(6)

	var slice = Array.prototype.slice

	var ARRAY_METHODS = [
	    "concat", "slice", "every", "filter", "forEach", "indexOf",
	    "join", "lastIndexOf", "map", "reduce", "reduceRight",
	    "some", "toString", "toLocaleString"
	]

	var methods = ARRAY_METHODS.map(function (name) {
	    return [name, function () {
	        var res = this._list[name].apply(this._list, arguments)

	        if (res && Array.isArray(res)) {
	            res = ObservArray(res)
	        }

	        return res
	    }]
	})

	module.exports = ArrayMethods

	function ArrayMethods(obs) {
	    obs.push = observArrayPush
	    obs.pop = observArrayPop
	    obs.shift = observArrayShift
	    obs.unshift = observArrayUnshift
	    obs.reverse = notImplemented
	    obs.sort = notImplemented

	    methods.forEach(function (tuple) {
	        obs[tuple[0]] = tuple[1]
	    })
	    return obs
	}



	function observArrayPush() {
	    var args = slice.call(arguments)
	    args.unshift(this._list.length, 0)
	    this.splice.apply(this, args)

	    return this._list.length
	}
	function observArrayPop() {
	    return this.splice(this._list.length - 1, 1)[0]
	}
	function observArrayShift() {
	    return this.splice(0, 1)[0]
	}
	function observArrayUnshift() {
	    var args = slice.call(arguments)
	    args.unshift(0, 0)
	    this.splice.apply(this, args)

	    return this._list.length
	}


	function notImplemented() {
	    throw new Error("Pull request welcome")
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var setNonEnumerable = __webpack_require__(64);

	module.exports = addListener

	function addListener(observArray, observ) {
	    var list = observArray._list

	    return observ(function (value) {
	        var valueList =  observArray().slice()
	        var index = list.indexOf(observ)

	        // This code path should never hit. If this happens
	        // there's a bug in the cleanup code
	        if (index === -1) {
	            var message = "observ-array: Unremoved observ listener"
	            var err = new Error(message)
	            err.list = list
	            err.index = index
	            err.observ = observ
	            throw err
	        }

	        valueList.splice(index, 1, value)
	        setNonEnumerable(valueList, "_diff", [ [index, 1, value] ])

	        observArray.set(valueList)
	    })
	}


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var shallowEq = __webpack_require__(58);
	var Thunk = __webpack_require__(59);

	module.exports = createPartial;

	function createPartial(eq) {
	    return function partial(fn) {
	        var args = copyOver(arguments, 1);
	        var firstArg = args[0];
	        var key;

	        var eqArgs = eq || shallowEq;

	        if (typeof firstArg === 'object' && firstArg !== null) {
	            if ('key' in firstArg) {
	                key = firstArg.key;
	            } else if ('id' in firstArg) {
	                key = firstArg.id;
	            }
	        }

	        return new Thunk(fn, args, key, eqArgs);
	    };
	}

	function copyOver(list, offset) {
	    var newList = [];
	    for (var i = list.length - 1; i >= offset; i--) {
	        newList[i - offset] = list[i];
	    }
	    return newList;
	}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(60)

	module.exports = isVirtualNode

	function isVirtualNode(x) {
	    return x && x.type === "VirtualNode" && x.version === version
	}


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(60)

	module.exports = isVirtualText

	function isVirtualText(x) {
	    return x && x.type === "VirtualText" && x.version === version
	}


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = isWidget

	function isWidget(w) {
	    return w && w.type === "Widget"
	}


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = isThunk

	function isThunk(t) {
	    return t && t.type === "Thunk"
	}


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/
	var notClassId = /^\.|#/

	module.exports = parseTag

	function parseTag(tag, props) {
	    if (!tag) {
	        return "div"
	    }

	    var noId = !("id" in props)

	    var tagParts = tag.split(classIdSplit)
	    var tagName = null

	    if (notClassId.test(tagParts[1])) {
	        tagName = "div"
	    }

	    var classes, part, type, i
	    for (i = 0; i < tagParts.length; i++) {
	        part = tagParts[i]

	        if (!part) {
	            continue
	        }

	        type = part.charAt(0)

	        if (!tagName) {
	            tagName = part
	        } else if (type === ".") {
	            classes = classes || []
	            classes.push(part.substring(1, part.length))
	        } else if (type === "#" && noId) {
	            props.id = part.substring(1, part.length)
	        }
	    }

	    if (classes) {
	        if (props.className) {
	            classes.push(props.className)
	        }

	        props.className = classes.join(" ")
	    }

	    return tagName ? tagName.toLowerCase() : "div"
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Event

	function Event() {
	    var listeners = []

	    return { broadcast: broadcast, listen: event }

	    function broadcast(value) {
	        for (var i = 0; i < listeners.length; i++) {
	            listeners[i](value)
	        }
	    }

	    function event(listener) {
	        listeners.push(listener)

	        return removeListener

	        function removeListener() {
	            var index = listeners.indexOf(listener)
	            if (index !== -1) {
	                listeners.splice(index, 1)
	            }
	        }
	    }
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Delegator = __webpack_require__(5)

	module.exports = BaseEvent

	function BaseEvent(lambda) {
	    return EventHandler;

	    function EventHandler(fn, data, opts) {
	        var handler = {
	            fn: fn,
	            data: data || {},
	            opts: opts || {},
	            handleEvent: handleEvent
	        }

	        if (fn && fn.type === 'dom-delegator-handle') {
	            return Delegator.transformHandle(fn,
	                handleLambda.bind(handler))
	        }

	        return handler;
	    }

	    function handleLambda(ev) {
	        return lambda.call(this, ev)
	    }

	    function handleEvent(ev) {
	        var value = lambda.call(this, ev)
	        if (!value) {
	            return
	        }

	        if (typeof this.fn === 'function') {
	            this.fn(value)
	        } else {
	            this.fn.write(value)
	        }
	    }
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(60)

	VirtualPatch.NONE = 0
	VirtualPatch.VTEXT = 1
	VirtualPatch.VNODE = 2
	VirtualPatch.WIDGET = 3
	VirtualPatch.PROPS = 4
	VirtualPatch.ORDER = 5
	VirtualPatch.INSERT = 6
	VirtualPatch.REMOVE = 7
	VirtualPatch.THUNK = 8

	module.exports = VirtualPatch

	function VirtualPatch(type, vNode, patch) {
	    this.type = Number(type)
	    this.vNode = vNode
	    this.patch = patch
	}

	VirtualPatch.prototype.version = version
	VirtualPatch.prototype.type = "VirtualPatch"


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var isVNode = __webpack_require__(32)
	var isVText = __webpack_require__(33)
	var isWidget = __webpack_require__(34)
	var isThunk = __webpack_require__(35)

	module.exports = handleThunk

	function handleThunk(a, b) {
	    var renderedA = a
	    var renderedB = b

	    if (isThunk(b)) {
	        renderedB = renderThunk(b, a)
	    }

	    if (isThunk(a)) {
	        renderedA = renderThunk(a, null)
	    }

	    return {
	        a: renderedA,
	        b: renderedB
	    }
	}

	function renderThunk(thunk, previous) {
	    var renderedThunk = thunk.vnode

	    if (!renderedThunk) {
	        renderedThunk = thunk.vnode = thunk.render(previous)
	    }

	    if (!(isVNode(renderedThunk) ||
	            isVText(renderedThunk) ||
	            isWidget(renderedThunk))) {
	        throw new Error("thunk did not return a valid node");
	    }

	    return renderedThunk
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
	// We don't want to read all of the DOM nodes in the tree so we use
	// the in-order tree indexing to eliminate recursion down certain branches.
	// We only recurse into a DOM node if we know that it contains a child of
	// interest.

	var noChild = {}

	module.exports = domIndex

	function domIndex(rootNode, tree, indices, nodes) {
	    if (!indices || indices.length === 0) {
	        return {}
	    } else {
	        indices.sort(ascending)
	        return recurse(rootNode, tree, indices, nodes, 0)
	    }
	}

	function recurse(rootNode, tree, indices, nodes, rootIndex) {
	    nodes = nodes || {}


	    if (rootNode) {
	        if (indexInRange(indices, rootIndex, rootIndex)) {
	            nodes[rootIndex] = rootNode
	        }

	        var vChildren = tree.children

	        if (vChildren) {

	            var childNodes = rootNode.childNodes

	            for (var i = 0; i < tree.children.length; i++) {
	                rootIndex += 1

	                var vChild = vChildren[i] || noChild
	                var nextIndex = rootIndex + (vChild.count || 0)

	                // skip recursion down the tree if there are no nodes down here
	                if (indexInRange(indices, rootIndex, nextIndex)) {
	                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
	                }

	                rootIndex = nextIndex
	            }
	        }
	    }

	    return nodes
	}

	// Binary search for an index in the interval [left, right]
	function indexInRange(indices, left, right) {
	    if (indices.length === 0) {
	        return false
	    }

	    var minIndex = 0
	    var maxIndex = indices.length - 1
	    var currentIndex
	    var currentItem

	    while (minIndex <= maxIndex) {
	        currentIndex = ((maxIndex + minIndex) / 2) >> 0
	        currentItem = indices[currentIndex]

	        if (minIndex === maxIndex) {
	            return currentItem >= left && currentItem <= right
	        } else if (currentItem < left) {
	            minIndex = currentIndex + 1
	        } else  if (currentItem > right) {
	            maxIndex = currentIndex - 1
	        } else {
	            return true
	        }
	    }

	    return false;
	}

	function ascending(a, b) {
	    return a > b ? 1 : -1
	}


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var applyProperties = __webpack_require__(43)

	var isWidget = __webpack_require__(34)
	var VPatch = __webpack_require__(39)

	var render = __webpack_require__(24)
	var updateWidget = __webpack_require__(68)

	module.exports = applyPatch

	function applyPatch(vpatch, domNode, renderOptions) {
	    var type = vpatch.type
	    var vNode = vpatch.vNode
	    var patch = vpatch.patch

	    switch (type) {
	        case VPatch.REMOVE:
	            return removeNode(domNode, vNode)
	        case VPatch.INSERT:
	            return insertNode(domNode, patch, renderOptions)
	        case VPatch.VTEXT:
	            return stringPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.WIDGET:
	            return widgetPatch(domNode, vNode, patch, renderOptions)
	        case VPatch.VNODE:
	            return vNodePatch(domNode, vNode, patch, renderOptions)
	        case VPatch.ORDER:
	            reorderChildren(domNode, patch)
	            return domNode
	        case VPatch.PROPS:
	            applyProperties(domNode, patch, vNode.properties)
	            return domNode
	        case VPatch.THUNK:
	            return replaceRoot(domNode,
	                renderOptions.patch(domNode, patch, renderOptions))
	        default:
	            return domNode
	    }
	}

	function removeNode(domNode, vNode) {
	    var parentNode = domNode.parentNode

	    if (parentNode) {
	        parentNode.removeChild(domNode)
	    }

	    destroyWidget(domNode, vNode);

	    return null
	}

	function insertNode(parentNode, vNode, renderOptions) {
	    var newNode = render(vNode, renderOptions)

	    if (parentNode) {
	        parentNode.appendChild(newNode)
	    }

	    return parentNode
	}

	function stringPatch(domNode, leftVNode, vText, renderOptions) {
	    var newNode

	    if (domNode.nodeType === 3) {
	        domNode.replaceData(0, domNode.length, vText.text)
	        newNode = domNode
	    } else {
	        var parentNode = domNode.parentNode
	        newNode = render(vText, renderOptions)

	        if (parentNode) {
	            parentNode.replaceChild(newNode, domNode)
	        }
	    }

	    destroyWidget(domNode, leftVNode)

	    return newNode
	}

	function widgetPatch(domNode, leftVNode, widget, renderOptions) {
	    if (updateWidget(leftVNode, widget)) {
	        return widget.update(leftVNode, domNode) || domNode
	    }

	    var parentNode = domNode.parentNode
	    var newWidget = render(widget, renderOptions)

	    if (parentNode) {
	        parentNode.replaceChild(newWidget, domNode)
	    }

	    destroyWidget(domNode, leftVNode)

	    return newWidget
	}

	function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
	    var parentNode = domNode.parentNode
	    var newNode = render(vNode, renderOptions)

	    if (parentNode) {
	        parentNode.replaceChild(newNode, domNode)
	    }

	    destroyWidget(domNode, leftVNode)

	    return newNode
	}

	function destroyWidget(domNode, w) {
	    if (typeof w.destroy === "function" && isWidget(w)) {
	        w.destroy(domNode)
	    }
	}

	function reorderChildren(domNode, bIndex) {
	    var children = []
	    var childNodes = domNode.childNodes
	    var len = childNodes.length
	    var i
	    var reverseIndex = bIndex.reverse

	    for (i = 0; i < len; i++) {
	        children.push(domNode.childNodes[i])
	    }

	    var insertOffset = 0
	    var move
	    var node
	    var insertNode
	    for (i = 0; i < len; i++) {
	        move = bIndex[i]
	        if (move !== undefined && move !== i) {
	            // the element currently at this index will be moved later so increase the insert offset
	            if (reverseIndex[i] > i) {
	                insertOffset++
	            }

	            node = children[move]
	            insertNode = childNodes[i + insertOffset]
	            if (node !== insertNode) {
	                domNode.insertBefore(node, insertNode)
	            }

	            // the moved element came from the front of the array so reduce the insert offset
	            if (move < i) {
	                insertOffset--
	            }
	        }

	        // element at this index is scheduled to be removed so increase insert offset
	        if (i in bIndex.removes) {
	            insertOffset++
	        }
	    }
	}

	function replaceRoot(oldRoot, newRoot) {
	    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
	        console.log(oldRoot)
	        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
	    }

	    return newRoot;
	}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(77)
	var isHook = __webpack_require__(46)

	module.exports = applyProperties

	function applyProperties(node, props, previous) {
	    for (var propName in props) {
	        var propValue = props[propName]

	        if (propValue === undefined) {
	            removeProperty(node, props, previous, propName);
	        } else if (isHook(propValue)) {
	            propValue.hook(node,
	                propName,
	                previous ? previous[propName] : undefined)
	        } else {
	            if (isObject(propValue)) {
	                patchObject(node, props, previous, propName, propValue);
	            } else if (propValue !== undefined) {
	                node[propName] = propValue
	            }
	        }
	    }
	}

	function removeProperty(node, props, previous, propName) {
	    if (previous) {
	        var previousValue = previous[propName]

	        if (!isHook(previousValue)) {
	            if (propName === "style") {
	                for (var i in previousValue) {
	                    node.style[i] = ""
	                }
	            } else if (typeof previousValue === "string") {
	                node[propName] = ""
	            } else {
	                node[propName] = null
	            }
	        }
	    }
	}

	function patchObject(node, props, previous, propName, propValue) {
	    if(previous && isObject(previous[propName]) &&
	        getPrototype(previous[propName]) !== getPrototype(propValue)) {
	        node[propName] = previousValue
	        return
	    }

	    if (!isObject(node[propName])) {
	        node[propName] = {}
	    }

	    var replacer = propName === "style" ? "" : undefined

	    for (var k in propValue) {
	        var value = propValue[k]
	        node[propName][k] = (value === undefined) ? replacer : value
	    }
	}

	function getPrototype(value) {
	    if (Object.getPrototypeOf) {
	        return Object.getPrototypeOf(value)
	    } else if (value.__proto__) {
	        return value.__proto__
	    } else if (value.constructor) {
	        return value.constructor.prototype
	    }
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(60)
	var isVNode = __webpack_require__(32)
	var isWidget = __webpack_require__(34)
	var isVHook = __webpack_require__(46)

	module.exports = VirtualNode

	var noProperties = {}
	var noChildren = []

	function VirtualNode(tagName, properties, children, key, namespace) {
	    this.tagName = tagName
	    this.properties = properties || noProperties
	    this.children = children || noChildren
	    this.key = key != null ? String(key) : undefined
	    this.namespace = (typeof namespace === "string") ? namespace : null

	    var count = (children && children.length) || 0
	    var descendants = 0
	    var hasWidgets = false
	    var descendantHooks = false
	    var hooks

	    for (var propName in properties) {
	        if (properties.hasOwnProperty(propName)) {
	            var property = properties[propName]
	            if (isVHook(property)) {
	                if (!hooks) {
	                    hooks = {}
	                }

	                hooks[propName] = property
	            }
	        }
	    }

	    for (var i = 0; i < count; i++) {
	        var child = children[i]
	        if (isVNode(child)) {
	            descendants += child.count || 0

	            if (!hasWidgets && child.hasWidgets) {
	                hasWidgets = true
	            }

	            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
	                descendantHooks = true
	            }
	        } else if (!hasWidgets && isWidget(child)) {
	            if (typeof child.destroy === "function") {
	                hasWidgets = true
	            }
	        }
	    }

	    this.count = count + descendants
	    this.hasWidgets = hasWidgets
	    this.hooks = hooks
	    this.descendantHooks = descendantHooks
	}

	VirtualNode.prototype.version = version
	VirtualNode.prototype.type = "VirtualNode"


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var version = __webpack_require__(60)

	module.exports = VirtualText

	function VirtualText(text) {
	    this.text = String(text)
	}

	VirtualText.prototype.version = version
	VirtualText.prototype.type = "VirtualText"


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = isHook

	function isHook(hook) {
	    return hook && typeof hook.hook === "function" &&
	        !hook.hasOwnProperty("hook")
	}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = SoftSetHook;

	function SoftSetHook(value) {
	    if (!(this instanceof SoftSetHook)) {
	        return new SoftSetHook(value);
	    }

	    this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName) {
	    if (node[propertyName] !== this.value) {
	        node[propertyName] = this.value;
	    }
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var DataSet = __webpack_require__(78)

	module.exports = DataSetHook;

	function DataSetHook(value) {
	    if (!(this instanceof DataSetHook)) {
	        return new DataSetHook(value);
	    }

	    this.value = value;
	}

	DataSetHook.prototype.hook = function (node, propertyName) {
	    var ds = DataSet(node)
	    var propName = propertyName.substr(5)

	    ds[propName] = this.value;
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var DataSet = __webpack_require__(78)

	module.exports = DataSetHook;

	function DataSetHook(value) {
	    if (!(this instanceof DataSetHook)) {
	        return new DataSetHook(value);
	    }

	    this.value = value;
	}

	DataSetHook.prototype.hook = function (node, propertyName) {
	    var ds = DataSet(node)
	    var propName = propertyName.substr(3)

	    ds[propName] = this.value;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = AttributeHook;

	function AttributeHook(value) {
	    if (!(this instanceof AttributeHook)) {
	        return new AttributeHook(value);
	    }

	    this.value = value;
	}

	AttributeHook.prototype.hook = function (node, prop, prev) {
	    if (prev && prev.value === this.value) {
	        return;
	    }

	    node.setAttributeNS(null, prop, this.value)
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var now = __webpack_require__(92)
	  , global = typeof window === 'undefined' ? {} : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = global['request' + suffix]
	  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]
	  , isNative = true

	for(var i = 0; i < vendors.length && !raf; i++) {
	  raf = global[vendors[i] + 'Request' + suffix]
	  caf = global[vendors[i] + 'Cancel' + suffix]
	      || global[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  isNative = false

	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  if(!isNative) {
	    return raf.call(global, fn)
	  }
	  return raf.call(global, function() {
	    try{
	      fn.apply(this, arguments)
	    } catch(e) {
	      setTimeout(function() { throw e }, 0)
	    }
	  })
	}
	module.exports.cancel = function() {
	  caf.apply(global, arguments)
	}


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};

	module.exports = Individual

	function Individual(key, value) {
	    if (root[key]) {
	        return root[key]
	    }

	    Object.defineProperty(root, key, {
	        value: value
	        , configurable: true
	    })

	    return value
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var DataSet = __webpack_require__(73)

	module.exports = addEvent

	function addEvent(target, type, handler) {
	    var ds = DataSet(target)
	    var events = ds[type]

	    if (!events) {
	        ds[type] = handler
	    } else if (Array.isArray(events)) {
	        if (events.indexOf(handler) === -1) {
	            events.push(handler)
	        }
	    } else if (events !== handler) {
	        ds[type] = [events, handler]
	    }
	}


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var DataSet = __webpack_require__(73)

	module.exports = removeEvent

	function removeEvent(target, type, handler) {
	    var ds = DataSet(target)
	    var events = ds[type]

	    if (!events) {
	        return
	    } else if (Array.isArray(events)) {
	        var index = events.indexOf(handler)
	        if (index !== -1) {
	            events.splice(index, 1)
	        }
	    } else if (events === handler) {
	        ds[type] = null
	    }
	}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var inherits = __webpack_require__(85)

	var ALL_PROPS = [
	    "altKey", "bubbles", "cancelable", "ctrlKey",
	    "eventPhase", "metaKey", "relatedTarget", "shiftKey",
	    "target", "timeStamp", "type", "view", "which"
	]
	var KEY_PROPS = ["char", "charCode", "key", "keyCode"]
	var MOUSE_PROPS = [
	    "button", "buttons", "clientX", "clientY", "layerX",
	    "layerY", "offsetX", "offsetY", "pageX", "pageY",
	    "screenX", "screenY", "toElement"
	]

	var rkeyEvent = /^key|input/
	var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/

	module.exports = ProxyEvent

	function ProxyEvent(ev) {
	    if (!(this instanceof ProxyEvent)) {
	        return new ProxyEvent(ev)
	    }

	    if (rkeyEvent.test(ev.type)) {
	        return new KeyEvent(ev)
	    } else if (rmouseEvent.test(ev.type)) {
	        return new MouseEvent(ev)
	    }

	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i]
	        this[propKey] = ev[propKey]
	    }

	    this._rawEvent = ev
	    this._bubbles = false;
	}

	ProxyEvent.prototype.preventDefault = function () {
	    this._rawEvent.preventDefault()
	}

	ProxyEvent.prototype.startPropagation = function () {
	    this._bubbles = true;
	}

	function MouseEvent(ev) {
	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i]
	        this[propKey] = ev[propKey]
	    }

	    for (var j = 0; j < MOUSE_PROPS.length; j++) {
	        var mousePropKey = MOUSE_PROPS[j]
	        this[mousePropKey] = ev[mousePropKey]
	    }

	    this._rawEvent = ev
	}

	inherits(MouseEvent, ProxyEvent)

	function KeyEvent(ev) {
	    for (var i = 0; i < ALL_PROPS.length; i++) {
	        var propKey = ALL_PROPS[i]
	        this[propKey] = ev[propKey]
	    }

	    for (var j = 0; j < KEY_PROPS.length; j++) {
	        var keyPropKey = KEY_PROPS[j]
	        this[keyPropKey] = ev[keyPropKey]
	    }

	    this._rawEvent = ev
	}

	inherits(KeyEvent, ProxyEvent)


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = extend

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = extend

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = shallowEq;

	function shallowEq(currentArgs, previousArgs) {
	    if (currentArgs.length === 0 && previousArgs.length === 0) {
	        return true;
	    }

	    if (currentArgs.length !== previousArgs.length) {
	        return false;
	    }

	    var len = currentArgs.length;

	    for (var i = 0; i < len; i++) {
	        if (currentArgs[i] !== previousArgs[i]) {
	            return false;
	        }
	    }

	    return true;
	}


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	function Thunk(fn, args, key, eqArgs) {
	    this.fn = fn;
	    this.args = args;
	    this.key = key;
	    this.eqArgs = eqArgs;
	}

	Thunk.prototype.type = 'Thunk';
	Thunk.prototype.render = render;
	module.exports = Thunk;

	function shouldUpdate(current, previous) {
	    if (!current || !previous || current.fn !== previous.fn) {
	        return true;
	    }

	    var cargs = current.args;
	    var pargs = previous.args;

	    return !current.eqArgs(cargs, pargs);
	}

	function render(previous) {
	    if (shouldUpdate(this, previous)) {
	        return this.fn.apply(null, this.args);
	    } else {
	        return previous.vnode;
	    }
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "1"


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var camelize = __webpack_require__(87)
	var template = __webpack_require__(88)
	var extend = __webpack_require__(81)

	module.exports = TypedError

	function TypedError(args) {
	    if (!args) {
	        throw new Error("args is required");
	    }
	    if (!args.type) {
	        throw new Error("args.type is required");
	    }
	    if (!args.message) {
	        throw new Error("args.message is required");
	    }

	    var message = args.message

	    if (args.type && !args.name) {
	        var errorName = camelize(args.type) + "Error"
	        args.name = errorName[0].toUpperCase() + errorName.substr(1)
	    }

	    createError.type = args.type;
	    createError._name = args.name;

	    return createError;

	    function createError(opts) {
	        var result = new Error()

	        Object.defineProperty(result, "type", {
	            value: result.type,
	            enumerable: true,
	            writable: true,
	            configurable: true
	        })

	        var options = extend({}, args, opts)

	        extend(result, options)
	        result.message = template(message, options)

	        return result
	    }
	}



/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(75);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var hasKeys = __webpack_require__(79)

	module.exports = extend

	function extend() {
	    var target = {}

	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]

	        if (!hasKeys(source)) {
	            continue
	        }

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = setNonEnumerable;

	function setNonEnumerable(object, key, value) {
	    Object.defineProperty(object, key, {
	        value: value,
	        writable: true,
	        configurable: true,
	        enumerable: false
	    });
	}


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString

	module.exports = nativeIsArray || isArray

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = isObject

	function isObject(x) {
	    return typeof x === "object" && x !== null
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var nativeIsArray = Array.isArray
	var toString = Object.prototype.toString

	module.exports = nativeIsArray || isArray

	function isArray(obj) {
	    return toString.call(obj) === "[object Array]"
	}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var isWidget = __webpack_require__(34)

	module.exports = updateWidget

	function updateWidget(a, b) {
	    if (isWidget(a) && isWidget(b)) {
	        if ("name" in a && "name" in b) {
	            return a.id === b.id
	        } else {
	            return a.init === b.init
	        }
	    }

	    return false
	}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var camelize = __webpack_require__(90)
	var template = __webpack_require__(91)
	var extend = __webpack_require__(81)

	module.exports = TypedError

	function TypedError(args) {
	    if (!args) {
	        throw new Error("args is required");
	    }
	    if (!args.type) {
	        throw new Error("args.type is required");
	    }
	    if (!args.message) {
	        throw new Error("args.message is required");
	    }

	    var message = args.message

	    if (args.type && !args.name) {
	        var errorName = camelize(args.type) + "Error"
	        args.name = errorName[0].toUpperCase() + errorName.substr(1)
	    }

	    createError.type = args.type;
	    createError._name = args.name;

	    return createError;

	    function createError(opts) {
	        var result = new Error()

	        Object.defineProperty(result, "type", {
	            value: result.type,
	            enumerable: true,
	            writable: true,
	            configurable: true
	        })

	        var options = extend({}, args, opts)

	        extend(result, options)
	        result.message = template(message, options)

	        return result
	    }
	}



/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * cuid.js
	 * Collision-resistant UID generator for browsers and node.
	 * Sequential for fast db lookups and recency sorting.
	 * Safe for element IDs and server-side lookups.
	 *
	 * Extracted from CLCTR
	 * 
	 * Copyright (c) Eric Elliott 2012
	 * MIT License
	 */

	/*global window, navigator, document, require, process, module */
	(function (app) {
	  'use strict';
	  var namespace = 'cuid',
	    c = 0,
	    blockSize = 4,
	    base = 36,
	    discreteValues = Math.pow(base, blockSize),

	    pad = function pad(num, size) {
	      var s = "000000000" + num;
	      return s.substr(s.length-size);
	    },

	    randomBlock = function randomBlock() {
	      return pad((Math.random() *
	            discreteValues << 0)
	            .toString(base), blockSize);
	    },

	    safeCounter = function () {
	      c = (c < discreteValues) ? c : 0;
	      c++; // this is not subliminal
	      return c - 1;
	    },

	    api = function cuid() {
	      // Starting with a lowercase letter makes
	      // it HTML element ID friendly.
	      var letter = 'c', // hard-coded allows for sequential access

	        // timestamp
	        // warning: this exposes the exact date and time
	        // that the uid was created.
	        timestamp = (new Date().getTime()).toString(base),

	        // Prevent same-machine collisions.
	        counter,

	        // A few chars to generate distinct ids for different
	        // clients (so different computers are far less
	        // likely to generate the same id)
	        fingerprint = api.fingerprint(),

	        // Grab some more chars from Math.random()
	        random = randomBlock() + randomBlock();

	        counter = pad(safeCounter().toString(base), blockSize);

	      return  (letter + timestamp + counter + fingerprint + random);
	    };

	  api.slug = function slug() {
	    var date = new Date().getTime().toString(36),
	      counter,
	      print = api.fingerprint().slice(0,1) +
	        api.fingerprint().slice(-1),
	      random = randomBlock().slice(-2);

	      counter = safeCounter().toString(36).slice(-4);

	    return date.slice(-2) + 
	      counter + print + random;
	  };

	  api.globalCount = function globalCount() {
	    // We want to cache the results of this
	    var cache = (function calc() {
	        var i,
	          count = 0;

	        for (i in window) {
	          count++;
	        }

	        return count;
	      }());

	    api.globalCount = function () { return cache; };
	    return cache;
	  };

	  api.fingerprint = function browserPrint() {
	    return pad((navigator.mimeTypes.length +
	      navigator.userAgent.length).toString(36) +
	      api.globalCount().toString(36), 4);
	  };

	  // don't change anything from here down.
	  if (app.register) {
	    app.register(namespace, api);
	  } else if (true) {
	    module.exports = api;
	  } else {
	    app[namespace] = api;
	  }

	}(this.applitude || this));


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var walk = __webpack_require__(89)

	var FormData = __webpack_require__(82)

	module.exports = getFormData

	function buildElems(rootElem) {
	    var hash = {}

	    walk(rootElem, function (child) {
	        if (child.name) {
	            hash[child.name] = child
	        }
	    })


	    return hash
	}

	function getFormData(rootElem) {
	    var elements = buildElems(rootElem)

	    return FormData(elements)
	}


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
	    typeof window !== 'undefined' ? window : {}
	var minDoc = __webpack_require__(80);

	if (typeof document !== 'undefined') {
	    module.exports = document;
	} else {
	    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }

	    module.exports = doccy;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var createStore = __webpack_require__(76)
	var Individual = __webpack_require__(52)

	var createHash = __webpack_require__(83)

	var hashStore = Individual("__DATA_SET_WEAKMAP@3", createStore())

	module.exports = DataSet

	function DataSet(elem) {
	    var store = hashStore(elem)

	    if (!store.hash) {
	        store.hash = createHash(elem)
	    }

	    return store.hash
	}


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	function head (a) {
	  return a[0]
	}

	function last (a) {
	  return a[a.length - 1]
	}

	function tail(a) {
	  return a.slice(1)
	}

	function retreat (e) {
	  return e.pop()
	}

	function hasLength (e) {
	  return e.length
	}

	function any(ary, test) {
	  for(var i=0;i<ary.length;i++)
	    if(test(ary[i]))
	      return true
	  return false
	}

	function score (a) {
	  return a.reduce(function (s, a) {
	      return s + a.length + a[1] + 1
	  }, 0)
	}

	function best (a, b) {
	  return score(a) <= score(b) ? a : b
	}


	var _rules // set at the bottom  

	// note, naive implementation. will break on circular objects.

	function _equal(a, b) {
	  if(a && !b) return false
	  if(Array.isArray(a))
	    if(a.length != b.length) return false
	  if(a && 'object' == typeof a) {
	    for(var i in a)
	      if(!_equal(a[i], b[i])) return false
	    for(var i in b)
	      if(!_equal(a[i], b[i])) return false
	    return true
	  }
	  return a == b
	}

	function getArgs(args) {
	  return args.length == 1 ? args[0] : [].slice.call(args)
	}

	// return the index of the element not like the others, or -1
	function oddElement(ary, cmp) {
	  var c
	  function guess(a) {
	    var odd = -1
	    c = 0
	    for (var i = a; i < ary.length; i ++) {
	      if(!cmp(ary[a], ary[i])) {
	        odd = i, c++
	      }
	    }
	    return c > 1 ? -1 : odd
	  }
	  //assume that it is the first element.
	  var g = guess(0)
	  if(-1 != g) return g
	  //0 was the odd one, then all the other elements are equal
	  //else there more than one different element
	  guess(1)
	  return c == 0 ? 0 : -1
	}
	var exports = module.exports = function (deps, exports) {
	  var equal = (deps && deps.equal) || _equal
	  exports = exports || {} 
	  exports.lcs = 
	  function lcs() {
	    var cache = {}
	    var args = getArgs(arguments)
	    var a = args[0], b = args[1]

	    function key (a,b){
	      return a.length + ':' + b.length
	    }

	    //find length that matches at the head

	    if(args.length > 2) {
	      //if called with multiple sequences
	      //recurse, since lcs(a, b, c, d) == lcs(lcs(a,b), lcs(c,d))
	      args.push(lcs(args.shift(), args.shift()))
	      return lcs(args)
	    }
	    
	    //this would be improved by truncating input first
	    //and not returning an lcs as an intermediate step.
	    //untill that is a performance problem.

	    var start = 0, end = 0
	    for(var i = 0; i < a.length && i < b.length 
	      && equal(a[i], b[i])
	      ; i ++
	    )
	      start = i + 1

	    if(a.length === start)
	      return a.slice()

	    for(var i = 0;  i < a.length - start && i < b.length - start
	      && equal(a[a.length - 1 - i], b[b.length - 1 - i])
	      ; i ++
	    )
	      end = i

	    function recurse (a, b) {
	      if(!a.length || !b.length) return []
	      //avoid exponential time by caching the results
	      if(cache[key(a, b)]) return cache[key(a, b)]

	      if(equal(a[0], b[0]))
	        return [head(a)].concat(recurse(tail(a), tail(b)))
	      else { 
	        var _a = recurse(tail(a), b)
	        var _b = recurse(a, tail(b))
	        return cache[key(a,b)] = _a.length > _b.length ? _a : _b  
	      }
	    }
	    
	    var middleA = a.slice(start, a.length - end)
	    var middleB = b.slice(start, b.length - end)

	    return (
	      a.slice(0, start).concat(
	        recurse(middleA, middleB)
	      ).concat(a.slice(a.length - end))
	    )
	  }

	  // given n sequences, calc the lcs, and then chunk strings into stable and unstable sections.
	  // unstable chunks are passed to build
	  exports.chunk =
	  function (q, build) {
	    var q = q.map(function (e) { return e.slice() })
	    var lcs = exports.lcs.apply(null, q)
	    var all = [lcs].concat(q)

	    function matchLcs (e) {
	      if(e.length && !lcs.length || !e.length && lcs.length)
	        return false //incase the last item is null
	      return equal(last(e), last(lcs)) || ((e.length + lcs.length) === 0)
	    }

	    while(any(q, hasLength)) {
	      //if each element is at the lcs then this chunk is stable.
	      while(q.every(matchLcs) && q.every(hasLength))
	        all.forEach(retreat)
	      //collect the changes in each array upto the next match with the lcs
	      var c = false
	      var unstable = q.map(function (e) {
	        var change = []
	        while(!matchLcs(e)) {
	          change.unshift(retreat(e))
	          c = true
	        }
	        return change
	      })
	      if(c) build(q[0].length, unstable)
	    }
	  }

	  //calculate a diff this is only updates
	  exports.optimisticDiff =
	  function (a, b) {
	    var M = Math.max(a.length, b.length)
	    var m = Math.min(a.length, b.length)
	    var patch = []
	    for(var i = 0; i < M; i++)
	      if(a[i] !== b[i]) {
	        var cur = [i,0], deletes = 0
	        while(a[i] !== b[i] && i < m) {
	          cur[1] = ++deletes
	          cur.push(b[i++])
	        }
	        //the rest are deletes or inserts
	        if(i >= m) {
	          //the rest are deletes
	          if(a.length > b.length)
	            cur[1] += a.length - b.length
	          //the rest are inserts
	          else if(a.length < b.length)
	            cur = cur.concat(b.slice(a.length))
	        }
	        patch.push(cur)
	      }

	    return patch
	  }

	  exports.diff =
	  function (a, b) {
	    var optimistic = exports.optimisticDiff(a, b)
	    var changes = []
	    exports.chunk([a, b], function (index, unstable) {
	      var del = unstable.shift().length
	      var insert = unstable.shift()
	      changes.push([index, del].concat(insert))
	    })
	    return best(optimistic, changes)
	  }

	  exports.patch = function (a, changes, mutate) {
	    if(mutate !== true) a = a.slice(a)//copy a
	    changes.forEach(function (change) {
	      [].splice.apply(a, change)
	    })
	    return a
	  }

	  // http://en.wikipedia.org/wiki/Concestor
	  // me, concestor, you...
	  exports.merge = function () {
	    var args = getArgs(arguments)
	    var patch = exports.diff3(args)
	    return exports.patch(args[0], patch)
	  }

	  exports.diff3 = function () {
	    var args = getArgs(arguments)
	    var r = []
	    exports.chunk(args, function (index, unstable) {
	      var mine = unstable[0]
	      var insert = resolve(unstable)
	      if(equal(mine, insert)) return 
	      r.push([index, mine.length].concat(insert)) 
	    })
	    return r
	  }
	  exports.oddOneOut =
	    function oddOneOut (changes) {
	      changes = changes.slice()
	      //put the concestor first
	      changes.unshift(changes.splice(1,1)[0])
	      var i = oddElement(changes, equal)
	      if(i == 0) // concestor was different, 'false conflict'
	        return changes[1]
	      if (~i)
	        return changes[i] 
	    }
	  exports.insertMergeOverDelete = 
	    //i've implemented this as a seperate rule,
	    //because I had second thoughts about this.
	    function insertMergeOverDelete (changes) {
	      changes = changes.slice()
	      changes.splice(1,1)// remove concestor
	      
	      //if there is only one non empty change thats okay.
	      //else full confilct
	      for (var i = 0, nonempty; i < changes.length; i++)
	        if(changes[i].length) 
	          if(!nonempty) nonempty = changes[i]
	          else return // full conflict
	      return nonempty
	    }

	  var rules = (deps && deps.rules) || [exports.oddOneOut, exports.insertMergeOverDelete]

	  function resolve (changes) {
	    var l = rules.length
	    for (var i in rules) { // first
	      
	      var c = rules[i] && rules[i](changes)
	      if(c) return c
	    }
	    changes.splice(1,1) // remove concestor
	    //returning the conflicts as an object is a really bad idea,
	    // because == will not detect they are the same. and conflicts build.
	    // better to use
	    // '<<<<<<<<<<<<<'
	    // of course, i wrote this before i started on snob, so i didn't know that then.
	    /*var conflict = ['>>>>>>>>>>>>>>>>']
	    while(changes.length)
	      conflict = conflict.concat(changes.shift()).concat('============')
	    conflict.pop()
	    conflict.push          ('<<<<<<<<<<<<<<<')
	    changes.unshift       ('>>>>>>>>>>>>>>>')
	    return conflict*/
	    //nah, better is just to use an equal can handle objects
	    return {'?': changes}
	  }
	  return exports
	}
	exports(null, exports)


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/* (ignored) */

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var hiddenStore = __webpack_require__(84);

	module.exports = createStore;

	function createStore() {
	    var key = {};

	    return function (obj) {
	        if (typeof obj !== 'object' || obj === null) {
	            throw new Error('Weakmap-shim: Key must be object')
	        }

	        var store = obj.valueOf(key);
	        return store && store.identity === key ?
	            store : hiddenStore(obj, key);
	    };
	}


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = isObject

	function isObject(x) {
	    return typeof x === "object" && x !== null
	}


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var createStore = __webpack_require__(94)
	var Individual = __webpack_require__(93)

	var createHash = __webpack_require__(86)

	var hashStore = Individual("__DATA_SET_WEAKMAP@3", createStore())

	module.exports = DataSet

	function DataSet(elem) {
	    var store = hashStore(elem)

	    if (!store.hash) {
	        store.hash = createHash(elem)
	    }

	    return store.hash
	}


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = hasKeys

	function hasKeys(source) {
	    return source !== null &&
	        (typeof source === "object" ||
	        typeof source === "function")
	}


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/* (ignored) */

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = extend

	function extend(target) {
	    for (var i = 1; i < arguments.length; i++) {
	        var source = arguments[i]

	        for (var key in source) {
	            if (source.hasOwnProperty(key)) {
	                target[key] = source[key]
	            }
	        }
	    }

	    return target
	}


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint maxcomplexity: 10*/

	module.exports = FormData

	//TODO: Massive spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#constructing-form-data-set
	function FormData(elements) {
	    return Object.keys(elements).reduce(function (acc, key) {
	        var elem = elements[key]

	        acc[key] = valueOfElement(elem)

	        return acc
	    }, {})
	}

	function valueOfElement(elem) {
	    if (typeof elem === "function") {
	        return elem()
	    } else if (containsRadio(elem)) {
	        var elems = toList(elem)
	        var checked = elems.filter(function (elem) {
	            return elem.checked
	        })[0] || null

	        return checked ? checked.value : null
	    } else if (Array.isArray(elem)) {
	        return elem.map(valueOfElement).filter(filterNull)
	    } else if (elem.tagName === undefined && elem.nodeType === undefined) {
	        return FormData(elem)
	    } else if (elem.tagName === "INPUT" && isChecked(elem)) {
	        if (elem.hasAttribute("value")) {
	            return elem.checked ? elem.value : null
	        } else {
	            return elem.checked
	        }
	    } else if (elem.tagName === "INPUT") {
	        return elem.value
	    } else if (elem.tagName === "TEXTAREA") {
	        return elem.value
	    } else if (elem.tagName === "SELECT") {
	        return elem.value
	    }
	}

	function isChecked(elem) {
	    return elem.type === "checkbox" || elem.type === "radio"
	}

	function containsRadio(value) {
	    if (value.tagName || value.nodeType) {
	        return false
	    }

	    var elems = toList(value)

	    return elems.some(function (elem) {
	        return elem.tagName === "INPUT" && elem.type === "radio"
	    })
	}

	function toList(value) {
	    if (Array.isArray(value)) {
	        return value
	    }

	    return Object.keys(value).map(prop, value)
	}

	function prop(x) {
	    return this[x]
	}

	function filterNull(val) {
	    return val !== null
	}


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = createHash

	function createHash(elem) {
	    var attributes = elem.attributes
	    var hash = {}

	    if (attributes === null || attributes === undefined) {
	        return hash
	    }

	    for (var i = 0; i < attributes.length; i++) {
	        var attr = attributes[i]

	        if (attr.name.substr(0,5) !== "data-") {
	            continue
	        }

	        hash[attr.name.substr(5)] = attr.value
	    }

	    return hash
	}


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = hiddenStore;

	function hiddenStore(obj, key) {
	    var store = { identity: key };
	    var valueOf = obj.valueOf;

	    Object.defineProperty(obj, "valueOf", {
	        value: function (value) {
	            return value !== key ?
	                valueOf.apply(this, arguments) : store;
	        },
	        writable: true
	    });

	    return store;
	}


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = createHash

	function createHash(elem) {
	    var attributes = elem.attributes
	    var hash = {}

	    if (attributes === null || attributes === undefined) {
	        return hash
	    }

	    for (var i = 0; i < attributes.length; i++) {
	        var attr = attributes[i]

	        if (attr.name.substr(0,5) !== "data-") {
	            continue
	        }

	        hash[attr.name.substr(5)] = attr.value
	    }

	    return hash
	}


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(obj) {
	    if (typeof obj === 'string') return camelCase(obj);
	    return walk(obj);
	};

	function walk (obj) {
	    if (!obj || typeof obj !== 'object') return obj;
	    if (isDate(obj) || isRegex(obj)) return obj;
	    if (isArray(obj)) return map(obj, walk);
	    return reduce(objectKeys(obj), function (acc, key) {
	        var camel = camelCase(key);
	        acc[camel] = walk(obj[key]);
	        return acc;
	    }, {});
	}

	function camelCase(str) {
	    return str.replace(/[_.-](\w|$)/g, function (_,x) {
	        return x.toUpperCase();
	    });
	}

	var isArray = Array.isArray || function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	};

	var isDate = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Date]';
	};

	var isRegex = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var has = Object.prototype.hasOwnProperty;
	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (has.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	function map (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        res.push(f(xs[i], i));
	    }
	    return res;
	}

	function reduce (xs, f, acc) {
	    if (xs.reduce) return xs.reduce(f, acc);
	    for (var i = 0; i < xs.length; i++) {
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	}


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var nargs = /\{([0-9a-zA-Z]+)\}/g
	var slice = Array.prototype.slice

	module.exports = template

	function template(string) {
	    var args

	    if (arguments.length === 2 && typeof arguments[1] === "object") {
	        args = arguments[1]
	    } else {
	        args = slice.call(arguments, 1)
	    }

	    if (!args || !args.hasOwnProperty) {
	        args = {}
	    }

	    return string.replace(nargs, function replaceArg(match, i, index) {
	        var result

	        if (string[index - 1] === "{" &&
	            string[index + match.length] === "}") {
	            return i
	        } else {
	            result = args.hasOwnProperty(i) ? args[i] : null
	            if (result === null || result === undefined) {
	                return ""
	            }

	            return result
	        }
	    })
	}


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var slice = Array.prototype.slice

	module.exports = iterativelyWalk

	function iterativelyWalk(nodes, cb) {
	    if (!('length' in nodes)) {
	        nodes = [nodes]
	    }
	    
	    nodes = slice.call(nodes)

	    while(nodes.length) {
	        var node = nodes.shift(),
	            ret = cb(node)

	        if (ret) {
	            return ret
	        }

	        if (node.childNodes && node.childNodes.length) {
	            nodes = slice.call(node.childNodes).concat(nodes)
	        }
	    }
	}


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(obj) {
	    if (typeof obj === 'string') return camelCase(obj);
	    return walk(obj);
	};

	function walk (obj) {
	    if (!obj || typeof obj !== 'object') return obj;
	    if (isDate(obj) || isRegex(obj)) return obj;
	    if (isArray(obj)) return map(obj, walk);
	    return reduce(objectKeys(obj), function (acc, key) {
	        var camel = camelCase(key);
	        acc[camel] = walk(obj[key]);
	        return acc;
	    }, {});
	}

	function camelCase(str) {
	    return str.replace(/[_.-](\w|$)/g, function (_,x) {
	        return x.toUpperCase();
	    });
	}

	var isArray = Array.isArray || function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]';
	};

	var isDate = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object Date]';
	};

	var isRegex = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var has = Object.prototype.hasOwnProperty;
	var objectKeys = Object.keys || function (obj) {
	    var keys = [];
	    for (var key in obj) {
	        if (has.call(obj, key)) keys.push(key);
	    }
	    return keys;
	};

	function map (xs, f) {
	    if (xs.map) return xs.map(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        res.push(f(xs[i], i));
	    }
	    return res;
	}

	function reduce (xs, f, acc) {
	    if (xs.reduce) return xs.reduce(f, acc);
	    for (var i = 0; i < xs.length; i++) {
	        acc = f(acc, xs[i], i);
	    }
	    return acc;
	}


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var nargs = /\{([0-9a-zA-Z]+)\}/g
	var slice = Array.prototype.slice

	module.exports = template

	function template(string) {
	    var args

	    if (arguments.length === 2 && typeof arguments[1] === "object") {
	        args = arguments[1]
	    } else {
	        args = slice.call(arguments, 1)
	    }

	    if (!args || !args.hasOwnProperty) {
	        args = {}
	    }

	    return string.replace(nargs, function replaceArg(match, i, index) {
	        var result

	        if (string[index - 1] === "{" &&
	            string[index + match.length] === "}") {
	            return i
	        } else {
	            result = args.hasOwnProperty(i) ? args[i] : null
	            if (result === null || result === undefined) {
	                return ""
	            }

	            return result
	        }
	    })
	}


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.6.3
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/*
	//@ sourceMappingURL=performance-now.map
	*/
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(95)))

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var root = typeof window !== 'undefined' ?
	    window : typeof global !== 'undefined' ?
	    global : {};

	module.exports = Individual

	function Individual(key, value) {
	    if (root[key]) {
	        return root[key]
	    }

	    Object.defineProperty(root, key, {
	        value: value
	        , configurable: true
	    })

	    return value
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var hiddenStore = __webpack_require__(96);

	module.exports = createStore;

	function createStore() {
	    var key = {};

	    return function (obj) {
	        if (typeof obj !== 'object' || obj === null) {
	            throw new Error('Weakmap-shim: Key must be object')
	        }

	        var store = obj.valueOf(key);
	        return store && store.identity === key ?
	            store : hiddenStore(obj, key);
	    };
	}


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};

	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;

	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }

	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);

	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }

	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	}

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = hiddenStore;

	function hiddenStore(obj, key) {
	    var store = { identity: key };
	    var valueOf = obj.valueOf;

	    Object.defineProperty(obj, "valueOf", {
	        value: function (value) {
	            return value !== key ?
	                valueOf.apply(this, arguments) : store;
	        },
	        writable: true
	    });

	    return store;
	}


/***/ }
/******/ ])
});
