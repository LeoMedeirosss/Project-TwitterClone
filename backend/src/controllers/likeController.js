const Like = require('../models/Like');

// Like tweet
exports.likeTweet = async (req, res) => {
  const { id } = req.params; // ID tweet
  const user_id = req.user.id;

  try {
    // Check if user already liked this tweet using model
    const alreadyLiked = await Like.isLiked({ user_id, tweet_id: id });
    if (alreadyLiked) {
      // Se já curtiu, retorna o estado atual sem erro
      const likeCount = await Like.countByTweetId(id);
      return res.json({ 
        message: 'Tweet já estava curtido.',
        likeCount,
        alreadyLiked: true
      });
    }

    // Create like using model
    const like = await Like.create({ user_id, tweet_id: id });

    // Get updated like count
    const likeCount = await Like.countByTweetId(id);

    res.json({ 
      like,
      message: 'Tweet curtido com sucesso!',
      likeCount 
    });
  } catch (err) {
    console.error("Erro ao curtir tweet:", err);
    res.status(500).json({ error: err.message });
  }
};

// Remove like
exports.unlikeTweet = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if user has liked this tweet
    const hasLiked = await Like.isLiked({ user_id, tweet_id: id });
    if (!hasLiked) {
      // Se não curtiu, retorna o estado atual sem erro
      const likeCount = await Like.countByTweetId(id);
      return res.json({ 
        message: 'Tweet já não estava curtido.',
        likeCount,
        wasNotLiked: true
      });
    }

    // Remove like using model
    const removedLike = await Like.remove({ user_id, tweet_id: id });
    
    // Get updated like count
    const likeCount = await Like.countByTweetId(id);

    res.json({ 
      message: 'Like removido com sucesso.',
      likeCount 
    });
  } catch (err) {
    console.error("Erro ao remover like:", err);
    res.status(500).json({ error: err.message });
  }
};