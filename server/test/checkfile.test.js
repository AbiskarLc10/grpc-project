test("Testing the file for github workflows", () => {
  const addFunc = (a, b) => {
    return a + b;
  };

  const result = addFunc(12, 12);

  expect(result).toBe(24);
});
