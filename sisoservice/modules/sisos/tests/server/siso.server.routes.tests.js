'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Siso = mongoose.model('Siso'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, siso;

/**
 * Siso routes tests
 */
describe('Siso CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Siso
    user.save(function () {
      siso = {
        name: 'Siso name'
      };

      done();
    });
  });

  it('should be able to save a Siso if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Siso
        agent.post('/api/sisos')
          .send(siso)
          .expect(200)
          .end(function (sisoSaveErr, sisoSaveRes) {
            // Handle Siso save error
            if (sisoSaveErr) {
              return done(sisoSaveErr);
            }

            // Get a list of Sisos
            agent.get('/api/sisos')
              .end(function (sisosGetErr, sisosGetRes) {
                // Handle Siso save error
                if (sisosGetErr) {
                  return done(sisosGetErr);
                }

                // Get Sisos list
                var sisos = sisosGetRes.body;

                // Set assertions
                (sisos[0].user._id).should.equal(userId);
                (sisos[0].name).should.match('Siso name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Siso if not logged in', function (done) {
    agent.post('/api/sisos')
      .send(siso)
      .expect(403)
      .end(function (sisoSaveErr, sisoSaveRes) {
        // Call the assertion callback
        done(sisoSaveErr);
      });
  });

  it('should not be able to save an Siso if no name is provided', function (done) {
    // Invalidate name field
    siso.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Siso
        agent.post('/api/sisos')
          .send(siso)
          .expect(400)
          .end(function (sisoSaveErr, sisoSaveRes) {
            // Set message assertion
            (sisoSaveRes.body.message).should.match('Please fill Siso name');

            // Handle Siso save error
            done(sisoSaveErr);
          });
      });
  });

  it('should be able to update an Siso if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Siso
        agent.post('/api/sisos')
          .send(siso)
          .expect(200)
          .end(function (sisoSaveErr, sisoSaveRes) {
            // Handle Siso save error
            if (sisoSaveErr) {
              return done(sisoSaveErr);
            }

            // Update Siso name
            siso.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Siso
            agent.put('/api/sisos/' + sisoSaveRes.body._id)
              .send(siso)
              .expect(200)
              .end(function (sisoUpdateErr, sisoUpdateRes) {
                // Handle Siso update error
                if (sisoUpdateErr) {
                  return done(sisoUpdateErr);
                }

                // Set assertions
                (sisoUpdateRes.body._id).should.equal(sisoSaveRes.body._id);
                (sisoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sisos if not signed in', function (done) {
    // Create new Siso model instance
    var sisoObj = new Siso(siso);

    // Save the siso
    sisoObj.save(function () {
      // Request Sisos
      request(app).get('/api/sisos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Siso if not signed in', function (done) {
    // Create new Siso model instance
    var sisoObj = new Siso(siso);

    // Save the Siso
    sisoObj.save(function () {
      request(app).get('/api/sisos/' + sisoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', siso.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Siso with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sisos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Siso is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Siso which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Siso
    request(app).get('/api/sisos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Siso with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Siso if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Siso
        agent.post('/api/sisos')
          .send(siso)
          .expect(200)
          .end(function (sisoSaveErr, sisoSaveRes) {
            // Handle Siso save error
            if (sisoSaveErr) {
              return done(sisoSaveErr);
            }

            // Delete an existing Siso
            agent.delete('/api/sisos/' + sisoSaveRes.body._id)
              .send(siso)
              .expect(200)
              .end(function (sisoDeleteErr, sisoDeleteRes) {
                // Handle siso error error
                if (sisoDeleteErr) {
                  return done(sisoDeleteErr);
                }

                // Set assertions
                (sisoDeleteRes.body._id).should.equal(sisoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Siso if not signed in', function (done) {
    // Set Siso user
    siso.user = user;

    // Create new Siso model instance
    var sisoObj = new Siso(siso);

    // Save the Siso
    sisoObj.save(function () {
      // Try deleting Siso
      request(app).delete('/api/sisos/' + sisoObj._id)
        .expect(403)
        .end(function (sisoDeleteErr, sisoDeleteRes) {
          // Set message assertion
          (sisoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Siso error error
          done(sisoDeleteErr);
        });

    });
  });

  it('should be able to get a single Siso that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Siso
          agent.post('/api/sisos')
            .send(siso)
            .expect(200)
            .end(function (sisoSaveErr, sisoSaveRes) {
              // Handle Siso save error
              if (sisoSaveErr) {
                return done(sisoSaveErr);
              }

              // Set assertions on new Siso
              (sisoSaveRes.body.name).should.equal(siso.name);
              should.exist(sisoSaveRes.body.user);
              should.equal(sisoSaveRes.body.user._id, orphanId);

              // force the Siso to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Siso
                    agent.get('/api/sisos/' + sisoSaveRes.body._id)
                      .expect(200)
                      .end(function (sisoInfoErr, sisoInfoRes) {
                        // Handle Siso error
                        if (sisoInfoErr) {
                          return done(sisoInfoErr);
                        }

                        // Set assertions
                        (sisoInfoRes.body._id).should.equal(sisoSaveRes.body._id);
                        (sisoInfoRes.body.name).should.equal(siso.name);
                        should.equal(sisoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Siso.remove().exec(done);
    });
  });
});
