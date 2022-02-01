const express = require('express');
const createHttpError = require('http-errors');
const database = require('../../database/database');
const { initRouter } = require('../../help/routes');
const routes = require('../../help/routes');
const validation = require('../../validation/validation');
const object = require('./object');
const user = require('../../validation/routes/user');
const bcrypt = require('../../help/bcrypt');
const router = express.Router();

// /user
router.get('/:user_id/favorites', async (req, res, next) => {
  try {
    validation.endpoints.validateRequest_throws({
      request: req,
      check: object.favorites.get.request,
    });

    let rowsFavorites = await database.all_throws404(
      database.queries2.getSavedLocationsByUserId,
      req.params.user_id
    );

    const builtResponse = {
      rows: rowsFavorites,
    };

    res.json(builtResponse);
  } catch (error) {
    next(error);
  }
});
router.post('/:user_id/favorites', async (req, res, next) => {
  routes.initRouter({
    next: next,
    request: { req: req, check: object.favorites.post.request },
    response: res,
    exe: async () => {
      let body = object.favorites.post.request.body;
      body = req.body;

      await database.get_throws404(database.queries2.getLocation, [
        body.location_id,
      ]);

      await database.run_throws400(queries.favorites.saveFavorite, [
        req.params.user_id,
        body.location_id,
      ]);

      return object.favorites.post.response;
    },
  });
});
router.put('/:user_id/resetPassword', async (req, res, next) => {
  initRouter({
    next: next,
    request: { req: req, check: object.resetPassword.put.request },
    response: res,
    async exe() {
      let body = object.resetPassword.put.request.body;
      body = req.body;

      user.resetPassword(body);
      user.createPassword(body.new_password);

      await database.run_throws400(database.queries2.saveChangedPassword, [
        bcrypt.encryptPassword(body.new_password),
        req.params.user_id,
      ]);

      return object.resetPassword.put.response;
    },
  });
});
router.delete('/:user_id/account', async (req, res, next) => {
  initRouter({
    next: next,
    request: { req: req, check: object.account.delete.request },
    response: res,
    exe: async () => {
      let body = object.account.delete.request.body;
      body = req.body;

      let row = database.queries2.getUser.from;
      row = await database.get_throws404(database.queries2.getUser.query, [
        req.params.user_id,
      ]);

      user.deleteAccount({
        realPassword: body.password,
        password: row.password,
      });

      await database.run_throws400(database.queries2.deleteUser, [
        req.params.user_id,
      ]);

      return object.account.delete.response;
    },
  });
});
router.post('/register', async (req, res, next) => {
  initRouter({
    next: next,
    response: res,
    request: { req: req, check: object.register.post.request },
    exe: async () => {
      let body = object.register.post.request.body;
      body = req.body;

      await database.run_throws400(database.queries2.registerUser, [
        body.email,
        await bcrypt.encryptPassword(body.password),
      ]);

      return object.register.post.response;
    },
  });
});
router.get('/forgotPassword', async (req, res, next) => {
  initRouter({
    next: next,
    response: res,
    request: {
      req: req,
      check: object.forgotPassword.get.request,
    },
    exe: async () => {
      let body = object.forgotPassword.get.request.body;
      body = req.body;

      let row = database.queries2.getUserByEmail.from;
      row = await database.get_throws404(
        database.queries2.getUserByEmail.query,
        [body.email]
      );

      if (!row) {
        throw createHttpError.BadRequest('Email is wrong');
      }

      return;
    },
  });
});
router.post('/login', async (req, res, next) => {
  initRouter({
    next: next,
    response: res,
    request: {
      req: req,
      check: object.login.post.request,
    },
    exe: async () => {
      let body = object.login.post.request.body;
      body = req.body;

      let row = database.queries2.getUserByEmail.from;
      row = await database.get(database.queries2.getUserByEmail.query, [
        body.email,
      ]);

      if (!row) {
        throw createHttpError.BadRequest('Email or password are wrong');
      }

      const isPassword = await bcrypt.decryptPassword({
        check: body.password,
        encrypted: row.password,
      });

      if (!isPassword) {
        throw createHttpError.BadRequest('Email or password are wrong');
      }

      let sess = req.session;
      sess.user_id = row.pk_user_id;
      object.login.post.response.user_id = row.pk_user_id;

      return object.login.post.response;
    },
  });
});
router.get('/logout', async (req, res, next) => {
  initRouter({
    next: next,
    response: res,
    request: { req: req, check: object.logout.get.request },
    exe: async () => {
      let sess = req.session;

      sess.destroy((err) => {
        if (err) {
          throw new Error(err);
        }
      });

      return object.logout.get.response;
    },
  });
});

