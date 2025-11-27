import { UserService } from './user.services';
import { BookService } from './book.services';
import { LoanService } from './loan.services';
import { ReportService } from './report.services';
import { NotificationSystem } from '../patterns/observer/notificationSystem';
import { SystemNotificationObserver } from '../patterns/observer/notificationObservers';

// Crear instancias singleton para que persistan los datos
export const userServiceInstance = new UserService();
export const bookServiceInstance = new BookService();
export const notificationSystemInstance = new NotificationSystem();
export const systemNotificationObserverInstance = new SystemNotificationObserver();

// Adjuntar el observer al sistema de notificaciones
notificationSystemInstance.attach(systemNotificationObserverInstance);

export const loanServiceInstance = new LoanService(
    notificationSystemInstance,
    bookServiceInstance,
    userServiceInstance
);
export const reportServiceInstance = new ReportService(
    loanServiceInstance,
    userServiceInstance,
    bookServiceInstance
);
