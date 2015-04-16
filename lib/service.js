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

var Q = require('q');

function Service(name, task) {
  this._name = name;
  this._task = task;
}

Service.prototype.run = function(args) {
  var task = this._task,
      deferred = Q.defer();

  process.nextTick(function() {
    try {
      var result = task.apply(task, args);
      deferred.resolve(result);
    } catch(er) {
      deferred.reject(er);
    }
  });
  return deferred.promise;
};

module.exports = Service;
