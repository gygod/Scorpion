module.exports = function( grunt ) {

    grunt.initConfig({

        component_build: {
            build: {
                output: './dist/',
                name: 'scorpion',
                styles: false,
                scripts: true,
                verbose: true
            }
        },
        mocha: {
            build: {
                src: ['test/test.html'],
                options: {
                    reporter: 'Spec',
                    run: true
                }
            }
        },
    })
    grunt.loadNpmTasks( 'grunt-mocha' )
    grunt.registerTask( 'test', ['mocha'] )
    
}