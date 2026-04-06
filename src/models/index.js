const User = require('./User');
const Category = require('./Category');
const News = require('./News');
const Comment = require('./Comment');
const DailyStat = require('./DailyStat');


Category.hasMany(News, { foreignKey: 'categoryId', as: 'news' });
News.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(News, { foreignKey: 'authorId', as: 'news' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

News.hasMany(Comment, { foreignKey: 'newsId', as: 'comments' });
Comment.belongsTo(News, { foreignKey: 'newsId', as: 'news' });

module.exports = {
    User,
    Category,
    News,
    Comment,
    DailyStat
};
