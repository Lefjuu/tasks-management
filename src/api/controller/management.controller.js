const AppError = require('../../util/error/AppError');
const CatchError = require('../../util/error/CatchError');
const { managementService } = require('../service');

exports.getStats = CatchError(async (req, res, next) => {
    const stats = await managementService.getStats();
    if (stats instanceof AppError) {
        return next(new AppError('You have no access', 403));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: stats,
        },
    });
});
