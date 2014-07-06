---
layout: post
title: "Taming your Grails front-end code with Grunt"
date: 2014-07-06 11:07
comments: true
categories: 
---

So I'm once again working on a [Grails](http://grails.org) project, and as usual, we're using yet another new method for pre-processing and packaging CSS etc. First Grails gig I was on, we used the JAWR plugin. Next time round, everything had moved on and we were all using the Resources plugin. Now everybody's decided that's not good enough, and it's now all about the asset pipeline plugin. Additionally, I work with SASS, and the asset pipeline plugin for Grails that compiles SASS is an absolute abomination. Booting up JRuby and installing/running gems to compile the Sass? Please! How much more complexity do we need to turn a text file from one format to another, and make it squishy? To say nothing of the fact that it randomly just stops working now and again, with lovely JRuby-flavoured stacktraces.

Enough is enough. There are some awesome front-end tools around, and I'm going to use them. Specifcally, I'm going to use Grunt to compile my SASS.

Let's start with a shiny new Grails app:

```
$ grails create-app shiny-shiny
$ cd shiny-shiny
$ grails run-app
```

Nice. The usual default Grails stuff. First thing's first, I'll clean all that cruft out, and put a nice simple front page, with no styling in. Then we'll add some Sass. I'll just bung a simple background colour change in for now:

```
$ mkdir -p grails-app/assets/stylesheets/scss && echo "html { background-color: #fff; }" >> grails-app/assets/stylesheets/scss/main.scss
```

Now delete any CSS files you have in the web-app. Ok, now we have to compile this Sass to CSS, so it gets served up. We're going to us [Grunt](http://gruntjs.com). If you haven't used Grunt, it's worth a look at some point. In order for this stuff to work you ideally need the grunt-cli installed.

```
$ npm install -g grunt-cli
```

Now put this in a file called package.json at the root of your project:

    {
      "name": "shiny-shiny",
      "version": "0.0.1",
      "devDependencies": {
        "node-sass": "~0.7.0",
        "grunt": "~0.4.1",
        "grunt-sass": "~0.8.0"
      } 
    }

and run 

```
$ npm install
```

You now have a localised grunt installation. Now create a Gruntfile.js in the root of your project:

    module.exports = function(grunt) {
	    grunt.initConfig({
	        pkg: grunt.file.readJSON('package.json'),

	        sass: {
	            dist: {
	                options: {
	                    outputStyle: 'compressed'
	                },
	                files: {
	                    'web-app/css/main.css': 'grails-app/assets/stylesheets/scss/main.scss'
	                }
	            }
	        }
	    });

    	grunt.loadNpmTasks('grunt-sass');

     	 grunt.registerTask('build', ['sass']);
      	 grunt.registerTask('default', ['build']);
    }

If you now run 

```
$ grunt sass
```

from the command line, you'll find a generated css file at web-app/css/main.css

Run the app now, and you should see your new styles being applied. All well and good, but that's a static file. What we really want, is to have the Sass recompiled on the fly. Luckily, grunt can do that for you. Add grunt-contrib-watch as a new dependency to the package.json:

    {
      "name": "shiny-shiny",
      "version": "0.0.1",
      "devDependencies": {
        "node-sass": "~0.7.0",
        "grunt": "~0.4.1",
        "grunt-contrib-watch": "~0.5.3",
        "grunt-sass": "~0.8.0"
      }    
    }

run

```
$ grunt install
```

and configure it in your Gruntfile

	module.exports = function(grunt) {
	    grunt.initConfig({
	        pkg: grunt.file.readJSON('package.json'),

	        sass: {
	            dist: {
	                options: {
	                    outputStyle: 'compressed'
	                },
	                files: {
	                    'web-app/css/main.css': 'grails-app/assets/stylesheets/scss/main.scss'
	                }
	            }
	        },

	        watch: {
	            grunt: { files: ['Gruntfile.js'] },

	            sass: {
	                files: 'grails-app/assets/stylesheets/scss/**/*.scss',
	                tasks: ['sass']
	            }
	        }
	    });

	    grunt.loadNpmTasks('grunt-sass');
	    grunt.loadNpmTasks('grunt-contrib-watch');

	    grunt.registerTask('build', ['sass']);
	    grunt.registerTask('default', ['build','watch']);
	}

Now, run your Grails app from one window, and run grunt from another

```
$ grunt
```

You'll find that making changes to your source scss files get re-compiled and reflected in your running app quite nicely. With the out-of-the-box resources plugin. 

Lovely. Shame I have to have two windows open, really. Luckily, Grails events to the rescue. If you don't already have one, create an _Events script in your local scripts directory, and add this

    eventCompileStart = { msg ->
        def process = "grunt".execute()
        process.consumeProcessOutput(System.out, System.err)
    }

This will run your grunt watch task in-process with your grails run-app, keeping everything nice and neat in one window. No more messy plugins to keep track of, just use the standard resources plugin. No random JRuby exceptions, no being tied to whatever version of the Sass gems the plugin authors are up to, and if you have a front-end dev on the team, he'll be happy you're using tools familiar to him.

At this point, if you use git, it's worth adding node_modules to .gitignore, and strictly speaking, the compiled CSS shouldn't be checked in either. We haven't touched on distributing the compiled CSS either, or dealing with Javascript in any way. Keep an eye out for future posts.


