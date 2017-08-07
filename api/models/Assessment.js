/**
 * Assessment.js
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
		programSopi:{
			model: 'programSopi',
			required: true
		},
		assessmentLevel:{
			type: 'integer',
			required: true
		},
		assessmentTask:{
			type: 'string',
			required: true
		},
		passingGrade:{
			type:'float',
			required: true,
			max: 1
		},
		target:{
			type: 'float',
			required: true,
			max: 1
		},
		assessmentComment:{
			type:'string'
		},
		performance:{
			type:'float'
		},
		improvementPlan:{
			type:'string'
		},
		assessmentCycle:{
			type:'integer',
			required: true
		},
		term:{
			type:'integer',
			required: true
		},
		academicYear:{
			type:'string',
			required: true
		},
		programCourse:{
			model: 'programCourse',
			required: true
		},
		grade:{
			collection: 'grade',
			via: 'assessment'
		},
		assessmentClass:{
			collection: 'assessmentClass',
			via: 'assessment'
		},
		evidence:{
			collection:'evidence',
			via:'assessment'
		}
  }
};
