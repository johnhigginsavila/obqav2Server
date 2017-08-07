/**
 * Course.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		courseCode: {
			type: 'string',
			uppercase: true,
			maxLength: 7,
			minLength: 7,
			required: true
		},
		courseName:{
			type: 'string'
		},
		description:{
			type: 'string'
		},
		programCourse:{
			collection: 'programCourse',
			via: 'course'
		}
  }
};


