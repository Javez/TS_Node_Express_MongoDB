import express, { Application } from 'express';
import { connect } from 'mongoose';
import errorMiddleware from './middleware/error.middleware';
import bodyParser from 'body-parser';
import Controller from './controllers/controller.interface';
import cookieParser from 'cookie-parser';

class App {
    public app: Application;
    public port: number;

    constructor(controllers: Array<Controller>, port: number) {
        this.app = express();
        this.port = port;

        this.connectToDB();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Array<Controller>) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router)
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Succesfully started on the port ${this.port}`)
        })
    }

    private async connectToDB() {
        const result = await connect(process.env.MONGO_URL!, { dbName: process.env.MONGO_DB_NAME });
        console.log("Succesfuly connected to db");
    }
}

export default App;