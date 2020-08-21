using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class AlertEmailConfig
    {
        public int JobId { get; set; }
        public string EmailSmtpserver { get; set; }
        public string EmailUserName { get; set; }
        public string EmailUserPassword { get; set; }
        public string EmailSenderAddress { get; set; }
        public string EmailDisplayName { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
