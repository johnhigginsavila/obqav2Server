/**
 * Sopi.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		so:{
			model:'so',
			required: true
		},
		sopiCode:{
			type:'string',
			required: true,
			maxLength: true,
			uppercase: true
		},
		description:{
			type:'string'
		},
		programSopi:{
			collection: 'programSopi',
			via: 'sopi'
		}
  }
};
