const User = require('../models/User');
const Match = require('../models/Match');

exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const users = await User.find({ _id: { $ne: currentUser._id } });
    const matches = [];

    users.forEach(user => {
      const learnFromOther = currentUser.skillsToLearn.filter(skill => user.skillsKnown.includes(skill));
      const teachToOther = currentUser.skillsKnown.filter(skill => user.skillsToLearn.includes(skill));
      if (learnFromOther.length > 0 && teachToOther.length > 0) {
        const matchScore = learnFromOther.length + teachToOther.length;
        matches.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          learnFromOther,
          teachToOther,
          matchScore
        });
      }
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
