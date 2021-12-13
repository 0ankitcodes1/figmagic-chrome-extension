module.exports = function(grunt) {
     // Project configuration.
     grunt.initConfig({
         watch: {
             sassFiles: {
                 files: './sass/*.scss',
                 tasks: ['sass', 'cssmin']
             }
         },
         sass: {
             dev: {
                 options: {
                     style: 'expanded'
                 },
                 files: {
                     './css/main.css': './sass/main.scss',
                 }
             }
         },
         cssmin: {
             target: {
               files: [{
                 expand: true,
                 cwd: './css',
                 src: ['*.css', '!*.min.css'],
                 dest: './css',
                 ext: '.min.css'
               }]
             }
         }
     });
 
     grunt.loadNpmTasks('grunt-contrib-cssmin');
     grunt.loadNpmTasks('grunt-contrib-sass');
     grunt.loadNpmTasks('grunt-contrib-watch');
 
     grunt.registerTask('style', ['sass']);
     grunt.registerTask('minify', ['cssmin']);
     grunt.registerTask('default', ['watch']);
 }