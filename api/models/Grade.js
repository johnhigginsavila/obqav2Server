/**
 * Grade.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	schema: true,
  attributes: {
		assessment:{
			model: 'assessment',
			required: true
		},
		programSopi:{
			model:'programSopi',
			required:true
		},
		student:{
			model: 'student',
			required: true
		},
		grade:{
			type: 'float',
			required: true,
			max: 1
		},
		description:{
			type: 'string'
		}
  },

  afterUpdate:function(updatedRecord, cb){
	  updatePerformance(updatedRecord);
  },
  afterCreate:function(record, cb){
	  updatePerformance(record);
  },
  afterDestroy:function(destroyedRecord, cb){
	  updatePerformance(destroyedRecord);
  }
};

function updatePerformance(record){
	Assessment.findOne({id:record.assessment})
	  .populate('grade')
	  .then(getPerformanceData)
	  .then(updateAssessment)
	  .then(function(assessment){
		console.log('Performance for assessment ID: '+assessment[0].id+' is: ' + assessment[0].performance);
	  }).catch(function(err){
		  console.log(err);
	  })

	  function getPerformanceData(assessment){
		var promise = new Promise(function(resolve, reject){
			let performanceData = {
					passed:0,
					totalStudent:0,
					performance:0
				}
			if(assessment){
				assessment.grade.forEach((item, index, array) => {
					if(item.grade >= assessment.passingGrade){
						performanceData.passed ++;
						performanceData.totalStudent ++;
					}else{
						performanceData.totalStudent ++;
					}
				})
			}
			performanceData.performance = performanceData.passed / performanceData.totalStudent;
			assessment.performanceData = performanceData;
			setTimeout(function() {
				resolve(assessment);
			}, 200);
		})
		return promise;
	  }

	  function updateAssessment(assessment){
		var promise = new Promise(function(resolve, reject){
			Assessment.update({id:assessment.id}, {performance:assessment.performanceData.performance})
			.then(function(assessment){
				resolve(assessment);
			}).catch(function(err){
				reject(err);
			})
		})
		return promise;
	  }
}

