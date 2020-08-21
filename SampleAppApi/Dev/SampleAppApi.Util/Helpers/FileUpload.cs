using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading;

namespace SampleAppApi.Util.Helpers
{
  /// <summary>
  /// This class takes a Base64 encoded string 
  /// and saves the string as a byte[] to a user specified
  /// directory. The class also has exception handling 
  /// in place to check if its a valid base64 encoded string
  /// and has known file types (jpg, gif and png).
  /// The size of the file also should be less than 5 mb.
  /// </summary>
  public abstract class FileUpload
  {
	#region Private Member Variables
	/// <summary>
	/// Max content length of the file.
	/// </summary>
	private const int MaxContentLength = 1024 * 1024 * 5; //Size = 5 MB

	/// <summary>
	/// List of known base64 characters.
	/// </summary>
	private static readonly HashSet<char> _base64Characters = new HashSet<char>() {
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
	'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
	'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
	'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',
	'='
	};
	#endregion

	#region Constructors
	// default constructor
	public FileUpload() { }

	/// <summary>
	/// Constructor which initialises the object with FileAsBase64
	/// string.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	public FileUpload(string fileAsBase64)
	{
	  FileAsBase64 = fileAsBase64;
	}

	/// <summary>
	/// Constructor initialises the file, the root folder
	/// and the folder where the image is going to be stored.
	/// </summary>
	/// <param name="fileAsBase64"></param>
	/// <param name="webPath"></param>
	/// <param name="folderName"></param>
	public FileUpload(string fileAsBase64, string webPath, string folderName)
	{
	  FileAsBase64 = fileAsBase64;
	  WebRootPath = webPath;
	  FolderName = folderName;
	}
	#endregion

	#region Private Methods
	private bool IsFileClosed(string filepath)
	{
	  bool fileClosed = false;
	  int retries = 40;
	  const int delay = 900; // Max time spent here = retries*delay milliseconds

	  if (!File.Exists(filepath))
		return false;

	  do
	  {
		try
		{
		  // Attempts to open then close the file in RW mode, denying other users to place any locks.
		  FileStream fs = File.Open(filepath, FileMode.Open, FileAccess.ReadWrite, FileShare.None);
		  fs.Close();
		  fileClosed = true; // success
		}
		catch (IOException) { }

		retries--;

		if (!fileClosed)
		  Thread.Sleep(delay);
	  }
	  while (!fileClosed && retries > 0);

	  return fileClosed;
	}
	#endregion

	#region Public Properties
	/// <summary>
	/// Name of the file.
	/// </summary>
	public string FileName { get; set; }

	/// <summary>
	/// Size of the file.
	/// </summary>
	public string FileSize { get; set; }

	/// <summary>
	/// The type of the file e.g. jpg, gif or png are allowed
	/// file types.
	/// </summary>
	public string FileType { get; set; }

	/// <summary>
	/// Last modified time of the file.
	/// </summary>
	public long LastModifiedTime { get; set; }

	/// <summary>
	/// Last modified date of the file.
	/// </summary>
	public DateTime LastModifiedDate { get; set; }

	/// <summary>
	/// The file content as base64 encoded string.
	/// This property contains the bytearray
	/// as well as the image type in the 
	/// data
	/// </summary>
	public string FileAsBase64 { get; set; }

	/// <summary>
	/// The name of the folder.
	/// </summary>
	public string FolderName { get; set; }

	/// <summary>
	/// The root path or base url.
	/// </summary>
	public string WebRootPath { get; set; }
	#endregion

	#region Public Methods

	public abstract Dictionary<string, string> GetKnownFileTypes();

	/// <summary>
	/// This method returns bytearray of image.
	/// Base64 string contains both the image type and
	/// image content. This method 
	/// returns imagecontent and strips imagetype information
	/// from the base64 image.
	/// </summary>
	/// <param name="base64String"></param>
	/// <returns></returns>
	public string GetImageByteArray(string base64String)
	{
	  string byteArray = string.Empty;

	  if (!string.IsNullOrWhiteSpace(base64String))
	  {
		// strip off the front meta data
		byteArray = base64String
			  .Substring(base64String.IndexOf(",") + 1);
	  }

	  return byteArray;
	}

