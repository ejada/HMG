using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Text;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using PushSharp;
using PushSharp.Core;
using PushSharp.WindowsPhone;
using PushSharp.Apple;
using PushSharp.Android;

namespace HMG_PushNotificaiton
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        public static PushBroker applePush;
        public static PushBroker androidPush;
        public static PushBroker winPhonePush;

        protected void Application_Start()
        {
            System.Diagnostics.Debug.WriteLine("Application Start");

            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


            //-------------------------
            // APPLE NOTIFICATIONS
            //-------------------------

            //Create our Apple push services broker
            applePush = new PushBroker();

            //Wire up the events for all the services that the broker registers
            applePush.OnNotificationSent += NotificationSentApple;
            applePush.OnChannelException += ChannelExceptionApple;
            applePush.OnServiceException += ServiceExceptionApple;
            applePush.OnNotificationFailed += NotificationFailedApple;
            applePush.OnDeviceSubscriptionExpired += DeviceSubscriptionExpiredApple;
            applePush.OnDeviceSubscriptionChanged += DeviceSubscriptionChangedApple;
            applePush.OnChannelCreated += ChannelCreatedApple;
            applePush.OnChannelDestroyed += ChannelDestroyedApple;


            //Configure and start Apple APNS
            // IMPORTANT: Make sure you use the right Push certificate.  Apple allows you to generate one for connecting to Sandbox,
            //   and one for connecting to Production.  You must use the right one, to match the provisioning profile you build your
            //   app with!


            var appleCert = File.ReadAllBytes(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Resources/HMG_Smartphone_PushNotDevCert.p12"));
            //IMPORTANT: If you are using a Development provisioning Profile, you must use the Sandbox push notification server 
            //  (so you would leave the first arg in the ctor of ApplePushChannelSettings as 'false')
            //  If you are using an AdHoc or AppStore provisioning profile, you must use the Production push notification server
            //  (so you would change the first arg in the ctor of ApplePushChannelSettings to 'true')
            applePush.RegisterAppleService(new ApplePushChannelSettings(appleCert, "HMG1234")); //Extension method


            //---------------------------
            // ANDROID GCM NOTIFICATIONS
            //---------------------------

            //Create our Android push services broker
            androidPush = new PushBroker();

            //Wire up the events for all the services that the broker registers
            androidPush.OnNotificationSent += NotificationSentAndroid;
            androidPush.OnChannelException += ChannelExceptionAndroid;
            androidPush.OnServiceException += ServiceExceptionAndroid;
            androidPush.OnNotificationFailed += NotificationFailedAndroid;
            androidPush.OnDeviceSubscriptionExpired += DeviceSubscriptionExpiredAndroid;
            androidPush.OnDeviceSubscriptionChanged += DeviceSubscriptionChangedAndroid;
            androidPush.OnChannelCreated += ChannelCreatedAndroid;
            androidPush.OnChannelDestroyed += ChannelDestroyedAndroid;

            //Configure and start Android GCM
            //IMPORTANT: The API KEY comes from your Google APIs Console App, under the API Access section, 
            //  by choosing 'Create new Server key...'
            //  You must ensure the 'Google Cloud Messaging for Android' service is enabled in your APIs Console
            androidPush.RegisterGcmService(new GcmPushChannelSettings("AIzaSyCUhWMdzWc7iLogqQOSiLWCsNAMpPo4L-U"));



            //-----------------------------
            // WINDOWS PHONE NOTIFICATIONS
            //-----------------------------

            //Create our Android push services broker
            winPhonePush = new PushBroker();

            //Wire up the events for all the services that the broker registers
            winPhonePush.OnNotificationSent += NotificationSentWinPhone;
            winPhonePush.OnChannelException += ChannelExceptionWinPhone;
            winPhonePush.OnServiceException += ServiceExceptionWinPhone;
            winPhonePush.OnNotificationFailed += NotificationFailedWinPhone;
            winPhonePush.OnDeviceSubscriptionExpired += DeviceSubscriptionExpiredWinPhone;
            winPhonePush.OnDeviceSubscriptionChanged += DeviceSubscriptionChangedWinPhone;
            winPhonePush.OnChannelCreated += ChannelCreatedWinPhone;
            winPhonePush.OnChannelDestroyed += ChannelDestroyedWinPhone;

            //Configure and start Windows Phone Notifications
            winPhonePush.RegisterWindowsPhoneService();

        }

        // Apple Events
        static void DeviceSubscriptionChangedApple(object sender, string oldSubscriptionId, string newSubscriptionId, INotification notification)
        {
            //Currently this event will only ever happen for Android GCM
            System.Diagnostics.Debug.WriteLine("Apple Device Registration Changed:  Old-> " + oldSubscriptionId + "  New-> " + newSubscriptionId + " -> " + notification);
        }

        static void NotificationSentApple(object sender, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Apple Sent: " + sender + " -> " + notification);
        }

        static void NotificationFailedApple(object sender, INotification notification, Exception notificationFailureException)
        {
            System.Diagnostics.Debug.WriteLine("Apple Failure: " + sender + " -> " + notificationFailureException.Message + " -> " + notification);
        }

        static void ChannelExceptionApple(object sender, IPushChannel channel, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Apple Channel Exception: " + sender + " -> " + exception);
        }

        static void ServiceExceptionApple(object sender, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Apple Channel Exception: " + sender + " -> " + exception);
        }

        static void DeviceSubscriptionExpiredApple(object sender, string expiredDeviceSubscriptionId, DateTime timestamp, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Apple Device Subscription Expired: " + sender + " -> " + expiredDeviceSubscriptionId);
        }

        static void ChannelDestroyedApple(object sender)
        {
            System.Diagnostics.Debug.WriteLine("Apple Channel Destroyed for: " + sender);
        }

        static void ChannelCreatedApple(object sender, IPushChannel pushChannel)
        {
            System.Diagnostics.Debug.WriteLine("Apple Channel Created for: " + sender);
        }

        // Android Events
        static void DeviceSubscriptionChangedAndroid(object sender, string oldSubscriptionId, string newSubscriptionId, INotification notification)
        {
            //Currently this event will only ever happen for Android GCM
            System.Diagnostics.Debug.WriteLine("Android Device Registration Changed:  Old-> " + oldSubscriptionId + "  New-> " + newSubscriptionId + " -> " + notification);
        }

        static void NotificationSentAndroid(object sender, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Android Sent: " + sender + " -> " + notification);
        }

        static void NotificationFailedAndroid(object sender, INotification notification, Exception notificationFailureException)
        {
            System.Diagnostics.Debug.WriteLine("Android Failure: " + sender + " -> " + notificationFailureException.Message + " -> " + notification);
        }

        static void ChannelExceptionAndroid(object sender, IPushChannel channel, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Android Channel Exception: " + sender + " -> " + exception);
        }

        static void ServiceExceptionAndroid(object sender, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Android Channel Exception: " + sender + " -> " + exception);
        }

        static void DeviceSubscriptionExpiredAndroid(object sender, string expiredDeviceSubscriptionId, DateTime timestamp, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Android Device Subscription Expired: " + sender + " -> " + expiredDeviceSubscriptionId);
        }

        static void ChannelDestroyedAndroid(object sender)
        {
            System.Diagnostics.Debug.WriteLine("Android Channel Destroyed for: " + sender);
        }

        static void ChannelCreatedAndroid(object sender, IPushChannel pushChannel)
        {
            System.Diagnostics.Debug.WriteLine("Android Channel Created for: " + sender);
        }

        // Windows Phone Events
        static void DeviceSubscriptionChangedWinPhone(object sender, string oldSubscriptionId, string newSubscriptionId, INotification notification)
        {
            //Currently this event will only ever happen for Android GCM
            System.Diagnostics.Debug.WriteLine("Windows Phone Device Registration Changed:  Old-> " + oldSubscriptionId + "  New-> " + newSubscriptionId + " -> " + notification);
        }

        static void NotificationSentWinPhone(object sender, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Sent: " + sender + " -> " + notification);
        }

        static void NotificationFailedWinPhone(object sender, INotification notification, Exception notificationFailureException)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Failure: " + sender + " -> " + notificationFailureException.Message + " -> " + notification);
        }

        static void ChannelExceptionWinPhone(object sender, IPushChannel channel, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Channel Exception: " + sender + " -> " + exception);
        }

        static void ServiceExceptionWinPhone(object sender, Exception exception)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Channel Exception: " + sender + " -> " + exception);
        }

        static void DeviceSubscriptionExpiredWinPhone(object sender, string expiredDeviceSubscriptionId, DateTime timestamp, INotification notification)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Device Subscription Expired: " + sender + " -> " + expiredDeviceSubscriptionId);
        }

        static void ChannelDestroyedWinPhone(object sender)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Channel Destroyed for: " + sender);
        }

        static void ChannelCreatedWinPhone(object sender, IPushChannel pushChannel)
        {
            System.Diagnostics.Debug.WriteLine("Windows Phone Channel Created for: " + sender);
        }
    }
}