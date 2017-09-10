function foo(x) {
  if (x < 2) {
    return 1;
  }
  return "hello";
}

foo({});
foo(1);
foo(1.5);
foo("another string");


