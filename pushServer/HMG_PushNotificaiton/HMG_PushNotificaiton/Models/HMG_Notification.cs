using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HMG_PushNotificaiton.Models
{
    public class HMG_Notification
    {
        public int HMG_NotificationId { get; set; }
        public HMG_Device[] Devices { get; set; }
        public String AlertText { get; set; }
        public int BadgeCount { get; set; }
        public String SoundPath { get; set; }
    }
}