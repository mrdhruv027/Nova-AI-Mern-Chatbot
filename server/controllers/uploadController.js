const { getImageKit } = require('../config/imagekit');
const crypto = require('crypto');

// @desc    Get ImageKit client upload authentication params
// @route   GET /api/upload/imagekit-auth
// @access  Private
const getImageKitAuth = async (req, res) => {
  const ik = getImageKit();
  if (ik) {
    try {
      const authParams = ik.getAuthenticationParameters();
      return res.json({
        success: true,
        ...authParams,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      });
    } catch (err) {
      console.warn('ImageKit auth error:', err.message);
    }
  }

  // Fallback mock upload auth token for client side when ImageKit credentials missing
  const token = crypto.randomBytes(16).toString('hex');
  const expire = Math.floor(Date.now() / 1000) + 1800;
  const signature = crypto.createHmac('sha1', 'mock_private_key').update(token + expire).digest('hex');

  return res.json({
    success: true,
    token,
    expire,
    signature,
    publicKey: 'mock_public_key',
    urlEndpoint: 'https://ik.imagekit.io/mock_demo',
    isMock: true,
  });
};

// @desc    Backend Proxy Image Upload to ImageKit
// @route   POST /api/upload
// @access  Private
const uploadImage = async (req, res, next) => {
  try {
    const { fileBase64, fileName = 'chat_image.png' } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ success: false, message: 'Base64 image string is required' });
    }

    const ik = getImageKit();
    if (ik) {
      const result = await ik.upload({
        file: fileBase64,
        fileName: `${Date.now()}_${fileName}`,
        folder: '/nova_ai_uploads',
      });

      return res.json({
        success: true,
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        thumbnailUrl: result.thumbnailUrl,
      });
    }

    // Demo fallback image URL if ImageKit credentials not configured
    return res.json({
      success: true,
      url: fileBase64.startsWith('data:') ? fileBase64 : `data:image/png;base64,${fileBase64}`,
      fileId: `mock_${Date.now()}`,
      name: fileName,
      thumbnailUrl: fileBase64.startsWith('data:') ? fileBase64 : `data:image/png;base64,${fileBase64}`,
      isMock: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImageKitAuth,
  uploadImage,
};
