import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

// api's
import UserRouter from './routes/user/user';
import BeverageRouter from './routes/beverage/beverage';

export class Server {
    app: express.Application;

    constructor() {

        this.app = express();

        this.config();

        this.routes();

        this.setUpServer();
    }

    config() {
        // CONFIG body-parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));

        // CONFIG mongo database
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect('mongodb://localhost:27017/vittal');
        console.log("successfully connected to MONGODB");
    }

    // Configure API endpoints.
    routes(): void {
        const router = express.Router();
        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log(req.method, req.url);
            res.send({ message: 'api works' });
        });
        this.app.use('/api', router);
        this.app.use('/api/users', UserRouter);
        this.app.use('/api/beverages', BeverageRouter);
    }

    setUpServer() {
        this.app.listen(8000, () => {
            console.log('listening on port 8000');
        });
    }
}
