(function() {
  function foo(x) {
    if (x < 2) {
      return 1;
    }
    return "What are the return types of foo?";
  }

  class Rectangle {};

  foo({});
  foo(1);
  foo(1.5);
  foo("some string");
  foo(new Rectangle());

})();


