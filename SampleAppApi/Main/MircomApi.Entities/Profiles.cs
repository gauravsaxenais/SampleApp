using System;
using System.Collections.Generic;

namespace MircomApi.Entities
{
    public partial class Profiles
    {
        public Profiles()
        {
            ResProfileCorr = new HashSet<ResProfileCorr>();
        }

        public int JobId { get; set; }
        public int ProfileId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string WorkPhone { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string Email { get; set; }
        public string AptNo { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string ZipPostal { get; set; }
        public string Department { get; set; }
        public string Notes { get; set; }
        public byte[] Photo { get; set; }
        public byte[] RowVersion { get; set; }

        public virtual Jobs Job { get; set; }
        public virtual ICollection<ResProfileCorr> ResProfileCorr { get; set; }
        public virtual ICollection<CardProfileCorr> CardProfileCorrs { get; set; }
  }
}
