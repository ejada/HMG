/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License. 
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Microsoft.Phone.Controls;
using System.IO;
using System.Windows.Media.Imaging;
using System.Windows.Resources;
using System.Text;
using Microsoft.Phone.Notification;


namespace HMG
{
    public partial class MainPage : PhoneApplicationPage
    {

       // PushClient client;
        String notificationAlert = null;

        // Constructor
        public MainPage()
        {
            InitializeComponent();

         //   client = new PushClient();
            RegisterForToast();

            this.CordovaView.StartPageUri = new Uri("/www/index_en.html", UriKind.Relative);
            this.CordovaView.Loaded += CordovaView_Loaded;
            
        }


        private void CordovaView_Loaded(object sender, RoutedEventArgs e)
        {
            this.CordovaView.Loaded -= CordovaView_Loaded;
            // first time load will have an animation
            Storyboard _storyBoard = new Storyboard();
            DoubleAnimation animation = new DoubleAnimation()
            {
                From = 0,
                Duration = TimeSpan.FromSeconds(0.6),
                To = 90
            };
            Storyboard.SetTarget(animation, SplashProjector);
            Storyboard.SetTargetProperty(animation, new PropertyPath("RotationY"));
            _storyBoard.Children.Add(animation);
            _storyBoard.Begin();
            _storyBoard.Completed += Splash_Completed;
        }
          

        void Splash_Completed(object sender, EventArgs e)
        {
            (sender as Storyboard).Completed -= Splash_Completed;
            LayoutRoot.Children.Remove(SplashImage);

            if (notificationAlert != null)
            {
                this.CordovaView.Browser.InvokeScript("onNotificationWinPhone", notificationAlert);
                notificationAlert = null;
            }
        }

        protected override void OnNavigatedTo(System.Windows.Navigation.NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            //  If we navigated to this page
            // from the MainPage, the DefaultTitle parameter will be "FromMain".  If we navigated here
            // when the secondary Tile was tapped, the parameter will be "FromTile".


            try
            {
                String notificationMsg = this.NavigationContext.QueryString["NavigatedFrom"];
                MessageBox.Show(notificationMsg);
                this.notificationAlert = notificationMsg;
               // this.CordovaView.Browser.InvokeScript("onNotificationWinPhone", notificationMsg);
            }
            catch (Exception)
            {
                
                //throw;
            }
           
        }

        public void RegisterForToast()
        {
            /// Holds the push channel that is created or found.
            HttpNotificationChannel pushChannel;

            // The name of our push channel.
            // Note : This should match the Device Registration Channel Uri specified on the server
            //i.e. -> .ForEndpointUri(new Uri("DEVICE REGISTRATION CHANNEL URI HERE"))
            string channelName = "HMG.NotificationChannel.Toast";

            // Try to find the push channel.
            pushChannel = HttpNotificationChannel.Find(channelName);

            // If the channel was not found, then create a new connection to the push service.
            if (pushChannel == null)
            {
                pushChannel = new HttpNotificationChannel(channelName);

                // Register for all the events before attempting to open the channel.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>((sender, e) =>
                {
                    //Tell server of the new channel uri
                    System.Diagnostics.Debug.WriteLine("PushChannel URI Updated: " + e.ChannelUri.ToString());
                    this.CordovaView.Browser.InvokeScript("winPhoneTokenHandler", e.ChannelUri.ToString());

                });
                pushChannel.ErrorOccurred += new EventHandler<NotificationChannelErrorEventArgs>((sender, e) =>
                {
                    //Error occurred
                    System.Diagnostics.Debug.WriteLine("PushChannel Error: " + e.ErrorType.ToString() + " -> " + e.ErrorCode + " -> " + e.Message + " -> " + e.ErrorAdditionalData);
                });

                //// Register for this notification only if you need to receive the notifications while your application is running.
                pushChannel.ShellToastNotificationReceived += new EventHandler<NotificationEventArgs>((sender, e) =>
                {

                    System.Diagnostics.Debug.WriteLine("Notification Received");
                    //Yay notification
                    PushChannel_ShellToastNotificationReceived(sender, e);
                });

                pushChannel.Open();
            }
            else
            {
                // The channel was already open, so just register for all the events.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>((sender, e) =>
                {
                    //Updated uri
                    System.Diagnostics.Debug.WriteLine("PushChannel URI Updated: " + e.ChannelUri.ToString());
                    this.CordovaView.Browser.InvokeScript("winPhoneTokenHandler", e.ChannelUri.ToString());
                });
                pushChannel.ErrorOccurred += new EventHandler<NotificationChannelErrorEventArgs>((sender, e) =>
                {
                    //Error occurred
                    System.Diagnostics.Debug.WriteLine("PushChannel Error: " + e.ErrorType.ToString() + " -> " + e.ErrorCode + " -> " + e.Message + " -> " + e.ErrorAdditionalData);
                });

                // Bind this new channel for toast events.
                if (pushChannel.IsShellToastBound)
                    System.Diagnostics.Debug.WriteLine("Already Bound to Toast");
                else
                    pushChannel.BindToShellToast();

                if (pushChannel.IsShellTileBound)
                    System.Diagnostics.Debug.WriteLine("Already Bound to Tile");
                else
                    pushChannel.BindToShellTile();

                //// Register for this notification only if you need to receive the notifications while your application is running.
                pushChannel.ShellToastNotificationReceived += new EventHandler<NotificationEventArgs>((sender, e) =>
                {
                    //Yay
                    System.Diagnostics.Debug.WriteLine("Notification Received");
                    PushChannel_ShellToastNotificationReceived(sender, e);
                });
            }

            // Bind this new channel for toast events.
            if (pushChannel.IsShellToastBound)
                System.Diagnostics.Debug.WriteLine("Already Bound to Toast");
            else
                pushChannel.BindToShellToast();

            if (pushChannel.IsShellTileBound)
                System.Diagnostics.Debug.WriteLine("Already Bound to Tile");
            else
                pushChannel.BindToShellTile();

            // Display the URI for testing purposes. Normally, the URI would be passed back to your web service at this point.
            if (pushChannel != null && pushChannel.ChannelUri != null)
                System.Diagnostics.Debug.WriteLine("Channel Uri:" + pushChannel.ChannelUri.ToString());
        }

        public void PushChannel_ShellToastNotificationReceived(object sender, NotificationEventArgs e)
        {
            StringBuilder message = new StringBuilder();
            string relativeUri = string.Empty;
            string alertText = string.Empty;

            System.Diagnostics.Debug.WriteLine("Received Toast: " + message.ToString());
            message.AppendFormat("Received Toast {0}:\n", DateTime.Now.ToShortTimeString());

            // Parse out the information that was part of the message.
            foreach (string key in e.Collection.Keys)
            {
                message.AppendFormat("{0}: {1}\n", key, e.Collection[key]);
                
                if (string.Compare(
                    key,
                    "wp:Param",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.CompareOptions.IgnoreCase) == 0)
                {
                    relativeUri = e.Collection[key];
                }
                else if(string.Compare(
                    key,
                    "wp:Text2",
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.CompareOptions.IgnoreCase) == 0)
                {
                    alertText = e.Collection[key];
                }
            }

            // Display a dialog of all the fields in the toast.
            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                MessageBox.Show(message.ToString());
                this.CordovaView.Browser.InvokeScript("onNotificationWinPhone", alertText);
            });

            
        }

    }
}
