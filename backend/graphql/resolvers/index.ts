module.exports = {
  Mutation: {
    signup: (data: any) => {
      console.log(data);
    },
    login: (data: any) => {
      console.log(data);
    },
  },
  Query: {
    getUsers: (data: any) => {
      console.log(data);
      return [{ id: 12, email: "test@gmail.com", password: "test" }];
    },
    isLoggedIn: (data: any) => {
      console.log(data);
    },
  },
};
