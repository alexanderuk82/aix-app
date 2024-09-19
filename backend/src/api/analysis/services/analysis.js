'use strict';

/**
 * analysis service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::analysis.analysis');
