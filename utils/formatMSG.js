exports.formatMSG = (username, message) => {
  return {
    username,
    message,
    sent_time: Date.now(),
  };
};
