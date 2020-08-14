using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using InventoryProgram.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Security.Claims;

namespace InventoryProgram.Controllers
{
    [ApiController]
    [Route("/api/inventory")]
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
            var owners = await _context.Owner.ToListAsync();
            var locations= await _context.Locations.ToListAsync();
            var categories = await _context.Categories.ToListAsync();
            var type = await _context.Inventory.ToListAsync();
            return new { items = type, categories = categories, locations = locations, owners = owners}; 
        }
        //Add a product to Inventory List
        [HttpPost]
        public async Task<object> PostAsync([FromBody] InventoryProgram.Data.Models.Inventory inventory)
        {
            await _context.Inventory.AddAsync(inventory);
            await _context.SaveChangesAsync();
            return inventory;
        }

        // Add a category to dropdown list
        [HttpPost("category")]
        public async Task<object> NewCategory([FromBody] string categorie)
        {
            await _context.Categories.AddAsync(new Categories { Name = categorie });
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Add a owner to dropdown list
        [HttpPost("owner")]
        public async Task<object> NewOwner([FromBody] string owner)
        {
            await _context.Owner.AddAsync(new Owner { Name = owner});
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Add a location to dropdown list
        [HttpPost("location")]
        public async Task<object> NewLocation([FromBody] string locations)
        {
            await _context.Locations.AddAsync(new Locations { Name = locations });
            await _context.SaveChangesAsync();
            return Ok();
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
        public async Task<ActionResult> EditInventory([FromRoute] int id, [FromBody] InventoryProgram.Data.Models.Inventory body)
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

            return Ok(inventory);
        }

        //Sorting inventory list 
        [HttpPost("sort")]
        public async Task<object> GetSortedList([FromBody] int sortChoice)
        {
            var allItems = await _context.Inventory.ToListAsync();
            List<InventoryProgram.Data.Models.Inventory> returnList = new List<InventoryProgram.Data.Models.Inventory>();

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
        //Search inventory list
        [HttpPost("search")]
        public async Task<ActionResult<object>> SearchInventory([FromBody] string requestSearch)
        {
            var inventories = await _context.Inventory.ToListAsync();

            Dictionary<int, int> items = new Dictionary<int, int>();
            foreach (var item in inventories)
            {
                int count = 0;
                foreach (var prop in item.GetType().GetProperties())
                {
                    if (prop.GetValue(item).ToString().ToLower().Contains(requestSearch.ToLower()))
                    {
                        count++;
                    }
                }
                items[inventories.IndexOf(item)] = count;
            }

            List<Data.Models.Inventory> info = new List<Data.Models.Inventory>();
            foreach (var item in items)
            {
               if (item.Value > 0)
                    info.Add(inventories[item.Key]);
            }
            return Ok(info);
        }
    }
}