function getAllFavoritesOfOneUser(req, res, next) {
  const params = [req.params.username];
  db.all(queries.getAllFavoritesOfOneUser, params, (err, rows) => {
    if (err) {
      return next(err);
    } else if (rows.length) {
      return res.json(rows);
    } else {
      return next(createHttpError.NotFound());
    }
  });
}

function deleteAccount(req, res, next) {
  const shouldParams = ['password'];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  }
  const params = [req.params.username];
  db.get(queries.getUserByUsername, params, (err, row) => {
    if (err) {
      return next(err);
    } else {
      if (!row) {
        return next(
          createHttpError.NotFound(
            "User '" + params[0] + "' has not been found"
          )
        );
      }
      if (
        !(
          row.pk_user_name === params[0] &&
          row.password === req.body[shouldParams[0]]
        )
      ) {
        return next(
          createHttpError.BadRequest('Username or password is not correct')
        );
      } else {
        db.run(queries.deleteUserAccount, params, (err) => {
          if (err) {
            return next(err);
          } else {
            return res.json("User '" + row.pk_user_name + "' has been deleted");
          }
        });
      }
    }
  });
}

function postRegister(req, res, next) {
  const shouldParams = ['username', 'email', 'password'];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  }
  const params = [
    req.body[shouldParams[0]],
    req.body[shouldParams[1]],
    req.body[shouldParams[2]],
  ];
  db.get(queries.getUserByUsername, params[0], (err, row) => {
    if (err) {
      return next(err);
    } else {
      if (row) {
        return next(
          createHttpError.BadRequest("User '" + params[0] + "' already exists")
        );
      } else {
        db.run(queries.postRegisterNewUser, params, (err) => {
          if (err) {
            return next(err);
          } else {
            return res.json("User '" + params[0] + "' has been registered");
          }
        });
      }
    }
  });
}

function putResetPassword(req, res, next) {
  const shouldParams = ['currentPassword', 'newPassword', 'repeatNewPassword'];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  }
  const params = [
    req.body[shouldParams[0]],
    req.body[shouldParams[1]],
    req.body[shouldParams[2]],
  ];
  if (params[1] !== params[2]) {
    return next(createHttpError.BadRequest('Both passwords do not match'));
  } else {
    db.get(queries.getUserByUsername, req.params.username, (err, row) => {
      if (err) {
        return next(err);
      } else {
        if (!row) {
          return next(
            createHttpError.NotFound(
              "User '" + req.params.username + "' has not been found"
            )
          );
        } else {
          if (row.password !== params[0]) {
            return next(
              createHttpError.BadRequest('Current password is not correct')
            );
          } else {
            db.run(
              queries.putResetPassword,
              [params[1], req.params.username],
              (err) => {
                if (err) {
                  return next(err);
                } else {
                  return res.json('Password has been changed');
                }
              }
            );
          }
        }
      }
    });
  }
}

function getForgotPassword(req, res, next) {
  const shouldParams = ['usernameOrEmail'];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  }
  const params = [req.body[shouldParams[0]], req.body[shouldParams[0]]];
  db.get(queries.getUserByUsernameOrEmail, params, (err, row) => {
    if (err) {
      return next(err);
    } else {
      if (!row) {
        return next(
          createHttpError.NotFound(
            "User '" + params[0] + "' has not been found"
          )
        );
      } else {
        return res.json('Username or email is correct');
      }
    }
  });
}

function putForgotPassword(req, res, next) {
  const shouldParams = ['newPassword', 'repeatNewPassword'];
  const err = validateParamsOrQuery(shouldParams, req.body);
  if (err) {
    return next(err);
  }
  const params = [req.body[shouldParams[0]], req.body[shouldParams[1]]];
  if (params[0] !== params[1]) {
    return next(createHttpError.BadRequest('Both passwords do not match'));
  } else {
    db.get(queries.getUserByUsername, req.params.username, (err, row) => {
      if (err) {
        return next(err);
      } else {
        if (!row) {
          return next(
            createHttpError.NotFound(
              "User '" + req.params.username + "' has not been found"
            )
          );
        } else {
          db.run(
            queries.putResetPassword,
            [params[0], req.params.username],
            (err) => {
              if (err) {
                return next(err);
              } else {
                return res.json('Password has been changed');
              }
            }
          );
        }
      }
    });
  }
}

module.exports = router;
