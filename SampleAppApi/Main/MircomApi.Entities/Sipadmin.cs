using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Sipadmin
    {
        public int JobId { get; set; }
        public string AdminUserName { get; set; }
        public string Password { get; set; }
        public string Apiendpoint { get; set; }
    }
}
