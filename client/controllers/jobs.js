/**
 * GET /
 * Jobs page.
 */
exports.getJobs = (req, res) => {
    res.render('jobs', {
        title: 'Jobs'
    });
};

exports.getJob = (req, res) => {
    res.render('job', {
        title: 'Job - '
    });
};

exports.getAddJob = (req, res) => {
    res.render('admin/add_job', {
        title: 'Add Job'
    });
};