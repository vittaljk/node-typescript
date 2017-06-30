import { Router, Request, Response, NextFunction } from 'express';
import { User } from './user.model';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

export const superSecret = 'ilovecoffee';

class UserRouter {
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
     *   maps to end points
    */

    init(): void {
        this.router.get('/', this.getAllUsers);
        this.router.post('/', this.fetchUserById);
        this.router.post('/signup', this.signup);
        this.router.post('/login', this.login);
    }

    /**
     *  returns all users
    */
    getAllUsers(req: Request, res: Response): void {
        User.find((err, users) => {
            if (err) console.log(err);
            res.json(users);
        })
    }

    /**
     * signup endpoint
    */
    //  TODO remove this later
    signup(req: Request, res: Response): void {
        const user = new User({
            name: req.body.name,
            user_name: req.body.user_name,
            email: req.body.email
        })
        user.user_id = user.gernerateUserId(req.body.name);
        user.password = user.generateHash(req.body.password);
        user.save((err) => {
            if (err) {
                // console.log(err);
                res.send(err);
            } else {
                res.json({
                    message: 'new user created'
                })
            }
        })
    }

    /**
     * Login endpoint
    */
    login(req: Request, res: Response): void {
        User.findOne({
            user_name: req.body.user_name
        }).select('user_name user_id password').exec((err, user) => {
            if (err) console.log(err);
            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else if (user) {
                // check if password matches
                const loggenInuser = new User(user);
                if (!loggenInuser.comparePassword(req.body.password, user.password)) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    // create a token
                    const token = jwt.sign({
                            user_name: user.user_name,
                            user_id: user.user_id
                        }, superSecret, {
                        expiresIn: 60*60*24*365// expires in 24 hours
                    });
                    res.json({
                        success: true,
                        message: 'Enjoy your token',
                        token: token,
                        user_id: user.user_id
                    });
                }
            }
        });
    }

    /**
     * fetch user by Id
    */
    fetchUserById(req: Request, res: Response): void {
        User.findOne({
            user_id: req.body.user_id
        }).select('name email user_name').exec((err, user) => {
            res.json(user);
        });
    }
}

const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;
