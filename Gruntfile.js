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
                   removeComments: false

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
                   removeComments: false
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
                   destination: 'docs/',
                   configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json',
                   template: 'node_modules/ink-docstrap/template'
               }

           }
       }



    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('build', ['ts', 'uglify', 'jsdoc']);
    grunt.registerTask('lint', ['tslint', 'ts:dev', 'jshint']);

}
