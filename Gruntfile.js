/**
 * Created by Amalan on 7/19/14.
 */

module.exports = function(grunt) {
    grunt.initConfig({
       pkg: grunt.file.readJSON('package.json'),
       ts: {
           build: {
               options: {
                   target: 'es5',
                   sourceMap: false,
                   sourceRoot: '',
                   declaration: false,
                   removeComments: false,
                   htmlModuleTemplate: "<%= filename %>",
                   htmlVarTemplate: "<%= ext %>"

               },

               src: ['src/ts/Graph.ts'],
               out: 'dist/Graph.js'
           },

           dev: {
               options: {
                   target: 'es5',
                   sourceMap: false,
                   sourceRoot: '',
                   declaration: false,
                   removeComments: false,
                   htmlModuleTemplate: "<%= filename %>",
                   htmlVarTemplate: "<%= ext %>"
               },
               src: ['src/ts/Graph.ts'],
               outDir: 'src/js/'

           }

       },

       uglify: {
           options: {
               banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> © Amalan Iyengar 2014*/\n'
           },

           dist: {
               files: {
                   'dist/Graph.min.js': ['<%= ts.build.out %>']
               }
           }
       },

       tslint: {
           options: {
               configuration: grunt.file.readJSON('tslint.json'),
               out: 'lint/tslint.txt'
           },

           files: {
               src: ['src/ts/**/*.ts']

           }
       },

       jshint: {
           files: ['src/js/**/*.js']
       },

       jsdoc: {
           dist: {
               src: ['src/js/**/*.js', 'README.md'],
               options: {
                   destination: 'docs/'
               }

           }
       },

       concat: {
           options: {
               separator: "\n"
           },

           dist: {
               src: ["dist/CAS.min.js", "dist/Graph.min.js"],
               dest: "dist/main.min.js"
           }
       }



    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('build', ['ts', 'uglify', 'jsdoc', 'concat']);
    grunt.registerTask('lint', ['tslint', 'ts:dev', 'jshint']);
    grunt.registerTask('default', ['tslint', 'ts:dev', 'jshint', 'ts:build', 'uglify', 'jsdoc', 'concat']);
}
