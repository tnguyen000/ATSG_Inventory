using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using InventoryProgram.Data;
using InventoryProgram.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using InventoryProgram.Service;
using System.Reflection.Metadata.Ecma335;

namespace InventoryProgram.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class LoginController : ControllerBase
    {
        private InventoryContext _context;

        public LoginController(InventoryContext context)
        {
            _context = context;
        }
        //Check login credentials
        [HttpPost]
        public async Task<object> LoginUser([FromBody] UserInfos body)
        {
            var user = await _context.UserInfos.FirstOrDefaultAsync(c => c.Username == body.Username);
            if (user.Password == body.Password)
            {
                return Ok(JWTService.GetToken(user.Id.ToString(), user.Username));
            }

            else
            {
                return Unauthorized();
            }
        }
        //Make a new user account
        [HttpPost("signup")]
        public async Task<object> CreateUser([FromBody] Data.UserInfos user)
        {
            await _context.UserInfos.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}