using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MircomApi.Entities
{
  public class CardProfileCorr
  {
	public int JobID { get; set; }

	public int CardID { get; set; }

	public int ProfileID { get; set; }

	public byte[] RowVersion { get; set; }

	public virtual Cards Card { get; set; }

	public virtual Profiles Profile { get; set; }
  }
}
