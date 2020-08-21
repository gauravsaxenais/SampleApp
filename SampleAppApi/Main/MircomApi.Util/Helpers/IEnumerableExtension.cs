using System.Collections.Generic;
using System.Linq;

namespace MircomApi.Util.Helpers
{
  public static class IEnumerableExtension
  {
	public static bool NotNullAndEmpty<T>(this IEnumerable<T> source)
	{
	  if (source != null && source.Any())
		return true;
	  else
		return false;
	}
  }
}
