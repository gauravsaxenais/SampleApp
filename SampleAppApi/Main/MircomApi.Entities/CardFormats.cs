using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class CardFormats
    {
        public int JobId { get; set; }
        public int CardFormatId { get; set; }
        public bool? IsCustom { get; set; }
        public int BitNumber { get; set; }
        public string Name { get; set; }
        public byte? TotalLength { get; set; }
        public byte? CardNumStart { get; set; }
        public byte? CardNumLength { get; set; }
        public byte? FacCodeStart { get; set; }
        public byte? FacCodeLength { get; set; }
        public byte? SecCodeStart { get; set; }
        public int? SecCode { get; set; }
        public long? SecCodeMask { get; set; }
        public byte? EvenParityPos { get; set; }
        public long? EvenParityMask { get; set; }
        public byte? OddParityPos { get; set; }
        public long? OddParityMask { get; set; }
        public byte? EvenParityPos1 { get; set; }
        public long? EvenParityMask1 { get; set; }
        public byte? OddParityPos1 { get; set; }
        public long? OddParityMask1 { get; set; }

        public virtual Jobs Job { get; set; }
    }
}
