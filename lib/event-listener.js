(function (module) {

  // Local variables.
  var listeners = {};

  /**
   * @param {string[]} events
   * @constructor
   */
  var EventListener = function (events) {
    for (var i in events) {
      listeners[events[i]] = [];
    }
  };

  /**
   * Add a callback on the success or the error event.
   * @param {string} event
   * @param {callback} callback
   */
  EventListener.prototype.on = function (event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      console.error(event + ' event does not exist [addListener]');
      process.exit(1);
    }

    listeners[event].push(callback);
  };

  /**
   * Trigger an event. Call all registered callbacks.
   * @param {string} event
   * @param {array} ...params
   */
  EventListener.prototype.trigger = function(event, ...params) {
    if (!listeners.hasOwnProperty(event)) {
      console.error(event + ' event does not exist [trigger]');
      process.exit(1);
    }

    listeners[event].forEach(function (callback) {
      callback.apply(null, params);
    });
  };

  module.exports = EventListener;

})(module);
