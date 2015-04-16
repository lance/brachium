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

var chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
    chaiAsPromised = require("chai-as-promised"),
    Runner = require('../index'),
    Service = require('../lib/service');

chai.use(chaiAsPromised);

describe('Runner', function() {

  it('should register actions', function() {
    var runner = new Runner(),
        task = function() {},
        promise = runner.register('test-register', task).then(function() {
          return runner.lookup('test-register');
        });
    return promise.should.eventually.be.an.instanceof(Service);
  });

  it('should not register an action with the same name twice', function() {
    var runner = new Runner(),
        task = function() {};

    return runner.register('test-multi-register', task).then(function() {
      return runner.register('test-multi-register', task);
    }).should.be.rejectedWith(TypeError, 'Service already exists');

  });

  it('should promise to run a registered action', function() {
    var runner = new Runner();

    var promise = runner.register('test-run', function() {
      return 'begonia';
    }).then(function() {
      return runner.run('test-run');
    });

    return promise.should.eventually.equal('begonia');
  });

  it('should pass arguments to registered actions', function() {
    var runner = new Runner();

    var promise = runner.register('test-args', function(arg) {
      return arg;
    }).then(function() {
      return runner.run('test-args', 313);
    });

    return promise.should.eventually.equal(313);
  });

  it('should pass multiple arguments to registered actions', function() {
    var runner = new Runner();

    var promise = runner.register('test-multi-args', function(arg1, arg2, arg3, arg4) {
      return arg1 + arg2 + arg3 + arg4;
    }).then(function() {
      return runner.run('test-multi-args', 125,175,6,7);
    });

    promise.should.eventually.equal(313);
  });

  it('should allow actions to return promises', function() {
    var runner = new Runner();

    var promise = runner.register('test-promises', function() {
      var Q = require('q'),
          deferred = Q.defer();

      process.nextTick(function() {
        deferred.resolve('hola');
      });
      return deferred.promise;
    }).then(function() {
      return runner.run('test-promises');
    });

    return promise.should.eventually.equal('hola');

  });

  it('should run the same service twice if requested', function() {
    var runner = new Runner();

    function identity(i) {
      return i;
    }

    var promise = runner.register('identity', identity).then(function() {
      return runner.run('identity', 'A').then(function() {
        return runner.run('identity', 'B');
      });
    });

    return promise.should.eventually.be.equal('B');

  });

  xit('should cache the results of a service when requested', function() {
    var runner = new Runner();

    function identity(i) {
      return i;
    }

    var promise = runner.register('identity', identity, true).then(function() {
      return runner.run('identity', 'A').then(function() {
        return runner.run('identity', 'B');
      });
    });

    return promise.should.eventually.be.equal('A');

  });

});
