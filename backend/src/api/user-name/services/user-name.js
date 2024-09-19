'use strict';

/**
 * user-name service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::user-name.user-name');
