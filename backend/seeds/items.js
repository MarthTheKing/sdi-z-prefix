/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('items').del()
  await knex('items').insert([
    {userid:1,name:'the throngler',desc:'it throngles',quantity:1},
    {userid:2,name:'400 v-bucks',desc:'400 fortnite v-bucks! all yours! 400 fortnite v-bucks!! this is REAL!!! all we need are your credit card number, the expiration date, and the three funny numbers on the back!!',quantity:400},
    {userid:3,name:'creative name',desc:'creative description',quantity:999999999}
  ]);
};
