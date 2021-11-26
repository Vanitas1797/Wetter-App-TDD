const normalFieldsObject = {
  table: '',
  type: '',
  json: '',
  constraints: [''],
  /**
   *
   * @param {{}} request
   * @returns {boolean}
   */
  validation: function (request) {},
};

const foreignKeyFieldsObject = {
  table: null,
  constraints: null,
  reference: normalFieldsObject,
};

const constraints = {
  field: {
    not_null: 'NOT NULL',
    autoincrement: 'AUTOINCREMENT',
    primary_key: 'PRIMARY KEY',
    unique: 'UNIQUE',
  },
  table: {},
};

let cf = constraints.field;

const tables = {
  astronomy() {
    const name = this.astronomy.name;
    const pk_weather_data_day_id =
      this.weather_data_current().pk_weather_data_current_id();
    const pk_moon_phase_id = this.moon_phase().pk_moon_phase_id();
    return {
      pfk_weather_data_day_id() {
        return getObject({
          table: name,
          reference: pk_weather_data_day_id,
        });
      },
      moonrise_unix() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'moonrise_unix',
        });
      },
      moonset_unix() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'moonset_unix',
        });
      },
      fk_moon_phase_id() {
        return getObject({
          table: name,
          reference: pk_moon_phase_id,
        });
      },
    };
  },
  country_code() {
    const name = this.country_code.name;
    return {
      pk_country_code_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'country_code_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      country_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'country_name',
        });
      },
      country_code_2() {
        return getObject({
          table: name,
          type: new String(),
          json: 'country_code_2',
        });
      },
      country_code_3() {
        return getObject({
          table: name,
          type: new String(),
          json: 'country_code_3',
        });
      },
    };
  },
  location() {
    const name = this.location.name;
    const pk_state_code_id = this.state_code().pk_state_code_id();
    const pk_country_code_id = this.country_code().pk_country_code_id();
    return {
      pk_location_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'location_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      city_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'city_name',
        });
      },
      fk_state_code_id() {
        return getObject({
          table: name,
          reference: pk_state_code_id,
        });
      },
      fk_country_code_id() {
        return getObject({
          table: name,
          reference: pk_country_code_id,
        });
      },
      zip_code() {
        return getObject({
          table: name,
          type: new String(),
          json: 'zip_code',
        });
      },
      latitude() {
        return getObject({
          table: name,
          type: new String(),
          json: 'latitude',
        });
      },
      longitude() {
        return getObject({
          table: name,
          type: new String(),
          json: 'longitude',
        });
      },
      timezone_offset() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'timezone_offset',
        });
      },
    };
  },
  moon_phase() {
    const name = this.moon_phase.name;
    return {
      pk_moon_phase_id() {
        return getObject({
          table: name,
          type: new String(),
          json: 'moon_phase_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      moon_phase() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'moon_phase',
        });
      },
      moon_phase_description() {
        return getObject({
          table: name,
          type: new String(),
          json: 'moon_phase_description',
        });
      },
    };
  },
  saved_location() {
    const name = this.saved_location.name;
    const pk_user_name = this.user().pk_user_name();
    const pk_location_id = this.location().pk_location_id();
    return {
      pk_saved_location_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'saved_location_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      fk_user_name() {
        return getObject({
          table: name,
          reference: pk_user_name,
        });
      },
      fk_location_id() {
        return getObject({
          table: name,
          reference: pk_location_id,
        });
      },
    };
  },
  sky_state() {
    const name = this.sky_state.name;
    return {
      pk_sky_state_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'sky_state_name',
          constraints: [cf.primary_key],
        });
      },
    };
  },
  state_code() {
    const name = this.state_code.name;
    return {
      pk_state_code_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'state_code_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      state_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'state_name',
        });
      },
      state_code_2() {
        return getObject({
          table: name,
          type: new String(),
          json: 'state_code_2',
        });
      },
    };
  },
  user() {
    const name = this.user.name;
    return {
      pk_user_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'user_name',
          constraints: [cf.primary_key],
        });
      },
      email_address() {
        return getObject({
          table: name,
          type: new String(),
          json: 'email_address',
        });
      },
      password() {
        return getObject({
          table: name,
          type: new String(),
          json: 'password',
        });
      },
    };
  },
  weather_data_current() {
    const name = this.weather_data_current.name;
    const pk_location_id = this.location().pk_location_id();
    const pk_sky_state_name = this.sky_state().pk_sky_state_name();
    const pk_wind_direction = this.wind_direction().pk_wind_degree();
    return {
      pk_weather_data_current_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'weather_data_current_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      fk_location_id() {
        return getObject({
          table: name,
          reference: pk_location_id,
        });
      },
      date() {
        return getObject({
          table: name,
          type: new Date(),
          json: 'date',
        });
      },
      temperature() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'temperature',
        });
      },
      fk_sky_state_name() {
        return getObject({
          table: name,
          reference: pk_sky_state_name,
        });
      },
      wind_speed() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_speed',
        });
      },
      wind_gust() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_gust',
        });
      },
      wind_degree() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_degree',
        });
      },
      fk_wind_direction() {
        return getObject({
          table: name,
          reference: pk_wind_direction,
        });
      },
      humidity() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'humidity',
        });
      },
      air_pressure() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'air_pressure',
        });
      },
      sunrise() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'sunrise',
        });
      },
      sunset() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'sunset',
        });
      },
      weather_report() {
        return getObject({
          table: name,
          type: new String(),
          json: 'weather_report',
        });
      },
      last_updated_date_time() {
        return getObject({
          table: name,
          type: new String(),
          json: 'last_updated_date_time',
        });
      },
    };
  },
  weather_data_day() {
    const name = this.weather_data_day.name;
    const pk_location_id = this.location().pk_location_id();
    const pk_sky_state_name = this.sky_state().pk_sky_state_name();
    const pk_wind_direction = this.wind_direction().pk_wind_degree();
    return {
      pk_weather_data_day_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'weather_data_day_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      fk_location_id() {
        return getObject({
          table: name,
          reference: pk_location_id,
        });
      },
      date() {
        return getObject({
          table: name,
          type: new Date(),
          json: 'date',
        });
      },
      max_temperature() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'max_temperature',
        });
      },
      min_temperature() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'min_temperature',
        });
      },
      fk_sky_state_name() {
        return getObject({
          table: name,
          reference: pk_sky_state_name,
        });
      },
      wind_speed() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_speed',
        });
      },
      wind_gust() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_gust',
        });
      },
      wind_degree() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_degree',
        });
      },
      fk_wind_direction() {
        return getObject({
          table: name,
          reference: pk_wind_direction,
        });
      },
      precipitation_probability() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'precipitation_probability',
        });
      },
      humidity() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'humidity',
        });
      },
      air_pressure() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'air_pressure',
        });
      },
      sunrise() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'sunrise',
        });
      },
      sunset() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'sunset',
        });
      },
      weather_report() {
        return getObject({
          table: name,
          type: new String(),
          json: 'weather_report',
        });
      },
    };
  },
  weather_data_time() {
    const name = this.weather_data_time.name;
    const pk_sky_state_name = this.sky_state().pk_sky_state_name();
    const pk_wind_direction = this.wind_direction().pk_wind_degree();
    const pk_weather_data_day_id =
      this.weather_data_day().pk_weather_data_day_id();
    return {
      pk_weather_data_time_id() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'weather_data_hour_id',
          constraints: [cf.primary_key, cf.autoincrement],
        });
      },
      fk_weather_data_day_id() {
        return getObject({
          table: name,
          reference: pk_weather_data_day_id,
        });
      },
      hour() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'hour',
        });
      },
      temperature() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'temperature',
        });
      },
      felt_temperature() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'felt_temperature',
        });
      },
      fk_sky_state_name() {
        return getObject({
          table: name,
          reference: pk_sky_state_name,
        });
      },
      wind_speed() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_speed',
        });
      },
      wind_gust() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_gust',
        });
      },
      wind_degree() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_degree',
        });
      },
      fk_wind_direction() {
        return getObject({
          table: name,
          reference: pk_wind_direction,
        });
      },
      precipitation_probability() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'precipitation_probability',
        });
      },
      humidity() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'humidity',
        });
      },
      air_pressure() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'air_pressure',
        });
      },
    };
  },
  wind_direction() {
    const name = this.wind_direction.name;
    return {
      pk_wind_degree() {
        return getObject({
          table: name,
          type: new Number(),
          json: 'wind_degree',
          constraints: [cf.primary_key],
        });
      },
      wind_direction_name() {
        return getObject({
          table: name,
          type: new String(),
          json: 'wind_direction_name',
        });
      },
    };
  },
};

