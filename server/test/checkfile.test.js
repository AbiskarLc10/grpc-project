test("Testing the file for github workflows", () => {
  const addFunc = (a, b) => {
    return a + b;
  };

  const result = addFunc(12, 12);

  expect(result).toBe("Trying to fail the git hub action");
});
