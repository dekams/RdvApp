using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RdvApp.API.Models;
using System.Text;
using System.Security.Cryptography;

namespace RdvApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext context;

        public AuthRepository(DataContext context)
        {
            this.context = context;
        }

        public async Task<User> Login(string username, string password)
        {
            var user =  await context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return null;

            bool isSameHash = VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt);

            if (isSameHash)
                return user;

            return null;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var buffer = UTF8Encoding.UTF8.GetBytes(password);
                var newPasswordHash = hmac.ComputeHash(buffer);

                return passwordHash.SequenceEqual(newPasswordHash);
            }
        }

        public async Task<User> Register(User user, string password)
        {
            var (passwordHash, passwordSalt) = CreatePasswordHash(password);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();

            return user;
        }

        private (byte[] passwordHash, byte[] passwordSalt) CreatePasswordHash(string password)
        {
            using (var hmac = new HMACSHA512())
            {
                var buffer = UTF8Encoding.UTF8.GetBytes(password);

                return (hmac.ComputeHash(buffer), hmac.Key);
            }
        }

        public async Task<bool> UserExists(string username)
        {
            return await context.Users.AnyAsync(u => u.Username == username);
        }
    }
}
