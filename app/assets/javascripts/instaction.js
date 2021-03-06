(function( document, window, $ ) {
  var MutationObserver = false, Instaction;

  // Try to find MutationObserver
  if(typeof window.WebKitMutationObserver === 'undefined') {
    try {
      MutationObserver = window.MutationObserver;
    } catch(e) {
      MutationObserver = false;
    }
  } else {
    MutationObserver = window.WebKitMutationObserver;
  }

  // Check if MutationObserver is really available
  if(! MutationObserver) {
    // Abort with dummy instance of MutationObserver
    return window.Instaction = new function() {
      this.initialized = false;

      this.mutation_observer_error = function() {
        console.error('No MutationObserver found!')
      };

      // Stub all public methods
      this.register_global = this.mutation_observer_error;
    };
  }

  // Actual Instaction class
  Instaction = function() {
    this.initialized = true;
    this.actions_added = [];
    this.actions_removed = [];

    // Process a Mutation change summary
    this.handle_dom_change = function(summary) {
      var el;

      for (var i = 0, slen = summary.length; i < slen; i++) {
        for (var j = 0, nodes1 = summary[i].addedNodes, nlen1 = nodes1.length; j < nlen1; j++) {
          el = nodes1[j];

          // Skip text nodes
          if (el.nodeType !== 1)
            continue;

          this.handle_element(el, this.actions_added);
        }

        for (var k = 0, nodes2 = summary[i].removedNodes, nlen2 = nodes2.length; k < nlen2; k++) {
          el = nodes2[k];

          // Skip text nodes
          if (el.nodeType !== 1)
            continue;

          this.handle_element(el, this.actions_removed);
        }
      }
    };


    // Process a changed element
    this.handle_element = function(el, actions) {
      var entry,
        $el = $(el);

      for(var i = 0, len = actions.length; i < len; i++) {
        entry = actions[i];

        if(entry.selector_type == 'class') {
          this.handle_selector_class(el, $el, entry.selector, entry.callback);
        } else {
          this.handle_selector_jquery(el, $el, entry.selector, entry.callback);
        }
      }
    };

    // Process a class selector
    this.handle_selector_class = function(el, $el, klass, callback, ignore_children) {
      // Check for match, run callback
      if(el.classList.contains(klass)) {
        callback($el);
      }

      // End recursion
      if(ignore_children) {
        return;
      }

      // Query children, we use querySelectorAll because it returns a static
      // collection of everything in our children that we need to analyze.
      var children = el.querySelectorAll('.' + klass);
      for(var i = 0, len = children.length; i < len; i++) {
        callback($(children[i]));
      }
    };

    // Process a jquery selector
    this.handle_selector_jquery = function(el, $el, selector, callback) {
      // Check for match, run callback
      if($el.is(selector)) {
        callback($el);
      }

      // Query children, loop through all to match some queries
      // where the selector depends on a parent of $el
      var $this;
      $el.find('*').each(function() {
        $this = $(this);

        // Check for match, run callback
        if($this.is(selector)) {
          callback($el);
        }
      });
    };

    /**
     * Register an action handler
     *
     * @param selector The selector to match
     * @param selector_type What kind of selector either 'class' or 'jquery'
     * @param mode Either 'added' or 'removed'
     * @param callback Callback to call
     */
    this.register = function(selector, selector_type, mode, callback) {
      // selector_type and mode can be omitted
      if(!mode) {
        mode = 'added';
        callback = selector_type;
        selector_type = false;
      }
      else if(!callback) {
        callback = mode;
        mode = 'added';
      }

      // Default is class
      selector_type = selector_type || 'class';

      // Add the handler
      var collection = mode == 'added' ? this.actions_added : this.actions_removed;
      collection.push({
        selector: selector_type == 'class' ? selector.substr(1) : selector,
        selector_type: selector_type,
        callback: callback
      });
    };
  };

  // Setup
  var instaction = new Instaction();
  var observer = new MutationObserver(instaction.handle_dom_change.bind(instaction));
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  window.Instaction = instaction;
})(document, window, jQuery);
