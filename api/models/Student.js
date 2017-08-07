/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		studentNumber:{
			type: 'string',
			required: true,
			minLength: 8
		},
		program:{
			model: 'program',
			required: true
		},
		lastname:{
			type: 'string',
			required: true
		},
		firstname:{
			type: 'string',
			required: true
		},
		classStudent:{
			collection: 'classStudent',
			via: 'student'
		},
		grade:{
			collection: 'grade',
			via: 'student'
		}
  }
};

