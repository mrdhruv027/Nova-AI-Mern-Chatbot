const ImageKit = require('imagekit');

let imagekitInstance = null;

const getImageKit = () => {
  if (imagekitInstance) return imagekitInstance;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (publicKey && privateKey && urlEndpoint) {
    try {
      imagekitInstance = new ImageKit({
        publicKey,
        privateKey,
        urlEndpoint,
      });
      console.log(' ImageKit initialized successfully.');
    } catch (err) {
      console.warn(' Failed to initialize ImageKit:', err.message);
    }
  } else {
    console.warn(' ImageKit credentials not completely provided in .env. Mock upload mode enabled.');
  }

  return imagekitInstance;
};

module.exports = { getImageKit };
