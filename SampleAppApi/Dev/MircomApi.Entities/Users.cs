using System;
using System.Collections.Generic;

namespace SampleAppApi.Entities
{
    public partial class Users : BaseEntity
  {
        public Users()
        {
            Reports = new HashSet<Reports>();
        }

        public int UserId { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public byte Active { get; set; }
        public long Rights { get; set; }
        public Guid UserGuid { get; set; }

        public virtual ICollection<Reports> Reports { get; set; }
    }
}
