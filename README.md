
# Runtime Type Information

Collect runtime type information 😻 of your JavaScript code.

This is a demo how you could use V8's new type information feature.

V8 can now collect type information at runtime. V8 is Google’s open source JavaScript engine. Chrome, Node.js, and many other applications use V8. This type profiler is built into the engine, the information is not statically inferred.

The [V8 inspector protocol](https://chromedevtools.github.io/devtools-protocol/v8/Profiler/#method-startTypeProfile) provides access to the type information. Since the inspector is available in Node (see [Node Documentation](https://nodejs.org/dist/latest-v8.x/docs/api/inspector.html)), it's easy to write modules that utilize type information. This repo is a very simple demo of this.

![Image of Demo](https://raw.githubusercontent.com/fhinkel/type-profile/master/images/demo.png)

Compare the runtime type information with your TypeScript or Flow annotations. Or use 
them to find bugs and performance issues. 

For technical details on type profile implementation in V8, see [https://chromium-review.googlesource.com/c/v8/v8/+/508588](https://chromium-review.googlesource.com/c/v8/v8/+/508588) and the [Design Doc](https://docs.google.com/document/d/1JY7pUCAk8gegyi6UkIdln6j_AeJqQucZg92advaMJY4/edit?usp=sharing).

*Demo based on [@hashseed's](https://github.com/hashseed) demo for [code coverage](https://github.com/hashseed/node-coverage-demo).*

## Installation 
Run `npm start`, then open [localhost:8080](http://localhost:8080). 

*Note: currently needs Node master, TypeProfile is not in 9.4. You can build from source or download a [nightly build](https://nodejs.org/download/nightly/).* 