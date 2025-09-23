const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Upload avatar do usuário
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Buscar usuário atual para deletar avatar antigo se existir
    const currentUser = await User.findById(userId);
    if (currentUser && currentUser.avatar_url) {
      const oldAvatarPath = path.join(__dirname, '../../', currentUser.avatar_url);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Atualizar avatar no banco de dados
    await User.updateAvatar(userId, avatarUrl);

    // Buscar usuário atualizado
    const updatedUser = await User.findById(userId);

    res.json({
      message: 'Avatar atualizado com sucesso',
      user: updatedUser,
      avatarUrl: avatarUrl
    });

  } catch (error) {
    console.error('Erro no upload do avatar:', error);
    
    // Deletar arquivo se houve erro
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/avatars/', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Remover avatar do usuário
exports.removeAvatar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar usuário atual
    const currentUser = await User.findById(userId);
    if (currentUser && currentUser.avatar_url) {
      // Deletar arquivo físico
      const avatarPath = path.join(__dirname, '../../', currentUser.avatar_url);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }

      // Remover do banco de dados
      await User.updateAvatar(userId, null);
    }

    res.json({ message: 'Avatar removido com sucesso' });

  } catch (error) {
    console.error('Erro ao remover avatar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
