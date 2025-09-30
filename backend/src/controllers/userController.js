const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload user avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Search current user to delete old avatar if exists
    const currentUser = await User.findById(userId);
    if (currentUser && currentUser.avatar_url) {
      const oldAvatarPath = path.join(__dirname, '../../', currentUser.avatar_url);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update avatar in database
    await User.updateAvatar(userId, avatarUrl);

    // Search updated user
    const updatedUser = await User.findById(userId);

    res.json({
      message: 'Avatar atualizado com sucesso',
      user: updatedUser,
      avatarUrl: avatarUrl
    });

  } catch (error) {
    console.error('Erro no upload do avatar:', error);
    
    // Delete file if error occurred  
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/avatars/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Remove user avatar
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Search current user to delete old avatar if exists
    const currentUser = await User.findById(userId);
    if (currentUser && currentUser.avatar_url) {
      // Delete physical file
      const avatarPath = path.join(__dirname, '../../', currentUser.avatar_url);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      // Remove from database
      await User.updateAvatar(userId, null);
    }

    res.json({ message: 'Avatar removido com sucesso' });

  } catch (error) {
    console.error('Erro ao remover avatar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
