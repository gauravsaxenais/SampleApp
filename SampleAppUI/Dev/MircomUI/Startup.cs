using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace mircom_tx3_web
{
  public class Startup
  {
	public Startup(IConfiguration configuration)
	{
	  Configuration = configuration;
	}

	public IConfiguration Configuration { get; }

	// This method gets called by the runtime. Use this method to add services to the container.
	public void ConfigureServices(IServiceCollection services)
	{
	  // In production, the Angular files will be served from this directory
	  services.AddSpaStaticFiles(configuration =>
	  {
		configuration.RootPath = "ClientApp/dist";
	  });

	  services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
	}

	// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
	public void Configure(IApplicationBuilder app, IHostingEnvironment env)
	{
	  if (env.IsDevelopment())
	  {
		app.UseDeveloperExceptionPage();
	  }
	  else
	  {
		app.UseExceptionHandler("/Error");
		// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
		app.UseHsts();
	  }

	  app.UseHttpsRedirection();
	  app.UseStaticFiles();
	  app.UseSpaStaticFiles();

	  //hosting static files i.e. angular
	  //install-package Microsoft.Owin.SelfHost
	  //install-package Microsoft.Owin.StaticFiles
	  var options = new FileServerOptions();
	  options.EnableDirectoryBrowsing = true;
	  options.EnableDefaultFiles = true;
	  options.RequestPath = new PathString(string.Empty);
	  options.StaticFileOptions.ServeUnknownFileTypes = true;
	  
	  options.DefaultFilesOptions.DefaultFileNames = new[]
	  {
		"index.html"
	  };

	  app.UseFileServer(options);
	  app.UseMvcWithDefaultRoute();
	  
	  app.UseSpa(spa =>
	  {
		spa.Options.DefaultPage = "/src/index.html";
		spa.Options.SourcePath = "ClientApp";

		if (env.IsDevelopment())
		{
		  spa.UseAngularCliServer(npmScript: "start");
		}
		else
		{
		  app.UseExceptionHandler(errorApp =>
		  {
			errorApp.Run(async context =>
			{
			  context.Response.StatusCode = 500;
			  context.Response.ContentType = "text/html";

			  await context.Response.WriteAsync("<html lang=\"en\"><body>\r\n");
			  await context.Response.WriteAsync("ERROR!<br><br>\r\n");

			  var exceptionHandlerPathFeature =
				  context.Features.Get<IExceptionHandlerPathFeature>();

			  // Use exceptionHandlerPathFeature to process the exception (for example, 
			  // logging), but do NOT expose sensitive error information directly to 
			  // the client.

			  if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
			  {
				await context.Response.WriteAsync("File error thrown!<br><br>\r\n");
			  }

			  await context.Response.WriteAsync("<a href=\"/\">Home</a><br>\r\n");
			  await context.Response.WriteAsync("</body></html>\r\n");
			  await context.Response.WriteAsync(new string(' ', 512)); // IE padding
			});
		  });
		  app.UseHsts();
		}
	  });
	}
  }
}