/**
 *
 * @param {{foreignKey:string,reference:{tableName:string,fieldName:string}}} field
 * @returns
 */
function foreign_key(field) {
  return `FOREIGN KEY ("${field.foreignKey}") REFERENCES "${field.reference.tableName}"("${field.reference.fieldName}")`;
}

function getType(type) {
  return type.constructor.name;
}

/**
 *
 * @param {normalFieldsObject|foreignKeyFieldsObject} object
 * @returns
 */
function getObject(object) {
  let o = { ...normalFieldsObject, ...object };
  if (o.reference) {
    o.reference.constraints = null;
    o = assign(o);
    o.foreignKey = foreign_key({
      foreignKey: o.field,
      reference: { tableName: o.reference.table, fieldName: o.reference.field },
    });
    delete o.reference;
  } else {
    o.type = getType(o.type);
  }
  return o;
}

function assign(object) {
  for (let key in object.reference) {
    if (!object[key]) object[key] = object.reference[key];
  }
  return object;
}

/**
 *
 * @param {} array
 * @returns {}
 */
function createObject(array) {
  let o = {};
  for (let entry of array) {
    o[entry.name] = entry;
  }
  return o;
}

module.exports = {
  operators: {
    comparisonOperators: {
      equal: '=',
      greaterThan: '>',
      lessThan: '<',
      greaterThanOrEqual: '>=',
      lessThanOrEqual: '<=',
      notEqual1: '<>',
      notEqual2: '!=',
    },
    logicalOperators: {
      between: 'BETWEEN',
      like: 'LIKE',
      in: 'IN',
      and: 'AND',
      or: 'OR',
      not: 'NOT',
      all: 'ALL',
      exists: 'EXISTS',
      any: 'ANY',
      some: 'SOME',
    },
  },
  tables,
  normalFieldsObject,
};
