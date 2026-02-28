const authRoutes = require('./auth');
const skillsRoutes = require('./skills');
const matchRoutes = require('./match');
const requestRoutes = require('./request');
const postRoutes = require('./post');
// ...existing code...
module.exports = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/skills', skillsRoutes);
  app.use('/api/match', matchRoutes);
  app.use('/api/request', requestRoutes);
  app.use('/api/post', postRoutes);
  // ...add other routes here...
};
