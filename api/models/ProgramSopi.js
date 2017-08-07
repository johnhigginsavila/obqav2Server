/**
 * ProgramSopi.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		program:{
			model: 'program',
			required: true
		},
		sopi:{
			model: 'sopi',
			required: true
		},
		description:{
			type: 'string'
		},
		assessment:{
			collection: 'assessment',
			via: 'programSopi'
		},
		evidence:{
			collection: 'evidence',
			via: 'programSopi'
		},
		grade:{
			collection:'grade',
			via:'programSopi'
		}
  }
};

