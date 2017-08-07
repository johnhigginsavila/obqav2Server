/**
 * Program.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		programName: {
			type: 'string',
			required: true,
			unique: true
		},
		displayName: {
			type: 'string',
			required: true
		},
		localNumber:{
			type:'integer'
		},
		user:{
			collection: 'user',
			via : 'program'
		},
		programSopi:{
			collection: 'programSopi',
			via: 'program'
		},
		student:{
			collection: 'student',
			via: 'program'
		},
		programCourse:{
			collection: 'programCourse',
			via: 'program'
		},
		assessment:{
			collection: 'assessment',
			via: 'program'
		},
		class:{
			collection:'class',
			via:'program'
		}
  }
};
