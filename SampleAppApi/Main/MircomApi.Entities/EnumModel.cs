using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MircomApi.Entities
{
  public class EnumModel
  {
	public byte Language { get; set; }

	public short EnumID { get; set; }

	public int Value { get; set; }

	public string Text { get; set; }
  }
}
