const QRCode = require('qrcode');

module.exports = async (otpauthUrl) => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    throw new Error('Error generating QR code');
  }
};
