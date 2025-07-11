import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import { AuthRouter } from './routers/auth.router';
import { OauthRouter } from './routers/oauth.router';
import { ProfileRouter } from './routers/profile.router';
import { PropertyCategoryRouter } from './routers/propertyCategory.router';
import { PropertyRouter } from './routers/property.router';
import { RoomRouter } from './routers/room.router';
import { RoomAvailabilityRouter } from './routers/roomAvailability.router';
import { PeakSeasonRateRouter } from './routers/peakSeasonRate.router';
import { CatalogRouter } from './routers/catalog.router';
import { PropertyExploreRouter } from './routers/propertyExplore.router';
import { BookingRouter } from './routers/booking.router';
import { MidtransRouter } from './routers/midtrans.router';
import { DashboardRouter } from './routers/dashboard.router';
import { ReviewRouter } from './routers/review.router';
import { ReportRouter } from './routers/report.router';
import { WishlistRouter } from './routers/wishlist.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    this.app.use('/api', new AuthRouter().router);
    this.app.use('/api', new OauthRouter().router);
    this.app.use('/api', new ProfileRouter().router);
    this.app.use('/api', new PropertyCategoryRouter().router);
    this.app.use('/api', new PropertyRouter().router);
    this.app.use('/api', new RoomRouter().router);
    this.app.use('/api', new RoomAvailabilityRouter().router);
    this.app.use('/api', new PeakSeasonRateRouter().router);
    this.app.use('/api', new CatalogRouter().router);
    this.app.use('/api', new PropertyExploreRouter().router);
    this.app.use('/api', new BookingRouter().router);
    this.app.use('/api', new MidtransRouter().router);
    this.app.use('/api', new DashboardRouter().router);
    this.app.use('/api', new ReviewRouter().router);
    this.app.use('/api', new ReportRouter().router);
    this.app.use('/api', new WishlistRouter().router);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
