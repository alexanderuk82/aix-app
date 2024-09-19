'use strict';

/**
 * user-name controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-name.user-name');
