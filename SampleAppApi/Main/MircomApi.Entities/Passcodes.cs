using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Passcodes
    {
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public byte PasscodeLevel { get; set; }
        public int Passcode { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Panels Panels { get; set; }
    }
}
