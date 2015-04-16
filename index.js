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

module.exports = Brachium;

var Registry = require('./lib/registry');

function Brachium() {
  if (!(this instanceof Brachium)) return new Brachium();
  this._registry = new Registry();
}

Brachium.prototype.lookup = function(name) {
  return this._registry.lookup(name);
};

Brachium.prototype.register = function(name, f, b) {
  return this._registry.register(name, f, b);
};

Brachium.prototype.run = function(name) {
  var args = Array.prototype.slice.call(arguments);

  // remove 'name' from the args list
  args.shift();

  return this.lookup(name).then(function(service) {
    return service.run(args);
  });
};

module.exports = Brachium;
