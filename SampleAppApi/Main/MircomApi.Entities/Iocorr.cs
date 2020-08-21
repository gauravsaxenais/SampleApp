using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Iocorr
    {
        public int CorrId { get; set; }
        public int JobId { get; set; }
        public int PanelId { get; set; }
        public int InputId { get; set; }
        public int InputData { get; set; }
        public int InputData2 { get; set; }
        public int InputData3 { get; set; }
        public byte Action { get; set; }
        public int OutputPanelId { get; set; }
        public int OutputId { get; set; }
        public int OutputData { get; set; }
        public short Duration { get; set; }
        public int ScheduleId { get; set; }
        public bool Enabled { get; set; }

        public virtual Io Io { get; set; }
    }
}
