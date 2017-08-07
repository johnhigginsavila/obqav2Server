/**
 * Restriction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		restrictionName:{
			type: 'string',
			required: true
		},
		displayName:{
			type: 'string',
			required: true
		},
		description:{
			type: 'string'
		},
		user:{
			collection: 'user',
			via: 'userRestriction'
		}
  }
};