	/// <summary>
	/// This method checks FileAsBase64 string 
	/// and retrieves the image extension
	/// from the base64 content string.
	/// </summary>
	/// <returns></returns>
	public string GetFileExtension(string base64String)
	{
	  string fileExtension = string.Empty;

	  foreach (KeyValuePair<string, string> fileType in GetKnownFileTypes())
	  {
		if (base64String.ToLower().Contains(fileType.Key))
		{
		  fileExtension = fileType.Value;
		  break;
		}
	  }

	  return fileExtension;
	}

	/// <summary>
	/// This method takes in a guid
	/// as parameter and generates a file name
	/// for the file.
	/// </summary>
	/// <param name="guid"></param>
	/// <returns></returns>
	public string GetFileName(Guid guid)
	{
	  string path = string.Empty;
	  string fileExtension = string.Empty;

	  if (!string.IsNullOrWhiteSpace(FolderName))
	  {
		fileExtension = GetFileExtension(FileAsBase64);

		if (!string.IsNullOrWhiteSpace(fileExtension))
		{
		  var fileName = $@"{guid}.{fileExtension}";

		  path = Path.Combine(FolderName, fileName);
		}
	  }

	  return path;
	}

	/// <summary>
	/// This method checks if the base64 encoded string
	/// contains known file types.
	/// </summary>
	/// <returns></returns>
	public bool HasKnownExtension()
	{
	  if (!string.IsNullOrWhiteSpace(FileAsBase64))
	  {
		string fileExtension = string.Empty;

		fileExtension = GetFileExtension(FileAsBase64);

		if (string.IsNullOrWhiteSpace(fileExtension))
		  return false;

		return true;
	  }

	  return true;
	}

	/// <summary>
	/// This method checks if the file is within
	/// valid length.
	/// </summary>
	/// <returns></returns>
	public bool HasValidSize()
	{
	  if (!string.IsNullOrWhiteSpace(FileAsBase64))
	  {
		int postedFileLength = FileAsBase64.Length;

		if (postedFileLength < MaxContentLength)
		  return true;

		return false;
	  }

	  return true;
	}

	/// <summary>
	/// This method checks if the base64 encoded
	/// string is a valid base64 encoded string.
	/// </summary>
	/// <returns></returns>
	public bool IsValidBase64String()
	{
	  if (!string.IsNullOrEmpty(FileAsBase64))
	  {
		// strip off the front meta data
		string base64ByteArray = GetImageByteArray(FileAsBase64);

		if (base64ByteArray.Any(c => !_base64Characters.Contains(c)))
		{
		  return false;
		}

		try
		{
		  Convert.FromBase64String(base64ByteArray);
		  return true;
		}
		catch (FormatException)
		{
		  return false;
		}
	  }

	  return true;
	}

	/// <summary>
	/// This method takes in a guid as parameter
	/// and creates a filename for the base64 encoded
	/// string and stores it into a directory.
	/// </summary>
	/// <param name="guid"></param>
	/// <returns></returns>
	public string WriteFileToDirectory(Guid guid)
	{
	  string fullPath = string.Empty;
	  string newPath = string.Empty;
	  string fileExtension = string.Empty;

	  try
	  {
		newPath = Path.Combine(Directory.GetCurrentDirectory(), FolderName);
		fileExtension = GetFileExtension(FileAsBase64);

		if (!string.IsNullOrWhiteSpace(fileExtension))
		{
		  // strip off the file type from the fileData
		  string base64ByteArray = GetImageByteArray(FileAsBase64);

		  var fileName = $@"{guid}.{fileExtension}";

		  fullPath = Path.Combine(newPath, fileName);

		  // convert the file to binary
		  // store the file in the same way it was receieved from client
		  byte[] fileAsByteArray = Convert.FromBase64String(base64ByteArray);

		  // finally write the file to a disk
		  // Create a new FileStream object and pass the byte array to the Write() method of this method.
		  // Pass in a zero as the second parameter and the length of the byte array as the third parameter 
		  // so the complete file is written to disk.

		  using (var fs = new FileStream(
		   fullPath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
		  {
			fs.Write(fileAsByteArray, 0,
					 fileAsByteArray.Length);
		  }

		  // Check if the file is closed after write.
		  IsFileClosed(fullPath);
		}
	  }
	  catch (Exception)
	  { }

	  return fullPath;
	}
	#endregion
  }
}
