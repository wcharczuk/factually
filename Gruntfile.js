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

    clean: {
      dist: {
        src: [ 'dist/*' ]
      },
      artifacts : {
        src: [ 'app/css/**' ]
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/js/app.js': 'app/jsx/app.jsx'
        }
      }
    },

    less: {
      compile: {
        options: {
          strictMath: true,
          outputSourceFiles: true,
          paths: [
            "app/less/", 
            "app/vendor/bootstrap/less/",
            "app/vendor/bootstrap/less/mixins"
          ],
        },
        files: {
          "app/css/app.css" : "app/less/factually.less"
        }
      },
    },

    cssmin: {
      "dist/css/app.min.css" : ["app/css/app.css"]
    },

    processhtml : {
      dist : {
        options : {
          process: true,
        },
        files : {
          'dist/index.html': ['app/index.html']
        }
      }
    },

    uglify : {
      options: {
        mangle: false
      },
      dist : {
        files: {
          'dist/js/deps.js': [
            'app/vendor/lodash/lodash.min.js', 
            'app/vendor/react/react-with-addons.min.js',
            'app/vendor/jquery/dist/jquery.min.js',
            'app/vendor/bootstrap/dist/js/bootstrap.min.js'
          ]
        }
      }
    },

    copy : {
      dist : {
        files : [
          { src: "app/images/*", dest: "dist/" }
        ]
      }
    },

    nodestatic: {
      server: {
        options: {
          port: 8080,
          base: 'app',
          keepalive: true,
          verbose: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-cache-breaker');
  grunt.loadNpmTasks('grunt-nodestatic');

  grunt.registerTask(
    'deploy',
    'Deploys the site to S3',
    [ 's3:dist' ]
  );
  grunt.registerTask(
    'start',
    'Start a local static webserver',
    [ 'nodestatic' ]
  );
  grunt.registerTask(
    'lessc',
    'Compiles the less files.',
    ['less:compile', 'cssmin' ]
  );
  grunt.registerTask(
      'build', 
      'Compiles all of the assets and copies the files to the build directory.', 
      [ 
        'clean:dist',
        'babel',
        'uglify:dist',
        'less:compile',
        'cssmin',
        'processhtml:dist',
        'copy:dist',
        'clean:artifacts'
      ]
  );

  grunt.registerTask(
      'dev', 
      'Compiles all of the assets and copies the files to the build directory.', 
      [ 
        'babel',
        'less:compile',
        'cssmin',
        'processhtml:dist',
        'copy:dist',
        'clean:artifacts'
      ]
  );

  grunt.registerTask('default', ['build']);
};
