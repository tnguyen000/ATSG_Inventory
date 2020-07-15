using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using InventoryProgram.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryProgram.Controllers
{
    [ApiController]
    [Route("inventory")]
    public class InventoryController : ControllerBase
    {
        private InventoryContext _context;

        public InventoryController(InventoryContext context)
        {
            _context = context;
        }
        //Shows data from database
        [HttpGet]
        public async Task<object> GetAsync()
        {
            return await _context.Inventory.ToListAsync();
        }
        //Add a product to Inventory List
        [HttpPost]
        public async Task<object> PostAsync([FromBody] Data.Inventory inventory)
        {
            await _context.Inventory.AddAsync(inventory);
            await _context.SaveChangesAsync();
            return inventory;
        }

        //Delete a product from Inventory List
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteInventory([FromRoute] int id)
        {
            var inventory = await _context.Inventory.FindAsync(id);
            if (inventory == null)
            {
                return NotFound();
            }
            _context.Inventory.Remove(inventory);
            await _context.SaveChangesAsync();

            return Ok();
        }

        //Edit and update product in Inventory List
        [HttpPut("update/{id}")]
        public async Task<ActionResult> EditInventory([FromRoute] int id, [FromBody] InventoryProgram.Data.Inventory body)
        {
            var inventory = await _context.Inventory.FindAsync(id);
            if (inventory == null)
            {
                return NotFound();
            }
            inventory.ModelName = body.ModelName;
            inventory.SerialNumber = body.SerialNumber;
            inventory.HostName = body.HostName;
            inventory.IpAddress = body.IpAddress;
            inventory.Category = body.Category;
            inventory.Owner = body.Owner;
            inventory.Location = body.Location;
            await _context.SaveChangesAsync();

            return Ok();
        }

        //Sorting inventory list 
        [HttpPost("sort")]
        public async Task<object> GetSortedList([FromBody] int sortChoice)
        {
            var allItems = await _context.Inventory.ToListAsync();
            List<InventoryProgram.Data.Inventory> returnList = new List<InventoryProgram.Data.Inventory>();

            if (sortChoice == 1)
            {
                returnList = allItems.OrderBy(inv => inv.ModelName).ToList();
            }
            else if (sortChoice == 2)
            {
                returnList = allItems.OrderBy(inv => inv.SerialNumber).ToList();
            }
            else if (sortChoice == 3)
            {
                returnList = allItems.OrderBy(inv => inv.HostName).ToList();
            }
            else if (sortChoice == 4)
            {
                returnList = allItems.OrderBy(inv => inv.IpAddress).ToList();
            }
            else if (sortChoice == 5)
            {
                returnList = allItems.OrderBy(inv => inv.Category).ToList();
            }
            else if (sortChoice == 6)
            {
                returnList = allItems.OrderBy(inv => inv.Owner).ToList();
            }
            else if (sortChoice == 7)
            {
                returnList = allItems.OrderBy(inv => inv.Location).ToList();
            }

            return returnList;
        }



    }
}
