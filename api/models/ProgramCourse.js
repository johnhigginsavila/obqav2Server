/**
 * ProgramCourse.js
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
		course:{
			model: 'course',
			required: true
		},
		toBeAssessed:{
			type: 'boolean',
			defaultsTo: true
		},
		description: {
			type: 'string'
		},
		units:{
			type: 'integer'
		},
		evidence:{
			collection: 'evidence',
			via: 'programCourse'
		},
		class:{
			collection: 'class',
			via: 'programCourse'
		}
  }
};

