/**
 * AssessmentController
 *
 * @description :: Server-side logic for managing assessments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require ('path')
var xlsxj = require('xlsx-2-json');
module.exports = {
    find:function(req, res, next){
        Assessment
        .find()
        .sort('program ASC')
        .sort('academicYear ASC')
        .sort('term ASC')
        .populate('program')
        .populate('assessmentClass')
        .populate('programCourse')
        .populate('programSopi')
        .then(populateSopi)
        .then(populateCourse)
        //.then(dataCleaner)
        .then(function(assessments){
            //console.log(req.headers);
            setTimeout(function() {
                console.log('AssessmentController: Find Success!');
                res.status(200).send(assessments)
            }, 200);
        }).catch(function(err){
            console.log(err);
            res.status(500).send(err);
        })
        function dataCleaner(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(deleteUnwantedData);
                resolve(data);
                function deleteUnwantedData(item, index, array){
                    delete array[index].program.createdAt;
                    delete array[index].program.updatedAt;
                    delete array[index].assessmentClass.createdAt;
                    delete array[index].assessmentClass.updatedAt;
                    delete array[index].programSopi.createdAt;
                    delete array[index].programSopi.updatedAt;
                    delete array[index].programSopi.sopi.createdAt;
                    delete array[index].programSopi.sopi.updatedAt;
                    delete array[index].programCourse.createdAt;
                    delete array[index].programCourse.updatedAt;
                    delete array[index].programCourse.course.createdAt;
                    delete array[index].programCourse.course.updatedAt;
                    delete array[index].createdAt;
                    delete array[index].updatedAt;
                }
            })
            return promise;
        }
        function populateSopi(data){
            var promise = new Promise(function(resolve, reject){
                function sopi(item, index, array){
                    ProgramSopi.find({id:array[index].programSopi.id})
                    .populate('sopi')
                    .then(function(programSopi){
                        delete array[index].programSopi;
                        array[index].programSopi = programSopi[0];
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                data.forEach(sopi);
                setTimeout(function() {
                    resolve(data)
                }, 100);
            })
            return promise;
        }
        function populateCourse(data){
            var promise = new Promise(function(resolve, reject){
                function course(item, index, array){
                    ProgramCourse.find({id:array[index].programCourse.id})
                    .populate('course')
                    .then(function(programCourse){
                        array[index].programCourse = programCourse[0];
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                data.forEach(course)
                setTimeout(function() {
                    resolve(data)
                }, 100);
            })
            return promise;
        }  
    },
	findOne:function(req, res, next){
        Assessment
        .find({program:req.headers.program, assessmentCycle:req.headers.cycle})
        .sort('program ASC')
        .sort('academicYear ASC')
        .sort('term ASC')
        .populate('program')
        .populate('assessmentClass')
        .populate('programCourse')
        .populate('programSopi')
        .then(populateSopi)
        .then(populateCourse)
        //.then(dataCleaner)
        .then(function(assessments){
            //console.log(req.headers);
            setTimeout(function() {
                console.log('AssessmentController: Find Success!');
                res.status(200).send(assessments)
            }, 200);
        }).catch(function(err){
            console.log(err);
            res.status(500).send(err);
        })
        function dataCleaner(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(deleteUnwantedData);
                resolve(data);
                function deleteUnwantedData(item, index, array){
                    delete array[index].program.createdAt;
                    delete array[index].program.updatedAt;
                    delete array[index].assessmentClass.createdAt;
                    delete array[index].assessmentClass.updatedAt;
                    delete array[index].programSopi.createdAt;
                    delete array[index].programSopi.updatedAt;
                    delete array[index].programSopi.sopi.createdAt;
                    delete array[index].programSopi.sopi.updatedAt;
                    delete array[index].programCourse.createdAt;
                    delete array[index].programCourse.updatedAt;
                    delete array[index].programCourse.course.createdAt;
                    delete array[index].programCourse.course.updatedAt;
                    delete array[index].createdAt;
                    delete array[index].updatedAt;
                }
            })
            return promise;
        }
        function populateSopi(data){
            var promise = new Promise(function(resolve, reject){
                function sopi(item, index, array){
                    ProgramSopi.find({id:array[index].programSopi.id})
                    .populate('sopi')
                    .then(function(programSopi){
                        delete array[index].programSopi;
                        array[index].programSopi = programSopi[0];
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                data.forEach(sopi);
                setTimeout(function() {
                    resolve(data)
                }, 100);
            })
            return promise;
        }
        function populateCourse(data){
            var promise = new Promise(function(resolve, reject){
                function course(item, index, array){
                    ProgramCourse.find({id:array[index].programCourse.id})
                    .populate('course')
                    .then(function(programCourse){
                        array[index].programCourse = programCourse[0];
                    }).catch(function(err){
                        console.log(err);
                    })
                }
                data.forEach(course)
                setTimeout(function() {
                    resolve(data)
                }, 100);
            })
            return promise;
        }  
    },
    create:function(req,res,next){
        course(req.body)
        .then(programCourse)
        .then(sopi)
        .then(programSopi)
        .then(finalizeData)
        .then(createAssessment)
        .then(function(data){
            console.log('AssessmentController: create success!');
            res.status(200).send(data);
        }).catch(function(err){
            console.log(err);
            res.status(500).send(err);
        })

        function course(data){
            var promise = new Promise(function(resolve, reject){
                Course.find({courseCode:data.course}).then(function(course){
                    if(course.length === 0){
                        var courseError = [{error:'courseNotFoundError', message:'Invalid Course'}];
                        reject(courseError);
                    }else{
                        data.course = course[0];
                        resolve(data);
                    }
                }).catch(function(err){
                    var error = [{error:'courseFindError', message:'Cannont Check the course at this time', err:err}];
                    reject(err);
                })
            })
            return promise;
        }

        function programCourse(data){
            var promise = new Promise(function(resolve, reject){
                ProgramCourse.find({course:data.course.id, program:data.program}).then(function(programCourse){
                    if(programCourse.length === 0){
                        var programCourseError = [{error:'programCourseNotFoundError', message:'Invalid programCourse'}];
                        reject(programCourseError);
                    }else{
                        data.programCourse = programCourse[0];
                        resolve(data)
                    }
                }).catch(function(err){
                    var error = [{error:'programCourseFindError', message:'Cannot Check the program course at this time',err:err}];
                    reject(error);
                })
            })
            return promise;
        }

        function sopi(data){
            var promise = new Promise(function(resolve, reject){
                Sopi.find({sopiCode:data.sopi}).then(function(sopi){
                    if(sopi.length === 0){
                        var sopiFindError = [{error:'sopiFindError', message:'Invalid SOPI'}];
                        reject(sopiFindError);
                    }
                    else{   
                        data.sopi = sopi[0];
                        resolve(data);
                    }
                }).catch(function(err){
                    var error = [{error:'sopiFindError',message:'Cannot check for the sopi at this time',err:err}];
                    reject(error);
                })
            })
            return promise;
        }
        function programSopi(data){
            var promise = new Promise(function(resolve, reject){
                ProgramSopi.find({sopi:data.sopi.id, program:data.program}).then(function(programSopi){
                    if(programSopi.length === 0){   
                        var error = [{error:'programSopiFindError', message:'Invalid Program Sopi'}];
                        reject(error);
                    }else{
                        data.programSopi = programSopi[0];
                        resolve(data);
                    }
                }).catch(function(err){
                    var error = [{error:'programSopiFindError', message:'Cannot check for the programSopi at this time',err:err}];
                    reject(error);
                })
            })
            return promise;
        }
        function finalizeData(data){
            var promise = new Promise(function(resolve, reject){
                var finalData = {
                    program : data.program,
                    programSopi : data.programSopi.id,
                    assessmentLevel : data.assessmentLevel,
                    assessmentTask : data.assessmentTask,
                    passingGrade : data.passingGrade,
                    target : data.target,
                    assessmentCycle : data.assessmentCycle,
                    academicYear : data.academicYear,
                    programCourse : data.programCourse.id,
                    term: data.term
                }
                resolve(finalData);
            })
            return promise;
        }

        function createAssessment(data){
            var promise = new Promise(function(resolve, reject){
                Assessment.find({program:data.program, programSopi:data.programSopi, assessmentCycle:data.assessmentCycle, programCourse:data.programCourse})
                .then(function(assessment){
                    if(assessment.length === 0){
                        Assessment.create(data).then(function(assessment){
                            resolve(assessment);
                        }).catch(function(err){
                            var error = [{error:'assessmentCreateError', message:'Cannot create assessment at this time', err:err}];
                            reject(error);
                        })
                    }else{
                        Assessment.update({id:assessment[0].id},data).then(function(assessment){
                            resolve(assessment);
                        }).catch(function(err){
                            var error = [{error:'assessmentUpdateError', message:'Cannot update assessment at this time', err:err}];
                            reject(error);
                        })
                    }
                }).catch(function(err){
                    var findError = [{error:'assessmentFindError', message:'Cannot find assessment at this time', err:err}];
                    reject(findError);
                })
             })
            return promise;
        }

    

    },
    upload:function(req, res, next){
        parseXlsx()
        .then(processData)
        .then(function(result){
            console.log('AssessmentController: upload success!');
            res.send(200, result);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function parseXlsx(){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload(function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }
                    else if(path.extname(uploadFiles[0].filename) != ".xlsx" && path.extname(uploadFiles[0].filename) != ".xls"){
                        reject([{name:'uploadAssessmentError', message:'Invalid File...'}]);
                    }else{
                        var fd = uploadFiles[0].fd;
                        xlsxj({
                            input: fd,
                            output: null
                        },function(err, result){
                            if(err){
                                reject(err);
                            }else{
                                resolve(result);
                            }
                        })
                    }
                })
            })
            return promise;
        }

        function processData(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach(saveData);
                setTimeout(function() {
                    resolve(data);
                }, 1000);
            })
            return promise;

            function saveData(item, index, array){
                course(array[index])
                .then(programCourse)
                .then(sopi)
                .then(programSopi)
                .then(finalizeData)
                .then(createAssessment)
                .then(function(data){
                    array[index] = data;
                }).catch(function(err){
                    console.log(err);
                })
            }

            function course(data){
                var promise = new Promise(function(resolve, reject){
                    Course.find({courseCode:data['COURSE']}).then(function(course){
                        if(course.length === 0){
                            var courseError = [{error:'courseNotFoundError', message:'Invalid Course'}];
                            reject(courseError);
                        }else{
                            data.course = course[0];
                            resolve(data);
                        }
                    }).catch(function(err){
                        var error = [{error:'courseFindError', message:'Cannont Check the course at this time', err:err}];
                        reject(err);
                    })
                })
                return promise;
            }

            function programCourse(data){
                var promise = new Promise(function(resolve, reject){
                    ProgramCourse.find({course:data.course.id, program:req.body.program}).then(function(programCourse){
                        if(programCourse.length === 0){
                            var programCourseError = [{error:'programCourseNotFoundError', message:'Invalid programCourse'}];
                            reject(programCourseError);
                        }else{
                            data.programCourse = programCourse[0];
                            resolve(data)
                        }
                    }).catch(function(err){
                        var error = [{error:'programCourseFindError', message:'Cannot Check the program course at this time',err:err}];
                        reject(error);
                    })
                })
                return promise;
            }

            function sopi(data){
                var promise = new Promise(function(resolve, reject){
                    Sopi.find({sopiCode:data['SOPI']}).then(function(sopi){
                        if(sopi.length === 0){
                            var sopiFindError = [{error:'sopiFindError', message:'Invalid SOPI'}];
                            reject(sopiFindError);
                        }
                        else{   
                            data.sopi = sopi[0];
                            resolve(data);
                        }
                    }).catch(function(err){
                        var error = [{error:'sopiFindError',message:'Cannot check for the sopi at this time',err:err}];
                        reject(error);
                    })
                })
                return promise;
            }
            function programSopi(data){
                var promise = new Promise(function(resolve, reject){
                    ProgramSopi.find({sopi:data.sopi.id, program:req.body.program}).then(function(programSopi){
                        if(programSopi.length === 0){   
                            var error = [{error:'programSopiFindError', message:'Invalid Program Sopi'}];
                            reject(error);
                        }else{
                            data.programSopi = programSopi[0];
                            resolve(data);
                        }
                    }).catch(function(err){
                        var error = [{error:'programSopiFindError', message:'Cannot check for the programSopi at this time',err:err}];
                        reject(error);
                    })
                })
                return promise;
            }
            function finalizeData(data){
                var promise = new Promise(function(resolve, reject){
                    var finalData = {
                        program : req.body.program,
                        programSopi : data.programSopi.id,
                        assessmentLevel : data['ASSESSMENT LEVEL'],
                        assessmentTask : data['ASSESSMENT TASK'],
                        passingGrade : data['PASSING GRADE'],
                        target : data['TARGET'],
                        assessmentCycle : data['CYCLE'],
                        academicYear : data['ACADEMIC YEAR'],
                        programCourse : data.programCourse.id,
                        term: data['TERM']
                    }
                    resolve(finalData);
                })
                return promise;
            }

            function createAssessment(data){             
                var promise = new Promise(function(resolve, reject){

                    Assessment.find({program:req.body.program, programSopi:data.programSopi, assessmentCycle:data.assessmentCycle, programCourse:data.programCourse, academicYear:data.academicYear})
                    .then(function(assessment){
                        if(assessment.length === 0){
                            Assessment.create(data).then(function(assessment){
                                resolve(assessment);
                            }).catch(function(err){
                                var error = [{error:'assessmentCreateError', message:'Cannot create assessment at this time', err:err}];
                                reject(error);
                            })
                        }else{
                            Assessment.update({id:assessment[0].id},data).then(function(assessment){
                                resolve(assessment[0]);
                            }).catch(function(err){
                                var error = [{error:'assessmentUpdateError', message:'Cannot update assessment at this time', err:err}];
                                reject(error);
                            })
                        }
                    }).catch(function(err){
                        var findError = [{error:'assessmentFindError', message:'Cannot find assessment at this time', err:err}];
                        reject(findError);
                    })

                        
                })
                return promise;
            }
        }

        

        
    },
    update:function(req, res, next){
        //for review
        Assessment.update({id:req.body.assessmentId},{improvementPlan:req.body.improvementPlan})
        .then(function(result){
            console.log('AssessmentController: update success!');
            res.send(200, result);
        }).catch(function(err){
            res.send(500, err);
            console.log(err);
        })
    }
};

