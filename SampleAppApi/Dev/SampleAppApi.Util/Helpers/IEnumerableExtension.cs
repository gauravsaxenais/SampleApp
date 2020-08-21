using System.Collections.Generic;
using System.Linq;

namespace SampleAppApi.Util.Helpers
{
  public static class IEnumerableExtension
  {
	/// <summary>
	/// This method checks if a collection
	/// is empty and not null. 
	/// </summary>
	/// <typeparam name="T"></typeparam>
	/// <param name="source"></param>
	/// <returns></returns>
	public static bool NotNullAndEmpty<T>(this IEnumerable<T> source)
	{
	  if (source != null && source.Any())
		return true;
	  else
		return false;
	}
  }
}
