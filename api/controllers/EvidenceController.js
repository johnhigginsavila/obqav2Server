/**
 * EvidenceController
 *
 * @description :: Server-side logic for managing evidences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path');
module.exports = {
    find:function(req, res, next){
        Evidence.find().then(function(result){
            console.log('EvidenceController: find success!');
            res.send(result);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })
    },
    findOne:function(req, res, next){
        Evidence.findOne({assessmentClass:req.body.assessmentClass, dataDescription:req.body.dataDescription})
            .then(function(result){
                if(result){
                    console.log('EvidenceController: findOne Success');
                    res.send(200, result)
                }else{
                    console.log('EvidenceController: Invalid evidence');
                    res.send(400, {name:'InvalidEvidenceError', message:'The Evidence you are looking is not available.'})
                }
            }).catch(function(err){
                console.log(err);
                res.send(500, err);
            })
    },
    upload:function(req, res, next){
        upload(req.body)
        .then(updateEvidenceDatabase)
        .then(function(file){
            console.log('EvidenceController: upload success');
            res.send(200,file);
        }).catch(function(err){
            console.log(err);
            res.send(500, err);
        })

        function upload(data){
            var promise = new Promise(function(resolve, reject){
                req.file('file').upload({
                    dirname: require('path').resolve(sails.config.appPath, 'assets/images/uploads'),
                    maxBytes: 5242880000000000000000000000,
                    saveAs: function (__newFileStream, next) { return next(undefined, req.body.classId+'_'+req.body.assessmentClass+'_'+req.body.assessment+'_'+req.body.programSopi+'_'+req.body.programCourse+'_'+req.body.dataDescription+path.extname(__newFileStream.filename));}
                },function(err, uploadFiles){
                    if(err){
                        reject(err);
                    }else{
                        resolve(uploadFiles)
                    }
                })
            })
            return promise;
        }
        function updateEvidenceDatabase(data){
            let filename = req.body.classId+'_'+req.body.assessmentClass+'_'+req.body.assessment+'_'+req.body.programSopi+'_'+req.body.programCourse+'_'+req.body.dataDescription+path.extname(data[0].filename);
            let evidenceData = {
                fileName:filename,
                fileRootName:path.basename(filename, path.extname(filename)),
                originalName:data[0].filename, 
                mimeType:data[0].type, 
                fileLocation:'images/uploads', 
                programSopi:req.body.programSopi, 
                programCourse:req.body.programCourse, 
                dataDescription:req.body.dataDescription, 
                class:req.body.classId, 
                assessmentClass:req.body.assessmentClass, 
                assessment:req.body.assessment
            };
            var myData = {
                uploadData:data[0],
                evidenceData:evidenceData
            }
            var promise = new Promise(function(resolve, reject){
                
                Evidence.find({fileRootName:myData.evidenceData.fileRootName}).then(function(evidence){
                    if(evidence.length === 0){
                        Evidence.create(myData.evidenceData).then(function(evidence){
                            myData.result = evidence;
                            resolve(myData);
                        }).catch(function(err){
                            var evidenceCreateError = [{name:'evidenceCreateError', message:'Unable to create evidence at this time', err:err}];
                            reject(evidenceCreateError);
                        })
                    }else{
                        Evidence.update({id:evidence[0].id},myData.evidenceData).then(function(evidence){
                            myData.result = evidence[0];
                            resolve(myData);
                        }).catch(function(err){
                            var evidenceUpdateError = [{name:'evidenceUpdateError', message:'Unable to update evidence at this time', err:err}];
                            reject(evidenceUpdateError);
                        })
                    }
                }).catch(function(err){
                    var evidenceFindError = [{name:'evidenceFindError', message:'Unable to find evidence at this time', err:err}];
                    reject(evidenceFindError);
                })
            })
            return promise;  
        }
            
    }
	
};

