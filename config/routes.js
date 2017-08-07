/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },
  '/user/create':{
    controller: 'UserController',
    action: 'create'
  },
  '/session/create':{
    controller: 'SessionController',
    action: 'create'
  },
  '/assessment/find':{
    controller:'AssessmentController',
    action:'find'
  },
  '/assessment/findone':{
    controller:'AssessmentController',
    action:'findOne'
  },
  '/assessment/create':{
    controller:'AssessmentController',
    action:'create'
  },
  '/assessment/upload':{
    controller:'AssessmentController',
    action:'upload'
  },
  '/assessment/update':{
    controller:'AssessmentController',
    action:'update'
  },
  '/class':{
    controller:'ClassController',
    action:'find'
  },
  '/class/findprogram':{
    controller:'ClassController',
    action:'findProgram'
  },
  '/class/create':{
    controller: 'ClassController',
    action:'create'
  },
  '/class/upload':{
    controller:'ClassController',
    action: 'upload'
  },
  '/class/:instructor/:id':{
    controller:'ClassController',
    action:'findOne'
  },
  
  '/course':{
    controller:'CourseController',
    action: 'find'
  },
  '/course/create':{
    controller:'CourseController',
    action:'create'
  },
  '/course/upload':{
    controller:'CourseController',
    action:'upload'
  },
  '/sopi':{
    controller:'SopiController',
    action:'find'
  },
  '/sopi/create':{
    controller:'SopiController',
    action:'create'
  },
  '/sopi/upload':{
    controller:'SopiController',
    action:'upload'
  },
  '/grade':{
    controller:'GradeController',
    action:'find'
  },
  '/grade/upload':{
    controller:'GradeController',
    action: 'upload'
  },
  '/grade/statussummary':{
    controller:'GradeController',
    action: 'statussummary'
  },
  '/grade/statusperprogram':{
    controller:'GradeController',
    action:'statusperprogram'
  },
  '/grade/statusperstudent':{
    controller: 'GradeController',
    action: 'statusperstudent'
  },
  '/evidence':{
    controller:'EvidenceController',
    action:'find'
  },
  '/evidence/upload':{
    controller:'EvidenceController',
    action:'upload'
  },
  '/evidence/findOne':{
    controller:'EvidenceController',
    action:'findOne'
  },
  '/obqamonitoringreport/statusperprogram':{
    controller:'ObqaMonitoringReportController',
    action: 'statusperprogram'
  },
  '/obqamonitoringreport/statussummary':{
    controller: 'ObqaMonitoringReportController',
    action: 'statussummary'
  },
  'obqamonitoringreport/report':{
    controller:'ObqaMonitoringReportController',
    action:'report'
  },
  'obqamonitoringreport/reportperprogram':{
    controller:'ObqaMonitoringReportController',
    action:'reportperprogram'
  },
  'obqamonitoringreport/cyclereport':{
    controller:'ObqaMonitoringReportController',
    action:'cyclereport'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
