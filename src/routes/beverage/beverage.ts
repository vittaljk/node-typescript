import { message } from 'gulp-typescript/release/utils';
import { Router, Request, Response, NextFunction } from 'express';
import { Beverage } from './beverage.model';
import * as _ from 'underscore';
import * as jwt from 'jsonwebtoken';
import { superSecret } from '../user/user';

// cost of beverage
const cost_per_beverage = 8;

class BeverageRouter {
    router: Router;

    /**
     *  initializes router
     *  calls init method
    */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     *  initializes all endpoints
    */
    init(): void {
        this.router.get('/cost_per_beverage', this.costPerBeverage);
        this.router.post('/make_entry', this.makeEntry);
        this.router.post('/get_day_count', this.countForTheDay);
        this.router.post('/get_month_count', this.countForTheMonth);
        this.router.post('/get_year_count', this.countForTheYear);
    }

    /**
     * MiddleWare that validates token
    */
    tokenValidator(token: string, callback: (status: boolean) => void) {
        jwt.verify(token, superSecret, (err, decoded) => {
            if (err) {
                console.log(err);
                callback(false);
            }
            if (decoded) {
                callback(true);
            }
        });
    }

    /**
     * returns cost per beverage
    */
    costPerBeverage(req: Request, res: Response): void {
        res.json({ 'cost_per_beverage': cost_per_beverage });
    }
    /**
     *  makes entry of beverage
    */
    makeEntry(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                const beverage = new Beverage({
                    user_id: req.body.user_id,
                    coffee_count: req.body.coffee_count,
                    tea_count: req.body.tea_count,
                    milk_count: req.body.milk_count,
                    badam_milk_count: req.body.badam_milk_count,
                    day: req.body.day,
                    month: req.body.month,
                    year: req.body.year
                });
                beverage.save(err => {
                    if (err) console.log(err);
                    console.log("************entered successfully****************")
                })
                res.json({
                    message: 'entry done successfully'
                })
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        })
    }

    /**
     *   gives count of beverages drank per day
    */
    countForTheDay(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'day': req.body.day,
                            'month': req.body.month,
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_day': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_day': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log('responding count for the day', result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        });
    }

    /**
     *  gives count of beverages drank per month
    */
    countForTheMonth(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'month': req.body.month,
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_month': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_month': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log('responding count for the month', result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        })
    }

    /**
     *   gives count of beverages drank per year
    */
    countForTheYear(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_year': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_year': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log('responding count for the year', result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        })

    }

    /**
     *   gives count of beverages drank per day by user
    */
    countForTheDayByUser(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'user_id': req.body.user_id,
                            'day': req.body.day,
                            'month': req.body.month,
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_day_by_user': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_day_by_user': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log(`responding count for the day by user with id ${req.body.user_id}`, result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        });
    }

    /**
     *  gives count of beverages drank per month by user
    */
    countForTheMonthByUser(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'user_id': req.body.user_id,
                            'month': req.body.month,
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_month_by_user': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_month_by_user': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log(`responding count for the month by user with id ${req.body.user_id}`, result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        })
    }

     /**
     *   gives count of beverages drank per year
    */
    countForTheYearByUser(req: Request, res: Response): void {
        beverageRoutes.tokenValidator(req.body.token, (valid: boolean) => {
            if (valid) {
                Beverage.aggregate([
                    {
                        $match: {
                            'user_id': req.body.user_id,
                            'year': req.body.year
                        }
                    },
                    {
                        $project: {
                            'total': { $add: ['$coffee_count', '$tea_count', '$milk_count', '$badam_milk_count'] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            'count_for_year': { $sum: '$total' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            'count_for_year': 1
                        }
                    }
                ], (err: any, result: Object[]) => {
                    if (err) console.log(err);
                    console.log(`responding count for the year by user with id ${req.body.user_id}`, result);
                    res.json(result);
                });
            } else {
                res.json({ message: 'valid token required to make request' });
            }
        })

    }
}

const beverageRoutes = new BeverageRouter();
beverageRoutes.init();

export default beverageRoutes.router;
