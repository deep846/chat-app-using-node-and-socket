const generateMessage = (text,username) => {
  return {
    text: text,
    createdAt: new Date().getTime(),
    username: username,
  };
};

const geoMessage = (lat, lon, username) => {
  return {
    latatude: lat,
    longitude: lon,
    createdAt: new Date().getTime(),
    username: username,
  };
};

module.exports = {
  generateMessage,
  geoMessage,
};
