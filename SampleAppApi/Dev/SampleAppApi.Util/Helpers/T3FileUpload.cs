using System.Collections.Generic;

namespace SampleAppApi.Util.Helpers
{
  /// <summary>
  /// This class implements T3file upload functionality to a directory.
  /// </summary>
  public class T3FileUpload : FileUpload
  {
	// default constructor
	public T3FileUpload() : base() { }

	/// <summary>
	/// Constructor which initialises the object with FileAsBase64
	/// string.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	public T3FileUpload(string fileAsBase64) : base(fileAsBase64) { }

	/// <summary>
	/// Constructor initialises the file, the root folder
	/// and the folder where the image is going to be stored.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	/// <param name="webPath"></param>
	/// <param name="folderName"></param>
	public T3FileUpload(string fileAsBase64, string webPath, string folderName) : base(fileAsBase64, webPath, folderName) { }

	public override Dictionary<string, string> GetKnownFileTypes()
	{
	  return new Dictionary<string, string>
	  {
	  { "application/octet-stream", "t3" }
	};
	}
  }
}
