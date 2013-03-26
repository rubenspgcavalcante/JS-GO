JS-GO (Javascript Generic Objects)
===========
<p align="center">
  <img src="logo.png"/>
</p>

##Build status
Last build in Travis continuous integration  
[![Build Status](https://travis-ci.org/rubenspgcavalcante/JS-GO.png?branch=master)](https://travis-ci.org/rubenspgcavalcante/JS-GO)

##About
***JS-GO*** is a mini framework to have a better control of objects, build the models 'classes' and apply they some business rules.  
Comes with a lot of types to use in the objects attributes, like string, number, positive, negative, email and others. And give you the power to create your custom types too!  
Create collections of this objects and use querries and avoid doing extra requests only to filter some results in a collection that you already have in  hands, ... or browser js memory :)

###The GenericObject
A generic object to help the creation of objects where some attributes must not to be so dinamic.
This give some basic objects, but can be extended with extra types defined by the programer.
Comes with some default methods (set, get, validate, cast and info) to each attribute created.

###The GenericObjectCollection
A way to group the GenericObject childs. Have some methods like size, sort, add/remove, transform in simple object or JSON and simple find objects per attribute.

###The Query and Filters
A powerfull object running in a overlay to a collection which can do custom querries with the methods SELECT, UPDATE, DELETE and the filters who can be carried with 'n' operators OR, AND, XOR, and possibiliting to order the results by a especific attribute using the ORDERBY.

__Can be used both in client side and server side with nodejs__

##Download
You can download it in the minified format:  
[last version minified](https://raw.github.com/rubenspgcavalcante/JS-GO/master/build/jsgo-0.45.min.js)

##How to use?
See how to use it the complete API in [JS-GO Wiki](https://github.com/rubenspgcavalcante/JS-GO/wiki)

##Browser Support
* Firefox 4 or more
* Internet Explorer 9 or more
* Safari 5 or more
* Chrome 5 or more

##Dependences
###Use
To use? ***No one libs and frameworks***

###Build
* make
_To build do 'make build' and to build AND minify do 'make'_

###Minify
* python >= 2.7
* internet connection

###Tests
* nodejs
* nodeunit

_To run tests, init and update the submodules..._
````
git submodule init
git submodule update
````

_...install nodeunit:_
````
cd tests/nodeunit
make
sudo make install
````

_Now just run the tests by doing: (in the project root directory)_
````
make tests
````

###Peforamance
To verify peformance do:
````
make peformance
````

##Author

Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU LESSER GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*  
[gnu.org](http://www.gnu.org/copyleft/gpl.html)  
