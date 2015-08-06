# workflow

Skeleton project for web development.

Includes Gulp for...
SCSS compiling
Automatically adding vendor prefixes to CSS
Concatinating JS to minimise server requests
Linting Javascript errrors
Minifying CSS
Compressing image assets
Browser Sync

Includes Bower for...
Susy CSS framework
Modernizr

## Installing

Checkout repo
```
git clone https://github.com/djkush/workflow.git <project-name>
```
Install development dependencies with NPM
```
npm install
```
Install front end dependencies with Bower
```
bower install
```


## Project notes

* Modernizr should be custom built on a per project bases, only featuring the tests that the website need to test for. The version supplied includes all tests and should **not be used on production sites***.