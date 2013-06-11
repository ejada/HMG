using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using HMG_PushNotificaiton.Models;
using PushSharp;
using PushSharp.Core;
using PushSharp.WindowsPhone;
using PushSharp.Apple;
using PushSharp.Android;


namespace HMG_PushNotificaiton.Controllers
{
    public class HMG_NotificationController : ApiController
    {


        // POST api/HMG_NotificationController
        public HttpResponseMessage PostHMG_Notification(HMG_Notification hmg_notification)
        {
            if (ModelState.IsValid)
            {
                SendNotification(hmg_notification);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, hmg_notification);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = hmg_notification.HMG_NotificationId }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

  //      protected override void Dispose(bool disposing)
   //     {
            //Stop and wait for the queues to drains
      //      WebApiApplication.push.StopAllServices();

  //          Console.WriteLine("Queue Finished, press return to exit...");
  //          Console.ReadLine();

       //     db.Dispose();
  //          base.Dispose(disposing);
 //       }

        private void SendNotification(HMG_Notification hmg_notification)
        {

            for (int i = 0; i < hmg_notification.Devices.Length; i++)
            {
                if (hmg_notification.Devices[i].DevicePlatform == "iOS")
                {
                    //Fluent construction of an iOS notification
                    //IMPORTANT: For iOS you MUST MUST MUST use your own DeviceToken here that gets generated within your iOS app itself when the Application Delegate
                    //  for registered for remote notifications is called, and the device token is passed back to you
                    WebApiApplication.applePush.QueueNotification(new AppleNotification()
                                               .ForDeviceToken(hmg_notification.Devices[i].DeviceToken)
                                               .WithAlert(hmg_notification.AlertText)
                                               .WithBadge(hmg_notification.BadgeCount)
                                               .WithSound(hmg_notification.SoundPath));
                }
                else if (hmg_notification.Devices[i].DevicePlatform == "Android")
                {
                    //Fluent construction of an Android GCM Notification
                    //IMPORTANT: For Android you MUST use your own RegistrationId here that gets generated within your Android app itself!
                    WebApiApplication.androidPush.QueueNotification(new GcmNotification().ForDeviceRegistrationId(hmg_notification.Devices[i].DeviceToken)
                                          .WithJson("{\"message\":\"" + hmg_notification.AlertText + "\",\"msgcnt\":" + hmg_notification.BadgeCount + ",\"soundname\":\"" + hmg_notification.SoundPath + "\"}"));
                }
                else if (hmg_notification.Devices[i].DevicePlatform == "WinPhone")
                {
                    //Fluent construction of a Windows Phone Toast notification
                    //IMPORTANT: For Windows Phone you MUST use your own Endpoint Uri here that gets generated within your Windows Phone app itself!
                    WebApiApplication.winPhonePush.QueueNotification(new WindowsPhoneToastNotification()
                        .ForEndpointUri(new Uri(hmg_notification.Devices[i].DeviceToken))
                        .ForOSVersion(WindowsPhoneDeviceOSVersion.Eight)
                        .WithBatchingInterval(BatchingInterval.Immediate)
                        .WithNavigatePath("/MainPage.xaml?NavigatedFrom=" + hmg_notification.AlertText)
                        .WithText1("HMG")
                        .WithText2(hmg_notification.AlertText));
                }
            }


            System.Diagnostics.Debug.WriteLine("Waiting for Queue to Finish...");


        }
    }
}