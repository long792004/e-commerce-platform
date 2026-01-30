using e_commerce_platform_BE.DataContext;
using Microsoft.EntityFrameworkCore;

namespace e_commerce_platform_BE
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 🔥 BẮT BUỘC CHO RENDER (PORT)
            var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
            builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

            // Add services to the container
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<ProductDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    if (string.IsNullOrEmpty(connectionString))
        throw new Exception("❌ ConnectionStrings__DefaultConnection is missing");

    options.UseNpgsql(connectionString);
});


            // Register repositories and services
            builder.Services.AddScoped<
                e_commerce_platform_BE.Repository.Impl.IProductRepository,
                e_commerce_platform_BE.Repository.ProductRepository>();

            builder.Services.AddScoped<
                e_commerce_platform_BE.Services.Impl.IProductService,
                e_commerce_platform_BE.Services.ProductService>();

            // CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // Auto migrate database
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ProductDbContext>();
                db.Database.Migrate();
            }

            // 🔥 LUÔN BẬT SWAGGER (DEV + PROD)
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowFrontend");
            app.UseAuthorization();
            app.UseStaticFiles();
            app.MapControllers();

            app.Run();
        }
    }
}
