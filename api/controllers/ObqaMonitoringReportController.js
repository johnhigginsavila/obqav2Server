module.exports = {
    statussummary:function(req, res, next){
        Assessment.find({assessmentCycle:req.body.cycle})
        .populate('evidence')
        .populate('programSopi')
        .then(assessmentSorter)
        .then(getStatus)
        .then(calculateStatus)
        .then(function(result){
            console.log('ObqaMonitoringReportController: statussummary success');
            setTimeout(function(){
                res.send(200, result);
            }, 300)
            
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })


        function assessmentSorter(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    term1: [],
                    term2: [],
                    term3: []
                }

                data.forEach(sort);
                setTimeout(function(){
                    resolve(newData);
                }, 100)
                function sort(item, index, array){
                    if (array[index].term == 1){
                        newData.term1.push(array[index]);
                    }else if(array[index].term == 2){
                        newData.term2.push(array[index]);
                    }else{
                        newData.term3.push(array[index]);
                    }
                }
            })
            return promise;
        }

        function getStatus(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    term1:{
                        submittedAssessment:0,
                        finishedAssessment:0
                    },
                    term2:{
                        submittedAssessment:0,
                        finishedAssessment:0
                    },
                    term3:{
                        submittedAssessment:0,
                        finishedAssessment:0
                    }
                }

                data.term1.forEach(term1AssessmentCounter);
                data.term2.forEach(term2AssessmentCounter);
                data.term3.forEach(term3AssessmentCounter);

                setTimeout(function(){
                    resolve(newData);
                }, 100)

                function term1AssessmentCounter(item, index, array){
                    if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                        newData.term1.submittedAssessment ++;
                    }else{
                        newData.term1.submittedAssessment ++;
                        newData.term1.finishedAssessment ++;
                    }
                }

                function term2AssessmentCounter(item, index, array){
                    if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                        newData.term1.submittedAssessment ++;
                    }else{
                        newData.term2.submittedAssessment ++;
                        newData.term2.finishedAssessment ++;
                    }
                }

                function term3AssessmentCounter(item, index, array){
                    if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                        newData.term1.submittedAssessment ++;
                    }else{
                        newData.term3.submittedAssessment ++;
                        newData.term3.finishedAssessment ++;
                    }
                }

            })
            return promise;
        }

        function calculateStatus(data){
            var promise = new Promise(function(resolve, reject){
                let newData = {
                    term1:assessmentStatusCalculator(data.term1),
                    term2:assessmentStatusCalculator(data.term2),
                    term3:assessmentStatusCalculator(data.term3)
                }

                resolve(newData);

                function assessmentStatusCalculator(data){
                    var x = data.submittedAssessment;
                    var y = data.finishedAssessment;
                    if(x > 0){
                        var result = (y/x) + .5
                        return result;
                    }else{
                        return 0;
                    }
                }
            })
            return promise;
                
        }


    },
    statusperprogram:function(req, res, next){
        Program.find()
        .populate('assessment', {assessmentCycle:req.body.cycle})
        .then(processData)
        .then(function(result){
            console.log('ObqaMonitoringReportController: statusperprogram success');
            setTimeout(function() {
                res.send(200, result);
            }, 300);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })


        function processData(data){
            var promise = new Promise(function(resolve, reject){

                data.forEach(process);
                setTimeout(function(){
                    resolve(data);
                }, 200)
                function process(item, index, array){
                    assessmentSorter(array[index].assessment)
                    .then(getStatus)
                    .then(calculateStatus)
                    .then(function(result){
                        newData = {
                            program:array[index].id,
                            programName:array[index].programName,
                            displayName:array[index].displayName,
                            status:result
                        }
                        array[index] = newData;
                    }).catch(function(err){
                        console.log(err);
                    })
                }

                

            })
            return promise;

            function assessmentSorter(data){
                var promise = new Promise(function(resolve, reject){
                    let newData = {
                        term1: [],
                        term2: [],
                        term3: []
                    }

                    data.forEach(sort);
                    setTimeout(function(){
                        resolve(newData);
                    }, 100)
                    function sort(item, index, array){
                        if (array[index].term == 1){
                            newData.term1.push(array[index]);
                        }else if(array[index].term == 2){
                            newData.term2.push(array[index]);
                        }else{
                            newData.term3.push(array[index]);
                        }
                    }
                })
                return promise;
            }

            function getStatus(data){
                var promise = new Promise(function(resolve, reject){
                    let newData = {
                        term1:{
                            submittedAssessment:0,
                            finishedAssessment:0
                        },
                        term2:{
                            submittedAssessment:0,
                            finishedAssessment:0
                        },
                        term3:{
                            submittedAssessment:0,
                            finishedAssessment:0
                        }
                    }

                    data.term1.forEach(term1AssessmentCounter);
                    data.term2.forEach(term2AssessmentCounter);
                    data.term3.forEach(term3AssessmentCounter);

                    setTimeout(function(){
                        resolve(newData);
                    }, 100)

                    function term1AssessmentCounter(item, index, array){
                        if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                            newData.term1.submittedAssessment ++;
                        }else{
                            newData.term1.submittedAssessment ++;
                            newData.term1.finishedAssessment ++;
                        }
                    }

                    function term2AssessmentCounter(item, index, array){
                        if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                            newData.term1.submittedAssessment ++;
                        }else{
                            newData.term2.submittedAssessment ++;
                            newData.term2.finishedAssessment ++;
                        }
                    }

                    function term3AssessmentCounter(item, index, array){
                        if(array[index].performance == undefined || array[index].performance == null || array[index].improvementPlan == undefined ){
                            newData.term1.submittedAssessment ++;
                        }else{
                            newData.term3.submittedAssessment ++;
                            newData.term3.finishedAssessment ++;
                        }
                    }

                })
                return promise;
            }

            function calculateStatus(data){
                var promise = new Promise(function(resolve, reject){
                    let newData = {
                        term1:assessmentStatusCalculator(data.term1),
                        term2:assessmentStatusCalculator(data.term2),
                        term3:assessmentStatusCalculator(data.term3)
                    }

                    resolve(newData);

                    function assessmentStatusCalculator(data){
                        var x = data.submittedAssessment;
                        var y = data.finishedAssessment;
                        if(x > 0){
                            var result = (y/x) + .5
                            return result;
                        }else{
                            return 0;
                        }
                    }
                })
                return promise;
                    
            }
        }

            
    },
    report:function(req, res, next){
        Assessment.find()
        .populate('grade')
        .then(populateProgramCourse)
        .then(populateProgramSopi)
        .then(populateProgram)
        .then(prepareData)
        .then(function(assessment){
            console.log('ObqaMonitoringReportController: report success');
            res.send(200, assessment);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function populateProgram(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    Program.findOne({id:item.program}).then(function(program){
                        item.program = program;
                    }).catch(function(err){
                        console.log(err);
                    })
                })
                setTimeout(function(){
                    resolve(data);
                },200)
            })
            return promise;
        }

        function populateProgramCourse(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    ProgramCourse.findOne({id:item.programCourse})
                    .populate('course')
                    .then(function(programCourse){
                        item.programCourse = programCourse;
                    }).catch(function(err){
                        console.log(err);
                    })
                })

                setTimeout(function() {
                    resolve(data);
                }, 200);
            })
            return promise;
        }

        function populateProgramSopi(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    ProgramSopi.findOne({id:item.programSopi})
                    .populate('sopi')
                    .then(function(programSopi){
                        item.programSopi = programSopi;
                        //console.log(item.programSopi)
                    }).catch(function(err){
                        console.log(err);
                    })
                })
                setTimeout(function() {
                    resolve(data);
                }, 200);
            })
            return promise;
        }

        function prepareData(data){
            var promise = new Promise(function(resolve, reject){
                let newData = [];
                data.forEach((item, index, array) => {
                    let assessmentData = {
                        grade: item.grade,
                        program: item.program,
                        programSopi: item.programSopi.id,
                        sopi:item.programSopi.sopi.sopiCode,
                        programCourse: item.programCourse.id,
                        course:item.programCourse.course.courseCode,
                        assessmentLevel: item.assessmentLevel,
                        assessmentTask: item.assessmentTask,
                        passingGrade: item.passingGrade,
                        target: item.target,
                        assessmentComment: item.assessmentComment,
                        performance: item.performance,
                        improvementPlan: item.improvementPlan,
                        assessmentCycle: item.assessmentCycle,
                        term: item.term,
                        academicYear: item.academicYear,
                        id:item.id
                    }
                    newData.push(assessmentData);
                })
                setTimeout(function(){
                    resolve(newData);
                }, 100)
            })
            return promise;
        }
    },
    reportperprogram:function(req, res, next){
        Assessment.find({program:req.headers.program, assessmentCycle:req.headers.cycle})
        .populate('grade')
        .then(populateProgramCourse)
        .then(populateProgramSopi)
        .then(populateProgram)
        .then(prepareData)
        .then(function(assessment){
            console.log('ObqaMonitoringReportController: report success');
            res.send(200, assessment);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function populateProgram(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    Program.findOne({id:item.program}).then(function(program){
                        item.program = program;
                    }).catch(function(err){
                        console.log(err);
                    })
                })
                setTimeout(function(){
                    resolve(data);
                },200)
            })
            return promise;
        }

        function populateProgramCourse(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    ProgramCourse.findOne({id:item.programCourse})
                    .populate('course')
                    .then(function(programCourse){
                        item.programCourse = programCourse;
                    }).catch(function(err){
                        console.log(err);
                    })
                })

                setTimeout(function() {
                    resolve(data);
                }, 200);
            })
            return promise;
        }

        function populateProgramSopi(data){
            var promise = new Promise(function(resolve, reject){
                data.forEach((item, index, array) => {
                    ProgramSopi.findOne({id:item.programSopi})
                    .populate('sopi')
                    .then(function(programSopi){
                        item.programSopi = programSopi;
                        //console.log(item.programSopi)
                    }).catch(function(err){
                        console.log(err);
                    })
                })
                setTimeout(function() {
                    resolve(data);
                }, 200);
            })
            return promise;
        }

        function prepareData(data){
            var promise = new Promise(function(resolve, reject){
                let newData = [];
                data.forEach((item, index, array) => {
                    let assessmentData = {
                        grade: item.grade,
                        program: item.program,
                        programSopi: item.programSopi.id,
                        sopi:item.programSopi.sopi.sopiCode,
                        programCourse: item.programCourse.id,
                        course:item.programCourse.course.courseCode,
                        assessmentLevel: item.assessmentLevel,
                        assessmentTask: item.assessmentTask,
                        passingGrade: item.passingGrade,
                        target: item.target,
                        assessmentComment: item.assessmentComment,
                        performance: item.performance,
                        improvementPlan: item.improvementPlan,
                        assessmentCycle: item.assessmentCycle,
                        term: item.term,
                        academicYear: item.academicYear,
                        id:item.id
                    }
                    newData.push(assessmentData);
                })
                setTimeout(function(){
                    resolve(newData);
                }, 100)
            })
            return promise;
        }
    },
    cyclereport:function(req, res, next){
        ProgramSopi.find()
        .populate('sopi')
        .then(prepareData)
        .then(getPerformance)
        .then(function(result){
            console.log('ObqaMonitoringReportController: cyclereport success');
            res.send(200, result);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
        function prepareData(data){
            var promise = new Promise(function(resolve, reject){
                let newData = [];
                data.forEach((item, index, array) => {
                    let processedData = {
                        sopi:item.sopi.sopiCode,
                        programSopi:item.id,
                        cycleTarget:[],
                        cycle:[1,2,3,4,5],
                        cyclePerformance:[],
                        cyclePerformanceLabel:[],
                        program:item.program
                    }
                    newData.push(processedData);
                })
                /*for(var i = 0; i < data.length; i ++){
                    let processedData = {
                        sopi:data[i].sopi.sopiCode,
                        programSopi:data[i].id,
                        cyclePerformance:[],
                        cyclePerformanceLabel:[],
                        program:data[i].program
                    }
                    newData.push(processedData);
                }*/
                setTimeout(function() {
                    resolve(newData);
                }, 100);
            })
            return promise;
        }

        function getPerformance(data){
            var promise = new Promise(function(resolve, reject){
                let newData = [];
                data.forEach((item, index, array) => {
                    getAssessment(item);
                    newData.push(item);
                })

                function getAssessment(object){
                    for(let i = 0; i < object.cycle.length; i++){
                        Assessment.find({assessmentCycle:object.cycle[i], programSopi:object.programSopi})
                        .then((assessment) => {
                            if(assessment.length == 0){
                                object.cyclePerformance[i] = 0;
                                object.cycleTarget[i] = 0;
                                object.cyclePerformanceLabel[i] = 'cycle ' + (object.cycle[i]);
                            }else{
                                if(assessment[0].performance == null){
                                    object.cyclePerformance[i] = 0;
                                    object.cycleTarget[i] = assessment[0].target;
                                    object.cyclePerformanceLabel[i] = 'cycle ' + (object.cycle[i]);
                                }else{
                                    object.cyclePerformance[i] = assessment[0].performance * 100;
                                    object.cycleTarget[i] = assessment[0].target* 100;
                                    object.cyclePerformanceLabel[i] = 'cycle ' + (object.cycle[i]);
                                }
                            }
                        }).catch((err) => {
                            console.log(err);
                        })
                    }
                }
                setTimeout(function() {
                    resolve(newData)
                }, 500);
            })
            return promise;
        }
    }     
}