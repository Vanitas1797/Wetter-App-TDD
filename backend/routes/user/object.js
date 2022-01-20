const { tables } = require('../../objects/database/tables');
const location = require('../../validation/routes/location');
const user = require('../../validation/routes/user');

module.exports = {
  favorites: {
    get: {
      request: {
        params: {
          user_id: '',
        },
        validation: {},
      },
      response: {},
    },
    post: {
      request: {
        body: {
          location_id: '',
        },
        validation: {},
      },
      response: { message: 'A new favorite has been saved' },
    },
  },
  resetPassword: {
    put: {
      request: {
        params: {
          user_id: '',
        },
        body: {
          new_password: '',
          repeat_new_password: '',
        },
        validation: {},
      },
      response: {
        message: 'Password has been changed',
      },
    },
  },
  account: {
    delete: {
      request: {
        params: {
          user_id: '',
        },
        body: {
          password: '',
        },
        validation: {},
      },
      response: { message: 'User has been deleted' },
    },
  },
  register: {
    post: {
      request: {
        params: {},
        query: {},
        body: {
          email: '',
          password: '',
        },
        validation: { body: user.register },
      },
      response: { message: 'A new user has been registered' },
    },
  },
  forgotPassword: {
    get: {
      request: {
        params: {},
        query: {},
        body: {
          email: '',
        },
        validation: {},
      },
      response: {},
    },
  },
  login: {
    get: {
      request: {
        params: {},
        query: {},
        body: {
          email: '',
          password: '',
        },
        validation: {},
      },
      response: { message: 'User has logged in' },
    },
  },
  logout: {
    get: {
      request: {
        params: {},
        query: {},
        body: {},
        validation: {},
      },
      response: { message: 'User has logged out' },
    },
  },
};

// endpoint:{http_method:{request:{params:{},query:{},body:{},validation:{}},response:{}}}
