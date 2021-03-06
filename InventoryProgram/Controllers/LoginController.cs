﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using InventoryProgram.Service;
using System.Reflection.Metadata.Ecma335;
using InventoryProgram.Data.Models;

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
            if (user != null)
            {
                return Ok( new { key = JWTService.GetToken(user.Id.ToString(), user.Username), accessType = user.Access });
            }
            else
            {
                return Unauthorized();
            }
        }
        //Make a new user account
        [HttpPost("signup")]
        public async Task<object> CreateUser([FromBody] UserInfos user)
        {
            await _context.UserInfos.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}