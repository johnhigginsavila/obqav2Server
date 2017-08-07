/**
 * AssessmentClass.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    assessment:{
      model:'assessment',
      required: true
    },
    class:{
      model:'class',
      required: true
    },
		evidence:{
			collection: 'evidence',
			via: 'assessmentClass'
		}

  }
};

