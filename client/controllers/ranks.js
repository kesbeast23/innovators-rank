const User = require('../models/User');
/**
 * GET /ranks
 * List of developers ranked.
 */
exports.getRankings = (req, res) => {
    User
        .find({})
        .sort({
            "rank.score": -1
        })
        // .limit(100)
        .exec((err, ranks) => {
            if (err) return err;
            res.render('ranks', {
                title: 'Rankings',
                users: ranks
            });
        });
};