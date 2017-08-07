/**
 * Class.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		programCourse:{
			model: 'programCourse',
			required: true
		},
		user:{
			model: 'user',
			required: true
		},
		program:{
			model:'program',
			required:true
		},
		term:{
			type: 'integer',
			required: true
		},
		academicYear: {
			type: 'string',
			required: true,
			minLength: 9,
			maxLength: 9
		},
		cycle:{
			type: 'integer',
			required:true,
			enum:[1,2,3]
		},
		room:{
			type: 'string',
			
		},
		description:{
			type:'string'
		},
		classStudent:{
			collection: 'classStudent',
			via: 'class'
		},
		assessmentClass:{
			collection: 'assessmentClass',
			via: 'class'
		},
		evidence:{
			collection:'evidence',
			via:'class'
		}
  }
};

