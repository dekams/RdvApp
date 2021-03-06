﻿using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RdvApp.API.Data;
using RdvApp.API.Dtos;
using RdvApp.API.Models;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace RdvApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository repo;
        private readonly IConfiguration config;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            this.repo = repo;
            this.config = config;
            this.mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            // photoUrl = userFromRepo?.Photos?.FirstOrDefault(p => p.IsMain)?.Url
            return Ok(new {
                token = tokenHandler.WriteToken(token),
                current = mapper.Map<UserForListDto>(userFromRepo)
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exist");

            var userToCreate = mapper.Map<User>(userForRegisterDto);

            var createdUser = await repo.Register(userToCreate, userForRegisterDto.Password);
            var userToReturn = mapper.Map<UserForDetailedDto>(createdUser);

            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);
        }
    }
}