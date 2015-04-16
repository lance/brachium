/*!
 * Copyright 2015 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = Registry;

var Q = require('q'),
    Service = require('./service');

function Registry() {
  if (!(this instanceof Registry)) return new Registry();
  // Eventually this should be more than just in-memory,
  // but auto-discover other registries on the local network
  this._services = {};
}

Registry.prototype.lookup = function(name) {
  // return a promise even though we are not async
  // when we become network aware, this will be important
  var deferred = Q.defer(),
      service  = this._services[name];

  if (!service) {
    deferred.reject(new TypeError('Service does not exist'));
  } else {
    deferred.resolve(service);
  }
  return deferred.promise;
};

Registry.prototype.register = function(name, f) {
  var services = this._services;

  return this.lookup(name).then(function(){
    // we found a service with this name, reject the request
    throw new TypeError('Service already exists');
  }, function() {
    var service = new Service(name, f);
    services[name] = service;
    return service;
  });
};
