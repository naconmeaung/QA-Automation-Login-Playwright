export const validUser = {
  username: 'tomsmith',
  password: 'SuperSecretPassword!'
};

export const invalidUser = {
  username: 'wronguser',
  password: 'wrongpass'
};

export const sqlInjectionUser = {
  username: "' OR '1'='1",
  password: "' OR '1'='1"
};
