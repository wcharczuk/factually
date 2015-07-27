'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('aws.json'),

    s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        bucket: '<%= aws.AWS_S3_Bucket %>',
        access: "public-read"
      },
      dist: {
        cwd: "dist/",
        src: "**"
      }
    },

    concat: {
      options: {
        separator: ";"
      }, 
      app: {
        src: [
          'bower_components/react/react.js'
        ],
        dest: "dist/js/app.js"
      },
      css: {
        src: [
          "dist/css/app.less.css"
        ]
      }
    },

    less: {            
      compile: {
        options: {
          strictMath: true,
          outputSourceFiles: true,
          paths: [
            "app/less/", 
            "bower_components/bootstrap/less/",
            "bower_components/bootstrap/less/mixins"
          ],
        },
        files: {
          "dist/css/app.less.css" : "app/less/factually.less"
        }
      },
    },

    cssmin: {
      "dist/css/app.min.css" : ["dist/css/app.css"]
    },

    babel: {
      options: {
        sourceMap: true
      },
      dev: {
        files: {
            'app/js/app.jsx': 'app/js/app.js'
        }
      },
      dev: {
        files: {
            'app/js/app.jsx': 'dist/js/app.js'
        }
      }
    }

    processhtml : {
      dist : {
        options : {
          process: true,
        },
        files : {
          'dist/index.html': ['index.html']
        }
      }
    },

    copy : {
      dist : {
        files : [
          { src: "app/partials/*", dest: "dist/" },
          { src: "app/images/*", dest: "dist/" },
          { expand: true, cwd: "app/fonts/", src: ["*"], dest: "dist/fonts/" },
        ]
      },
      dev: {
        files : [
          { src: 'bower_components/lodash/lodash.min.js', dest: 'app/js/deps/lodash.min.js' },
          { src: 'bower_components/react/react.min.js', dest: 'app/js/deps/react.min.js' },
          { src: 'bower_components/react/jsxtransformer.js', dest: 'app/js/deps/jsxtransformer.js' },
          { src: 'bower_components/less/dist/less.min.js', dest: 'app/js/deps/less.min.js' },
        ]
      }
    },

    clean: {
      dist: {
        src: [ 'dist/*' ]
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask(
    'deploy',
    'Deploys the site to S3',
    [ 's3:dist' ]
  );
  grunt.registerTask(
    'dev',
    'Sets up the development environment',
    [ 
      'copy:dev',
      'babel:dev'
    ]
  );
  grunt.registerTask(
    'lessc',
    "Compiles the less files.",
    ['less:compile', 'cssmin' ]
  );
  grunt.registerTask(
      'build', 
      'Compiles all of the assets and copies the files to the build directory.', 
      [ 
        'clean:dist', 
        'concat:app', 
        'babel:dist',
        'less:compile',
        'concat:css',
        'cssmin',
        'processhtml:dist',
        'cachebreaker:dist',
        'copy:dist'
      ]
  );
};
