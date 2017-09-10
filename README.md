
# Runtime Type Information

Collect runtime type information 😻 of your JavaScript code.

Run `node demo.js`, then open [localhost:8080](http://localhost:8080). 

*Note: currently needs Node with V8 [tip-op-tree](https://github.com/v8/node).* 

![Image of Demo](https://raw.githubusercontent.com/fhinkel/type-profile/master/images/demo.png)

Compare the runtime type information with your TypeScript or Flow annotations. Or use 
them to find bugs and performance issues. 

For technical details on type profile implementation in V8, see [https://chromium-review.googlesource.com/c/v8/v8/+/508588](https://chromium-review.googlesource.com/c/v8/v8/+/508588).

*Demo based on [@hashseed's](https://github.com/hashseed) demo for [code coverage](https://github.com/hashseed/node-coverage-demo).*