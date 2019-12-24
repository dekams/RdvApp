using System.Collections.Generic;
using System.Linq;
using System.IO;
using RdvApp.API.Models;
using System.Security.Cryptography;
using System.Text;
using Newtonsoft.Json;

namespace RdvApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach (var user in users)
                {
                    var (passwordHash, passwordSalt) = CreatePasswordHash("password");

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();

                    context.Users.Add(user);
                }
                context.SaveChanges();
            }
        }

        private static (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var buffer = Encoding.UTF8.GetBytes(password);

                return (hmac.ComputeHash(buffer), hmac.Key);
            }
        }
    }
}
