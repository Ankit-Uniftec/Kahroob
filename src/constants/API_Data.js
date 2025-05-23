export default API_Data = {
  // url: 'http://192.168.1.9:8080/api/',
  // url: 'http://13.239.111.178:8080/api/',
  url: 'http://ec2-13-239-111-178.ap-southeast-2.compute.amazonaws.com/api/',
  // url: 'http://localhost:8080/api/',

  getHeaders: (user, language) => {
    if (user) {
      return {
        Authorization: user.session.token,
        'x-language': language || 'ar',
      };
    } else {
      return {
        'x-tenant': 'ev',
        'x-language': language || 'ar',
      };
    }
  },
};
