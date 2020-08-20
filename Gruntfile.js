module.exports = function(grunt){
    grunt.registerTask('speak', ()=>{
        console.log("speak task run ok");
    });
    grunt.registerTask('yelling', ()=>{
        console.log("yelling task run ok");
    });
    //grunt both: to run
    //grunt.registerTask('both',['speak','yelling']);




    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //#grunt concat
        concat: {
          js: {
            src: ['./*.js','./model/**/*','./router/**/*','./utils/**'],
            dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
          },
          css:{
              src:[],
              dest: 'dist/styles.css'
          }
        },
        //#grunt watch , when any file in 'files' array change, 'tasks' array will executed
        watch:{
            js: {
                files: ['./*.js','./model/**/*','./router/**/*','./utils/**'],
                tasks: ['concat']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default',['concat','watch']);
};