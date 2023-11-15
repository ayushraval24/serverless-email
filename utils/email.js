module.exports.isBase64 = str => {
  try {
    const decoded = Buffer.from(str, "base64").toString("utf-8");
    return decoded === str;
  } catch (error) {
    return false;
  }
};
