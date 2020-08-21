using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Dbversion
    {
        public byte MajorVersion { get; set; }
        public byte MinorVersion { get; set; }
        public string ModifiedBy { get; set; }
        public string Changes { get; set; }
    }
}
