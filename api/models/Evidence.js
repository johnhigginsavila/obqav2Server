/**
 * Evidence.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		fileName: {
			type: 'string',
			required: true
		},
		fileRootName:{
			type:'string',
			required: true
		},
		originalName:{
			type: 'string',
			required: true
		},
		mimeType:{
			type:'string',
			required: true
		},
		fileLocation:{
			type: 'string',
			required: true
		},
		programSopi:{
			model: 'programSopi',
			required: true
		},
		programCourse:{
			model: 'programCourse',
			required: true
		},
		dataDescription:{
			type: 'string',
			required: true
		},
		class:{
			model:'class',
			required:true
		},
		assessment:{
			model:'assessment',
			required:true
		},
		assessmentClass:{
			model:'assessmentClass',
			required:true
		},
		description:{
			type: 'string'
		}
  }
};

