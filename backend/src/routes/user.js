const express = require('express');
const { db, queries } = require('../database/database');
const { validateParamsOrQuery } = require('../validation/routes');
const createHttpError = require('http-errors');
const router = express.Router();

// /user
router.get('/:username/favorites', getAllFavoritesOfOneUser);
router.put('/:username/resetPassword', putResetPassword);
router.delete('/:username/account', deleteAccount);
router.post('/register', postRegister);
router.get('/forgotPassword', getForgotPassword);
router.put('/:username/forgotPassword', putForgotPassword);

function getAllFavoritesOfOneUser(req, res, next) {
  const params = [req.params.username];
  db.all(queries.getAllFavoritesOfOneUser, params, (err, rows) => {
    if (err) {
      return next(err);
    } else if (rows.length > 0) {
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

module.exports = {
  router,
};
