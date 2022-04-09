import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
class Config {
	createNotification = (type,msg) => {
		//alert(type)
		//return () => {
			switch (type) {
				case 'info':
					NotificationManager.info('Info message');
				break;
				case 'success':
					NotificationManager.success('Success: '+msg, 'Success Message!', 5000);
				break;
				case 'warning':
					NotificationManager.warning('Warning: '+msg, 'Warning Message!', 5000);
				break;
				case 'error':
					NotificationManager.error('Error: '+msg, 'Error Message!', 5000, () => {
						//alert('callback');
					});
				break;
				case 'refresh':
					document.getElementById('btn-id').click();
				break;
				default:
			}
		//};
	};	
}
export default new Config();